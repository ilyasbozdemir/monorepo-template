package routes

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"auth_server/db"
	"auth_server/models"
	"auth_server/utils"
)

// Ana auth route grubu
func RegisterRoutes(app *fiber.App) {
	auth := app.Group("/auth")

	auth.Post("/register", Register)
	auth.Post("/login", Login)
	auth.Get("/verify", Verify)
}

// 🔹 REGISTER
func Register(c *fiber.Ctx) error {
	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Geçersiz istek formatı",
		})
	}

	collection := db.GetCollection("users")

	// Aynı email var mı kontrol et
	var existing models.User
	err := collection.FindOne(context.TODO(), bson.M{"email": user.Email}).Decode(&existing)
	if err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Bu email zaten kayıtlı",
		})
	}

	// Şifreyi hashle
	hashed, err := utils.HashPassword(user.Password)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Şifre hashlenemedi",
		})
	}

	user.Password = hashed
	user.ID = primitive.NewObjectID()
	user.CreatedAt = time.Now().Unix()
	user.UpdatedAt = time.Now().Unix()

	_, err = collection.InsertOne(context.TODO(), user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Kullanıcı kaydı başarısız oldu",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Kullanıcı başarıyla oluşturuldu",
	})
}

// 🔹 LOGIN
func Login(c *fiber.Ctx) error {
	var creds struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&creds); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Geçersiz istek formatı",
		})
	}

	collection := db.GetCollection("users")

	var user models.User
	err := collection.FindOne(context.TODO(), bson.M{"email": creds.Email}).Decode(&user)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Kullanıcı bulunamadı",
		})
	}

	if !utils.CheckPasswordHash(creds.Password, user.Password) {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Şifre hatalı",
		})
	}

	token, err := utils.GenerateJWT(user.ID.Hex())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Token üretilemedi",
		})
	}

	return c.JSON(fiber.Map{
		"token":   token,
		"user_id": user.ID.Hex(),
	})
}

// 🔹 VERIFY
func Verify(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Authorization header eksik",
		})
	}

	tokenStr := authHeader[len("Bearer "):]
	claims, err := utils.ValidateJWT(tokenStr)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Token geçersiz",
		})
	}

	return c.JSON(fiber.Map{
		"valid":   true,
		"user_id": claims["user_id"],
	})
}
