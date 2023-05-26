package main

import "fmt"

func main() {

	top500 := GetMissing(FetchYTop500())
	fmt.Println("found : ", len(top500))

	for i, id := range top500 {
		fmt.Println(i, "fetching ask thread ", id)
		items := FetchYAskItems(id)
		InsertAskItem(id, items)
	}
}
