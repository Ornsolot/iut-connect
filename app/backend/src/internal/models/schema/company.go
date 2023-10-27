package models

import (
	"database/sql"
)

type Company struct {
	ComID      sql.NullInt64  `json:"com_id"`
	ComName    string         `json:"com_name"`
	City       string         `json:"city"`
	PostalCode uint64         `json:"postal_code"`
	WebsiteURL sql.NullString `json:"website_url"`
	Contact    sql.NullString `json:"contact"`
	Country    sql.NullString `json:"country"`
}
