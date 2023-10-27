package models

type UniversityMail struct {
	Program
	UnivID  uint64 `json:"univ_id"`
	MailUBS string `json:"mail_ubs"`
}
