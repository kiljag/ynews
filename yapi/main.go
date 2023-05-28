package main

import "fmt"

func main() {

	top := GetMissing(FetchYTop500())
	fmt.Println("found : ", len(top))

	for i, id := range top {
		fmt.Println(i, "fetching ask thread ", id)
		items := FetchYAskItems(id)
		InsertAskItem(id, items)
	}
}
