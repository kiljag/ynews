package main

import (
	"database/sql"
	"fmt"
	"strings"

	_ "github.com/lib/pq"
)

func GetConnection() *sql.DB {
	db, err := sql.Open("postgres", "user=yuser password=H@ck3rNews host=localhost dbname=ynews sslmode=disable")
	if err != nil {
		panic(err)
	}

	return db
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

	db := GetConnection()
	defer db.Close()

	// insert into yitem
	stmt1, err := db.Prepare("INSERT INTO yitem (id, userid, title, content, unixstamp, parent, rootid) VALUES ($1, $2, $3, $4, $5, $6, $7)")
	if err != nil {
		panic(err)
	}
	defer stmt1.Close()

	itmap := make(map[int64]bool, 0)
	for _, it := range items {
		stmt1.Exec(&it.Id, &it.UserId, &it.Title, &it.Content, &it.Unix, &it.Parent, rootId)
		itmap[it.Id] = true
	}

	// insert into ykid
	stmt2, err := db.Prepare("INSERT INTO ykid (id, kid, rootid) VALUES ($1, $2, $3)")
	if err != nil {
		panic(err)
	}
	defer stmt2.Close()

	for _, it := range items {
		for _, k := range it.Kids {
			if _, ok := itmap[k]; ok { // check if yitem exists
				stmt2.Exec(it.Id, k, rootId)
			}
		}
	}

	fmt.Println("inserted root yitem", rootId)
}
