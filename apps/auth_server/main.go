package main

import (
	"auth_server/db"
	"auth_server/routes"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
)

func main() {
	// MongoDB önce bağlansın
	db.ConnectMongo()

	app := fiber.New()

	routes.RegisterRoutes(app)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("✅ Auth Server listening on http://localhost:%s", port)
	log.Fatal(app.Listen(":" + port))
}
