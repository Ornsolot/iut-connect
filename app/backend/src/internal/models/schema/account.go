package models

import (
	"time"
)

var Roles = []string{
	"company",
	"student",
	"tutor",
}

type Account struct {
	ID        uint64    `json:"id"`
	Mail      string    `json:"mail"`
	Password  string    `json:"password"`
	Name      string    `json:"name"`
	Role      string    `json:"role"`
	Confirmed bool      `json:"confirmed"`
	CreatedAt time.Time `json:"created_at"`
}
