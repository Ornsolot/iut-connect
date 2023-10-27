package models

import (
	"database/sql"
)

type Program struct {
	ProgID     uint64         `json:"program_id"`
	YearGroup  sql.NullString `json:"year_group"`
	Department sql.NullString `json:"department"`
	Major      sql.NullString `json:"major"`
}
