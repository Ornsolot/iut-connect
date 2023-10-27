package models

type Employee struct {
	Company
	Account
	FirstName string `json:"first_name"`
	ComName   string `json:"com_name"`
}
