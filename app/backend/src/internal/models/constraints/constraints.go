package models

import (
	schema "api-iutconnect/internal/models/schema"
	"api-iutconnect/utils"
)

const (
	stringMinLength = 1
	stringMaxLength = 100
	int32Max        = 2147483647

	passwordMinLength = 8
	passwordMaxLength = 50

	nameMinLength = stringMinLength
	nameMaxLength = stringMaxLength

	idMin = 1
	idMax = int32Max
)

// ValidId checks if the given ID is valid.
//
// It takes an integer ID as a parameter.
// It returns a boolean indicating whether the ID is valid or not.
func ValidId(id int32) bool {
	idIsValid := idMin <= id && id <= idMax
	return idIsValid
}

// ValidPassword checks if the given password is valid.
//
// The function takes a string parameter called password.
// It returns a boolean value indicating whether the password is valid.
func ValidPassword(password string) bool {
	passwordLength := len(password)
	passwordIsValid := passwordMinLength <= passwordLength && passwordLength <= passwordMaxLength
	return passwordIsValid
}

// ValidName checks if the given name is valid.
//
// Parameters:
// - name: a string representing the name to be validated.
//
// Returns:
// - a boolean indicating if the name is valid or not.
func ValidName(name string) bool {
	nameLength := len(name)
	nameIsValid := nameMinLength <= nameLength && nameLength <= nameMaxLength
	return nameIsValid
}

// ValidRole checks if the given account role is valid.
//
// Parameters:
// - accountRole: a string representing the account role to be checked.
//
// Returns:
// - a boolean value indicating whether the account role is valid or not.
func ValidRole(accountRole string) bool {
	// Vérifier si le role est dans la liste des roles
	for _, role := range schema.Roles {
		if accountRole == role {
			return true
		}
	}
	return false
}

// func MailIsUnique(mail string) bool {
// 	mailIsUnique := true
// 	_, err := functions.GetAccountByMail(mail)
// 	if err != nil {
// 		mailIsUnique = false
// 	}
// 	return mailIsUnique
// }

// ValidMailSyntax checks if the given mail address has a valid syntax.
//
// mail: the mail address to be checked
// bool: returns true if the mail address has a valid syntax, otherwise false
func ValidMailSyntax(mail string) bool {
	return utils.ValidMailSyntax(mail)
}
