package models

import "database/sql"

type Event struct {
	ID           uint64    `json:"id"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	Deadline     string    `json:"deadline"`
	Icon         string    `json:"icon"`
	Color        string    `json:"color"`
	Programs     []uint64  `json:"programs"`
	ProgramsData []Program `json:"programs_data"`
}

type RawEvent struct {
	ID          uint64         `json:"id"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Deadline    string         `json:"deadline"`
	Icon        string         `json:"icon"`
	Color       string         `json:"color"`
	ProgramID   uint64         `json:"program_id"`
	YearGroup   sql.NullString `json:"year_group"`
	Department  sql.NullString `json:"department"`
	Major       sql.NullString `json:"major"`
}