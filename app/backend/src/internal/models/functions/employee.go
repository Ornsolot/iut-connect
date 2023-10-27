package models

import (
	constrs "api-iutconnect/internal/models/constraints"
	schema "api-iutconnect/internal/models/schema"
	"errors"
	"fmt"
)

func CreateEmployee(employee *schema.Employee) error {
	if !constrs.ValidMailSyntax(employee.Mail) {
		return errors.New("this mail is not valid")
	}
	statement := `SELECT create_employee($1, $2, $3, $4, $5);`
	_, err := db.Exec(statement, employee.Mail, employee.Password, employee.Name, employee.FirstName, employee.ComName)
	return err
}

func GetAllEmployees() ([]schema.Employee, error) {
	statement := `
	SELECT e.account_id, e.company_id, a.mail, a.name, a.role, a.confirmed, a.created_at, e.first_name, e.com_name
	FROM employee e
	JOIN account a ON e.account_id = a.id;
`
	rows, err := db.Query(statement)
	if err != nil {
		return []schema.Employee{}, err
	}
	defer rows.Close()

	var employees []schema.Employee
	for rows.Next() {
		var employee schema.Employee
		println(fmt.Sprintf("%v", rows))
		err := rows.Scan(&employee.ID, &employee.ComID, &employee.Mail, &employee.Name, &employee.Role, &employee.Confirmed, &employee.CreatedAt, &employee.FirstName, &employee.ComName)
		if err != nil {
			return []schema.Employee{}, err
		}
		employees = append(employees, employee)
	}

	if err = rows.Err(); err != nil {
		return []schema.Employee{}, err
	}

	return employees, nil
}

func GetEmployee(id int32) (schema.Employee, error) {
	var employee schema.Employee

	statement := `
	SELECT a.id, a.mail, a.name, a.role, a.confirmed, a.created_at, e.first_name, e.com_name
	FROM account a
	JOIN employee e ON a.id = e.account_id
	WHERE a.id = $1;
`

	rows, err := db.Query(statement, id)
	if err != nil {
		return schema.Employee{}, err
	}

	for rows.Next() {
		err := rows.Scan(&employee.ID, &employee.Mail, &employee.Name, &employee.Role, &employee.Confirmed, &employee.CreatedAt, &employee.FirstName, &employee.ComName)
		if err != nil {
			return schema.Employee{}, err
		}
	}

	return employee, nil
}

func HideEmployeePassword(employee *schema.Employee) {
	HideAccountPassword(&employee.Account)
}

func DeleteEmployee(id int32) error {
	statement := `
		DELETE FROM employee
		WHERE account_id = $1;
	`
	_, err := db.Exec(statement, id)

	return err
}

func UpdateEmployeeWithCompany(id int32, com_id int32) error {
	statement := `
		UPDATE employee 
		SET company_id = $2
		WHERE account_id = $1;
	`
	_, err := db.Exec(statement, id, com_id)

	return err
}
