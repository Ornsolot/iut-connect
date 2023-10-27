package services

import (
	functs "api-iutconnect/internal/models/functions"
	schema "api-iutconnect/internal/models/schema"
)

func GetByID(id int32) (schema.Account, error) {
	var account schema.Account
	account, err := functs.GetAccountByID(id)
	return account, err
}

func GetByMail(mail string) (schema.Account, error) {
	var account schema.Account
	account, err := functs.GetAccountByMail(mail)
	return account, err
}

func Confirm(mail string) (schema.Account, error) {
	var account schema.Account
	account, err := functs.ConfirmAccount(mail)
	return account, err
}

func RenewPassword(mail string, password string) (schema.Account, error) {
	var account schema.Account
	account, err := functs.RenewPasswordAccount(mail, password)
	return account, err
}

func HidePassword(account *schema.Account) {
	functs.HideAccountPassword(account)
}
