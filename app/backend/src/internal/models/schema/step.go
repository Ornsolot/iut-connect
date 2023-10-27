package models

type Step struct {
	EventID     uint64 `json:"event_id"`
	StudentID   uint64 `json:"student_id"`
	IsValidated bool   `json:"is_validated"`
}

type CompleteStep struct {
	Event
	StudentID   uint64 `json:"student_id"`
	IsValidated bool   `json:"is_validated"`
}
