# syntax=docker/dockerfile:1
FROM golang:1.25-alpine

WORKDIR /app

COPY go.mod* ./
RUN go mod tidy

COPY . .

RUN go build -o main ./cmd/server/main.go

CMD ["./main"]
