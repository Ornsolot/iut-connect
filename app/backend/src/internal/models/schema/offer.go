package models

import (
	"database/sql"
)

type Offer struct {
	Company
	ID           uint64         `json:"id"`
	ComName      string         `json:"com_name"`
	Name         string         `json:"name"`
	Mail         string         `json:"mail"`
	Phone        string         `json:"phone"`
	Presentation string         `json:"companyPresentation"`
	Context      sql.NullString `json:"context"`
	Result       sql.NullString `json:"condition"`
	Sector       sql.NullString `json:"sector"`
	Tools        sql.NullString `json:"tools"`
	Attachment   sql.NullString `json:"attachment"`
	Date         string         `json:"date"`
	URL          sql.NullString `json:"url"`
	Archived     bool           `json:"archived"`
	Approved     bool           `json:"approved"`
}
