package models

import (
	schema "api-iutconnect/internal/models/schema"
)

func CreateCompany(company *schema.Company) error {
	statement := `SELECT create_company($1, $2, $3, $4, $5, $6);`
	_, err := db.Exec(statement, company.ComName, company.City, company.PostalCode, company.WebsiteURL, company.Contact, company.Country)
	return err
}

func GetCompanyByID(id int32) (schema.Company, error) {
	statement := `
		SELECT * 
		FROM company 
		WHERE com_id = $1;
	`
	rows, err := db.Query(statement, id)
	if err != nil {
		return schema.Company{}, err
	}

	var company schema.Company
	for rows.Next() {
		err = rows.Scan(
			&company.ComID, &company.City, &company.ComName, &company.PostalCode, &company.WebsiteURL, &company.Contact, &company.Country,
		)
		if err != nil {
			return company, err
		}
	}

	return company, nil
}

func DeleteCompany(name string) error {
	statement := `
		DELETE FROM Company
		WHERE com_name = $1;
	`
	_, err := db.Exec(statement, name)

	return err
}

func GetCompany(name string) (schema.Company, error) {
	var company schema.Company

	statement := `
		SELECT com_name, city, postal_code, website_url, contact, country
		FROM Company
		WHERE com_name = $1;
	`

	rows, err := db.Query(statement, name)
	if err != nil {
		return schema.Company{}, err
	}

	for rows.Next() {
		err := rows.Scan(&company.ComName, &company.City, &company.PostalCode, &company.WebsiteURL, &company.Contact, &company.Country)
		if err != nil {
			return schema.Company{}, err
		}
	}

	return company, nil
}

func GetAllCompanies() ([]schema.Company, error) {
	statement := `
	SELECT * FROM Company
	`
	rows, err := db.Query(statement)
	if err != nil {
		return []schema.Company{}, err
	}
	defer rows.Close()

	var companies []schema.Company
	for rows.Next() {
		var company schema.Company
		err := rows.Scan(&company.ComID, &company.ComName, &company.City, &company.PostalCode, &company.WebsiteURL, &company.Contact, &company.Country)
		if err != nil {
			return []schema.Company{}, err
		}
		companies = append(companies, company)
	}

	if err = rows.Err(); err != nil {
		return []schema.Company{}, err
	}

	return companies, nil
}
