package db

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client

func ConnectMongo() *mongo.Client {
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
	}

	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err := mongo.NewClient(clientOptions)
	if err != nil {
		log.Fatalf("❌ Mongo client oluşturulamadı: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatalf("❌ Mongo bağlantı hatası: %v", err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatalf("❌ Mongo ping hatası: %v", err)
	}

	log.Println("✅ MongoDB bağlantısı kuruldu!")
	Client = client
	return client
}

func GetCollection(name string) *mongo.Collection {
	if Client == nil {
		log.Fatal("❌ MongoDB client henüz başlatılmadı. Önce ConnectMongo() çağırılmalı.")
	}
	return Client.Database("auth_db").Collection(name)
}
