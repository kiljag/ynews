package main

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

func InsertAskItem(rootId int64, items []*YItem) {

	conn, err := sql.Open("postgres", "user=yuser password=H@ck3rNews host=localhost dbname=ynews")
	if err != nil {
		panic(err)
	}

	fmt.Println("connected to database")
	defer conn.Close()

	itmap := make(map[int64]string, 0)
	for _, item := range items {
		stmt := fmt.Sprintf("insert into yitem (id, userid, content, unixstamp, parent, rootid) values (%d, '%s', '%s', %d, %d, %d)",
			item.Id, item.UserId, item.Content, item.Unix, item.Parent, rootId)
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
