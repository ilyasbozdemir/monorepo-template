package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"GOMongoDBServer/internal/handlers"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://admin:secret@localhost:27017/?authSource=admin"))

	if err != nil {
		log.Fatal(err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	dbHandler := &handlers.DatabaseHandler{Client: client}

	http.HandleFunc("/v1/database-management/list", dbHandler.ListDatabases)
	http.HandleFunc("/v1/database-management/test-connection", dbHandler.TestConnection)

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
