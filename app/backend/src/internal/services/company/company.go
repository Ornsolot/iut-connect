package services

import (
	functs "api-iutconnect/internal/models/functions"
	schema "api-iutconnect/internal/models/schema"
)

func Create(company *schema.Company) error {
	err := functs.CreateCompany(company)
	return err
}
func GetByID(id int32) (schema.Company, error) {
	var account schema.Company
	account, err := functs.GetCompanyByID(id)
	return account, err
}

func Get(name string) (schema.Company, error) {
	company, err := functs.GetCompany(name)
	return company, err
}

func GetAll() ([]schema.Company, error) {
	var companies []schema.Company
	companies, err := functs.GetAllCompanies()
	return companies, err
}

func Delete(name string) error {
	err := functs.DeleteCompany(name)
	return err
}
