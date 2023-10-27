package models

import (
	constrs "api-iutconnect/internal/models/constraints"
	schema "api-iutconnect/internal/models/schema"
	"errors"
	"fmt"
	"strings"
)

// import (
// 	functs "api-iutconnect"
// )

/*
Créé un tuteur (tutor) à partir des données passés en paramètre.
*/
func CreateTutor(tutor *schema.Tutor) error {
	if !constrs.ValidMailSyntax(tutor.Mail) {
		return errors.New("this mail is not valid")
	}

	statement := `SELECT create_tutor($1, $2, $3, $4, $5, $6);`
	_, err := db.Exec(statement, tutor.Mail, tutor.Password, tutor.Name, tutor.MailUBS, tutor.FirstName, tutor.IsAdmin)
	return err
}

/*
Récupére la liste de tout les tuteurs (tutor).  Leur mot de passe est masqué.
*/

func GetAllTutors() ([]schema.Tutor, error) {
	statement := `
		SELECT a.id, a.mail, a.name, a.role, a.confirmed, a.created_at, um.id, um.university_mail, p.id, y.name, d.name, m.name, t.first_name, t.is_admin
		FROM account a
		JOIN tutor t ON a.id = t.account_id
		JOIN university_mail um ON t.university_mail_id = um.id
		LEFT JOIN program p ON um.program_id = p.id
		LEFT JOIN year_group y ON p.year_group_id = y.id
		LEFT JOIN department d ON p.department_id = d.id
		LEFT JOIN major m ON p.major_id = m.id

	`
	rows, err := db.Query(statement)
	if err != nil {
		return []schema.Tutor{}, err
	}
	defer rows.Close()

	var tutors []schema.Tutor
	for rows.Next() {
		var tutor schema.Tutor
		err := rows.Scan(
			&tutor.ID, &tutor.Mail, &tutor.Name, &tutor.Role, &tutor.Confirmed, &tutor.CreatedAt, &tutor.UnivID, &tutor.MailUBS, &tutor.ProgID, &tutor.YearGroup, &tutor.Department, &tutor.Major, &tutor.FirstName, &tutor.IsAdmin,
		)
		if err != nil {
			return []schema.Tutor{}, err
		}
		HideTutorPassword(&tutor)
		tutors = append(tutors, tutor)
	}

	if err = rows.Err(); err != nil {
		return []schema.Tutor{}, err
	}

	return tutors, nil
}

/*
Récupère le tuteur (tutor) qui correspond à l'id passé en paramètre. Le mot de passe du tuteur est masqué.
*/
func GetTutor(id int32) (schema.Tutor, error) {
	if !constrs.ValidId(id) {
		return schema.Tutor{}, errors.New("id is invalid")
	}

	statement := `
		SELECT
			a.id,
			a.mail,
			a.name,
			a.role,
			a.confirmed,
			a.created_at,
			um.id,
			um.university_mail,
			p.id,
			y.name,
			d.name,
			m.name,
			t.first_name,
			t.is_admin
		FROM account a
		JOIN tutor t ON a.id = t.account_id
		JOIN university_mail um ON t.university_mail_id = um.id
		JOIN program p ON um.program_id = p.id
		LEFT JOIN year_group y ON p.year_group_id = y.id
		LEFT JOIN department d ON p.department_id = d.id
		LEFT JOIN major m ON p.major_id = m.id
		WHERE a.id = $1;
	`
	rows, err := db.Query(statement, id)
	if err != nil {
		return schema.Tutor{}, err
	}

	var tutor schema.Tutor
	for rows.Next() {
		HideTutorPassword(&tutor)
		err = rows.Scan(
			&tutor.ID,
			&tutor.Mail,
			&tutor.Name,
			&tutor.Role,
			&tutor.Confirmed,
			&tutor.CreatedAt,
			&tutor.UnivID,
			&tutor.MailUBS,
			&tutor.ProgID,
			&tutor.YearGroup,
			&tutor.Department,
			&tutor.Major,
			&tutor.FirstName,
			&tutor.IsAdmin,
		)
		if err != nil {
			return schema.Tutor{}, err
		}
	}

	return tutor, nil
}

func HideTutorPassword(tutor *schema.Tutor) {
	HideAccountPassword(&tutor.Account)
}

func DeleteTutor(id int32) error {
	if !constrs.ValidId(id) {
		return errors.New("id is invalid")

	}
	statement :=
		`DELETE FROM account WHERE id = $1;`

	_, err := db.Exec(statement, id)
	return err
}

// func UpdateTutor(id int32, tutor *schema.Tutor) error {
// 	if !constrs.ValidId(id) {
// 		return errors.New("id is invalid")
// 	}

// 	statement :=
// 		`UPDATE tutor
//         SET mail_ubs = $1, first_name = $2, is_admin = $3,
//         WHERE account_id = $4;`

// 	_, err := db.Exec(statement, tutor.MailUBS, tutor.FirstName, tutor.IsAdmin, id)
// 	return err
// }

func UpdateTutor(userID uint64, updates map[string]interface{}) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Update the account table
	accountCols := []string{
		"mail",
		"password",
		"name",
		"confirmed",
		"created_at",
		"role",
	}
	var accountSetValues []string
	var accountValues []interface{}

	index := 1
	for _, col := range accountCols {
		if value, ok := updates[col]; ok {
			accountSetValues = append(accountSetValues, col+" = $"+fmt.Sprint(index+1))
			accountValues = append(accountValues, value)
			index++
		}
	}

	if len(accountSetValues) > 0 {
		accountUpdateCols := strings.Join(accountSetValues, ", ")
		accountStatement := "UPDATE account SET " + accountUpdateCols + " WHERE id = $1"

		_, err = tx.Exec(accountStatement, append([]interface{}{userID}, accountValues...)...)
		if err != nil {
			return err
		}
	}

	// Update the tutor table
	tutorCols := []string{
		"tutor_id",
		"mail_ubs",
		"first_name",
		"is_admin",
	}
	var tutorSetValues []string
	var tutorValues []interface{}

	index = 1
	for _, col := range tutorCols {
		if value, ok := updates[col]; ok {
			tutorSetValues = append(tutorSetValues, col+" = $"+fmt.Sprint(index+1))
			tutorValues = append(tutorValues, value)
			index++
		}
	}

	if len(tutorSetValues) > 0 {
		tutorUpdateCols := strings.Join(tutorSetValues, ", ")
		tutorStatement := "UPDATE tutor SET " + tutorUpdateCols + " WHERE account_id = $1"

		_, err = tx.Exec(tutorStatement, append([]interface{}{userID}, tutorValues...)...)
		if err != nil {
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}

func GetTutorIDFromUBSMail(univMail string) (uint64, error) {
	statement := `
		SELECT account_id
		FROM tutor t
		JOIN university_mail um ON t.university_mail_id = um.id
		WHERE um.university_mail = $1;
	`
	rows, err := db.Query(statement, univMail)
	if err != nil {
		return 0, err
	}
	defer rows.Close()

	var tutorID uint64
	for rows.Next() {
		err := rows.Scan(&tutorID)
		if err != nil {
			return 0, err
		}
	}

	return tutorID, nil
}
