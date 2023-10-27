package models

import (
	"time"
)

type Session struct {
	ID        uint64    `json:"id"`
	UserId    uint64    `json:"user_id"`
	UserAgent string    `json:"user_agent"`
	ClientIp  string    `json:"client_ip"`
	ExpiresAt time.Time `json:"expires_at"`
	CreatedAt time.Time `json:"created_at"`
}
