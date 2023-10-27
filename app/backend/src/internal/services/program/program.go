package program

import (
	functs "api-iutconnect/internal/models/functions"
	schema "api-iutconnect/internal/models/schema"
)

// func Create(program *schema.Program) error {
// 	err := functs.CreateProgram(program)
// 	return err
// }

func Get(id uint64) (schema.Program, error) {
	program, err := functs.GetProgram(id)
	return program, err
}

func GetAll() ([]schema.Program, error) {
	var programs []schema.Program
	programs, err := functs.GetAllPrograms()
	return programs, err
}

// func Delete(id uint64) error {
// 	err := functs.DeleteProgram(id)
// 	return err
// }
