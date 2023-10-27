package utils

import (
	ini "api-iutconnect/config"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

func GenerateConfirmToken(email string) (string, error) {
	claims := jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(time.Minute * 15).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(ini.Env.Database.Key))
}

func GenerateRenewPasswordToken(email string) (string, error) {
	claims := jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(time.Minute * 15).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(ini.Env.Database.Key))
}

func ParseToken(token string) (bool, jwt.MapClaims, error) {
	parsedToken, err := jwt.Parse(token, func(parsedToken *jwt.Token) (interface{}, error) {
		return []byte(ini.Env.Database.Key), nil
	})

	if err != nil || !parsedToken.Valid {
		return false, nil, err
	}

	claims, ok := parsedToken.Claims.(jwt.MapClaims)
	if !ok {
		return true, nil, err
	}

	return true, claims, nil
}
