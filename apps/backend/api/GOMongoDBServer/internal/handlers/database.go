package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"go.mongodb.org/mongo-driver/mongo"
)

type DatabaseHandler struct {
	Client *mongo.Client
}

// ListDatabases örnek handler
func (h *DatabaseHandler) ListDatabases(w http.ResponseWriter, r *http.Request) {
	dbs, err := h.Client.ListDatabaseNames(context.Background(), map[string]interface{}{})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(dbs)
}

// TestConnection örnek handler
func (h *DatabaseHandler) TestConnection(w http.ResponseWriter, r *http.Request) {
	err := h.Client.Ping(context.Background(), nil)
	if err != nil {
		http.Error(w, "MongoDB not connected", http.StatusServiceUnavailable)
		return
	}
	w.Write([]byte("MongoDB connected"))
}
