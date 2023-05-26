package main

func main() {

	id := int64(36068677)
	items := FetchYThread(id)
	InsertAskItem(id, items)
}
