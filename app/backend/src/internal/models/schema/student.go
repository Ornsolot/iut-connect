package models

import (
	"database/sql"
)

type Student struct {
	Account
	UniversityMail
	TutorID   sql.NullInt64  `json:"tutor_id"`
	FirstName string         `json:"first_name"`
	State     sql.NullString `json:"state"`
	CV        []byte         `json:"cv"`
	Bio       sql.NullString `json:"bio"`

	MasterName      sql.NullString `json:"master_name"`
	MasterFirstName sql.NullString `json:"master_first_name"`
	MasterFunction  sql.NullString `json:"master_function"`
	MasterMail      sql.NullString `json:"master_mail"`
	MasterPhone     sql.NullString `json:"master_phone"`
}
