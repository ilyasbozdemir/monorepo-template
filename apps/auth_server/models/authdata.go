package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// User MongoDB'de kullanıcı verisini temsil eder
type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email     string             `bson:"email" json:"email"`
	Password  string             `bson:"password,omitempty" json:"password,omitempty"`
	Name      string             `bson:"name" json:"name"`
	CreatedAt int64              `bson:"created_at" json:"created_at"`
	UpdatedAt int64              `bson:"updated_at" json:"updated_at"`
}
