package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// Fetch top 500 Ask HN conversations
func FetchYTop500() []int64 {
	yurl := "https://hacker-news.firebaseio.com/v0/askstories.json?print=pretty"
	res, err := http.Get(yurl)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		panic(err)
	}

	var ids []int64
	err = json.Unmarshal(body, &ids)
	if err != nil {
		panic(err)
	}
	return ids
}

type YItem struct {
	UserId  string  `json:"by"`
	Id      int64   `json:"id"`
	Kids    []int64 `json:"kids"`
	Parent  int64   `json:"parent"`
	Content string  `json:"text"`
	Unix    int64   `json:"time"`
	Type    string  `json:"string"`
}

func fetchItem(id int64, done chan *YItem) {
	// fmt.Println("fetching item : ", id)
	var y YItem
	yurl := fmt.Sprintf("https://hacker-news.firebaseio.com/v0/item/%d.json?print=pretty", id)
	res, err := http.Get(yurl)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		panic(err)
	}

	err = json.Unmarshal(body, &y)
	if err != nil {
		panic(err)
	}

	done <- &y
}

// Fetch Ask HN conversation (post and comments) using parent id
func FetchYThread(id int64) []*YItem {

	ids := []int64{id}
	limit := 100
	done := make(chan *YItem)
	items := make([]*YItem, 0)

	for len(ids) > 0 {

		go fetchItem(ids[0], done)
		y := <-done
		items = append(items, y)
		ids = ids[1:]
		if limit > 0 {
			ids = append(ids, y.Kids...)
			limit = limit - len(y.Kids)
		}
	}

	return items
}
