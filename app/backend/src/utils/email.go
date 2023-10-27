package utils

import (
	ini "api-iutconnect/config"
	"regexp"

	"gopkg.in/gomail.v2"
)

func ValidMailSyntax(email string) bool {
	emailRegex := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	reg := regexp.MustCompile(emailRegex)
	return reg.MatchString(email)
}

func SendMail(to string, subject string, body string) {
	msg := gomail.NewMessage()
	msg.SetHeader("From", ini.Env.Mailer.Mail)
	msg.SetHeader("To", to)
	msg.SetHeader("Subject", subject)
	msg.SetBody("text/html", body)
	n := gomail.NewDialer(ini.Env.Mailer.Server, ini.Env.Mailer.Port, ini.Env.Mailer.Mail, ini.Env.Mailer.Pswd)

	if err := n.DialAndSend(msg); err != nil {
		panic(err)
	}
}
