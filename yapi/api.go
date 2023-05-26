package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sync"
)

type YItem struct {
	UserId  string  `json:"by"`
	Id      int64   `json:"id"`
	Kids    []int64 `json:"kids"`
	Parent  int64   `json:"parent"`
	Content string  `json:"text"`
	Unix    int64   `json:"time"`
	Type    string  `json:"string"`
}

func yGet(u string) []byte {

	res, err := http.Get(u)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		panic(err)
	}

	return body
}

// Fetch top 500 Ask HN conversations
func FetchYTop500() []int64 {
	body := yGet("https://hacker-news.firebaseio.com/v0/askstories.json?print=pretty")
	var ids []int64
	err := json.Unmarshal(body, &ids)
	if err != nil {
		panic(err)
	}
	return ids
}

func FetchItem(id int64) *YItem {
	body := yGet(fmt.Sprintf("https://hacker-news.firebaseio.com/v0/item/%d.json?print=pretty", id))
	y := &YItem{}
	err := json.Unmarshal(body, y)
	if err != nil {
		panic(err)
	}

	return y
}

// set up a worker group
func fetchAskItems(rootId int64) <-chan *YItem {

	in := make(chan int64)
	out := make(chan *YItem)

	var wg sync.WaitGroup
	var ig sync.WaitGroup // input group

	worker := func() {
		defer wg.Done()
		for id := range in {
			yitem := FetchItem(id)
			fmt.Println("fetched item : ", id)
			out <- yitem
			go func() {
				for _, kid := range yitem.Kids {
					ig.Add(1)
					in <- kid
				}
				ig.Done() // item fetch completed
			}()
		}
	}

	numWorkers := 5
	wg.Add(numWorkers)
	for i := 0; i < numWorkers; i++ {
		go worker()
	}

	ig.Add(1)
	in <- rootId

	go func() {
		ig.Wait()
		close(in)

		wg.Wait()
		close(out)
	}()

	return out
}

// Fetch Ask HN conversation (post and comments) using parent id
func FetchYAskItems(id int64) []*YItem {

	items := make([]*YItem, 0)
	out := fetchAskItems(id)

	for item := range out {
		items = append(items, item)
	}

	fmt.Println("fetched items : ", len(items))
	return items
}
