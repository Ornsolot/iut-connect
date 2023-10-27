package models

import (
	schema "api-iutconnect/internal/models/schema"
)

// func CreateProgram(program *schema.Program) error {
// 	statement := `
// 		INSERT INTO program(year_group, department, major)
// 		VALUES ($1, $2, $3)
// 		RETURNING id, year_group, department, major
// 		;
// 	`
// 	rows := db.QueryRow(statement, program.YearGroup, program.Department, program.Major)

// 	err := rows.Scan(&program.ID, &program.YearGroup, &program.Department, &program.Major)

// 	return err
// }

// func DeleteProgram(id uint64) error {
// 	statement := `
// 		DELETE FROM program
// 		WHERE id = $1;
// 	`
// 	_, err := db.Exec(statement, id)

// 	return err
// }

// func UpdateProgram(id uint64) error {
// 	statement := `
// 		UPDATE program
// 		SET is_blocked = true
// 		WHERE id = $1;
// 	`
// 	_, err := db.Exec(statement, id)

// 	return err
// }

func GetProgram(id uint64) (schema.Program, error) {
	var program schema.Program

	statement := `
		SELECT 
			p.id AS id, 
			y.name AS year_group, 
			d.name AS department, 
			m.name AS major
		FROM program p
		LEFT JOIN year_group y ON y.id = p.year_group_id
		LEFT JOIN department d ON d.id = p.department_id
		LEFT JOIN major m ON m.id = p.major_id
		WHERE id = $1;
	`

	rows, err := db.Query(statement, id)
	if err != nil {
		return schema.Program{}, err
	}

	for rows.Next() {
		err := rows.Scan(&program.ProgID, &program.YearGroup, &program.Department, &program.Major)
		if err != nil {
			return schema.Program{}, err
		}
	}

	return program, nil
}

func GetAllPrograms() ([]schema.Program, error) {
	statement := `
		SELECT p.id AS id, y.name AS year_group, d.name AS department, m.name AS major
		FROM program p
		LEFT JOIN year_group y ON y.id = p.year_group_id
		LEFT JOIN department d ON d.id = p.department_id
		LEFT JOIN major m ON m.id = p.major_id;
	`

	rows, err := db.Query(statement)
	if err != nil {
		return []schema.Program{}, err
	}
	defer rows.Close()

	var programs []schema.Program
	for rows.Next() {
		var program schema.Program
		err := rows.Scan(&program.ProgID, &program.YearGroup, &program.Department, &program.Major)
		if err != nil {
			return []schema.Program{}, err
		}
		programs = append(programs, program)
	}

	if err = rows.Err(); err != nil {
		return []schema.Program{}, err
	}

	return programs, nil
}
