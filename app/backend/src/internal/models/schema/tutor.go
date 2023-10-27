package models

type Tutor struct {
	Account
	UniversityMail
	FirstName string `json:"first_name"`
	IsAdmin   bool   `json:"is_admin"`
}
