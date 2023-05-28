package main

import (
	"database/sql"
	"fmt"
	"strings"

	_ "github.com/lib/pq"
)

func GetConnection() *sql.DB {
	conn, err := sql.Open("postgres", "user=yuser password=H@ck3rNews host=localhost port=6543 dbname=ynews sslmode=disable")
	if err != nil {
		panic(err)
	}

	return conn
}

func GetMissing(ids []int64) []int64 {

	conn := GetConnection()
	defer conn.Close()

	idlist := make([]string, 0)
	idmap := make(map[int64]bool)
	for _, id := range ids {
		idlist = append(idlist, fmt.Sprintf("%d", id))
		idmap[id] = true
	}
	stmt := fmt.Sprintf("select distinct rootid from yitem where rootid in (%s)", strings.Join(idlist, ","))
	rows, err := conn.Query(stmt)
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	//iterate over rows
	for rows.Next() {
		var id int64
		err := rows.Scan(&id)
		if err != nil {
			panic(err)
		}
		delete(idmap, id)
	}

	if err = rows.Err(); err != nil {
		panic(err)
	}

	result := []int64{}
	for id := range idmap {
		result = append(result, id)
	}
	return result
}

func InsertAskItem(rootId int64, items []*YItem) {

	conn := GetConnection()
	defer conn.Close()

	itmap := make(map[int64]string, 0)
	for _, item := range items {
		stmt := fmt.Sprintf("insert into yitem (id, userid, title, content, unixstamp, parent, rootid) values (%d, '%s', '%s', '%s', %d, %d, %d)",
			item.Id, item.UserId, item.Title, item.Content, item.Unix, item.Parent, rootId)
		itmap[item.Id] = stmt
	}

	kidmap := make(map[int64][]string, 0)
	for _, item := range items {
		kids := make([]string, 0)
		for _, kid := range item.Kids {
			if _, ok := itmap[kid]; ok { // if kid item exists
				stmt := fmt.Sprintf("insert into ykid (id, kid, rootid) values (%d, %d, %d)", item.Id, kid, rootId)
				kids = append(kids, stmt)
			}
		}

		if len(kids) > 0 {
			kidmap[item.Id] = kids
		}
	}

	//TODO: include in a transaction
	for _, v := range itmap {
		conn.Exec(v)
	}
	for _, vlist := range kidmap {
		for _, v := range vlist {
			conn.Exec(v)
		}
	}

	fmt.Println("insert root yitem", rootId)
}
