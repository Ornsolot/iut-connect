package models

import (
	schema "api-iutconnect/internal/models/schema"
	"api-iutconnect/utils"
)

const (
	hiddenField = "********"
)

func GetAccountByID(id int32) (schema.Account, error) {
	statement := `
		SELECT * 
		FROM account 
		WHERE id = $1;
	`
	rows, err := db.Query(statement, id)
	if err != nil {
		return schema.Account{}, err
	}

	var account schema.Account
	for rows.Next() {
		err = rows.Scan(
			&account.ID, &account.Name, &account.Mail, &account.Password, &account.Confirmed, &account.CreatedAt, &account.Role,
		)
		if err != nil {
			return account, err
		}
	}

	return account, nil
}

func GetAccountByMail(mail string) (schema.Account, error) {
	statement := `
		SELECT * 
		FROM account 
		WHERE mail = $1;
	`
	rows, err := db.Query(statement, mail)
	if err != nil {
		return schema.Account{}, err
	}

	var account schema.Account
	for rows.Next() {
		err = rows.Scan(
			&account.ID, &account.Mail, &account.Password, &account.Name, &account.Confirmed, &account.CreatedAt, &account.Role,
		)
		if err != nil {
			return account, err
		}
	}

	return account, nil
}

func ConfirmAccount(mail string) (schema.Account, error) {
	statement := `
		UPDATE account 
		SET confirmed = true 
		WHERE mail = $1 
		RETURNING *;
	`
	rows := db.QueryRow(statement, mail)

	var account schema.Account
	err := rows.Scan(
		&account.ID, &account.Mail, &account.Password, &account.Name, &account.Confirmed, &account.CreatedAt, &account.Role,
	)

	return account, err
}

func RenewPasswordAccount(mail string, password string) (schema.Account, error) {
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return schema.Account{}, err
	}

	statement := `
		UPDATE account 
		SET password = $1 
		WHERE mail = $2 
		RETURNING id, mail, password, name, confirmed, created_at, role;
	`
	rows := db.QueryRow(statement, hashedPassword, mail)

	var account schema.Account
	err = rows.Scan(
		&account.ID, &account.Mail, &account.Password, &account.Name, &account.Confirmed, &account.CreatedAt, &account.Role,
	)
	if err != nil {
		return account, err
	}

	return account, err
}

func HideAccountPassword(account *schema.Account) {
	account.Password = hiddenField
}
