package services

import (
	functs "api-iutconnect/internal/models/functions"
	schema "api-iutconnect/internal/models/schema"
	"api-iutconnect/utils"
)

func Create(employee *schema.Employee) error {
	HashPassword(employee)
	err := functs.CreateEmployee(employee)
	return err
}

func GetAll() ([]schema.Employee, error) {
	var employees []schema.Employee
	employees, err := functs.GetAllEmployees()
	return employees, err
}

func Get(id int32) (schema.Employee, error) {
	var employee = schema.Employee{}
	employee, err := functs.GetEmployee(id)
	return employee, err
}

func Delete(id int32) error {
	err := functs.DeleteEmployee(id)
	return err
}

func UpdateWithCompany(id int32, com_id int32) error {
	err := functs.UpdateEmployeeWithCompany(id, com_id)
	return err
}

func HidePassword(employee *schema.Employee) {
	functs.HideEmployeePassword(employee)
}

func HashPassword(employee *schema.Employee) error {
	employeePassword := employee.Account.Password

	hashedPassword, err := utils.HashPassword(employeePassword)
	if err != nil {
		return err
	}

	employee.Account.Password = hashedPassword
	return nil
}
