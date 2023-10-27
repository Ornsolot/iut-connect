package models

import (
	constrs "api-iutconnect/internal/models/constraints"
	schema "api-iutconnect/internal/models/schema"
	"errors"
	"fmt"
	"strconv"
	"strings"
)

/*
Créé un étudiant (student) à partir des données passés en paramètre. Il est créé en fonction des champs suivants :
  - FirstName
  - Name
  - Password
  - Mail
  - MailUBS
*/
func CreateStudent(student *schema.Student) error {
	if !constrs.ValidMailSyntax(student.Mail) {
		return errors.New("this mail is not valid")
	}

	statement := `SELECT create_student($1, $2, $3, $4, $5);`
	_, err := db.Exec(statement, student.Mail, student.Password, student.Name, student.MailUBS, student.FirstName)

	return err
}

/*
Récupère la liste de tout les étudiants (students). Leur mot de passe est masqué.
*/
func GetAllStudents() ([]schema.Student, error) {
	statement := `
		SELECT a.id, a.mail, a.name, a.role, a.confirmed, a.created_at, um.id, um.university_mail, p.id, y.name, d.name, m.name, s.tutor_id, s.first_name, s.state, s.cv, s.bio,s.master_name, s.master_first_name, s.master_function, s.master_mail, s.master_phone
		FROM account a
		JOIN student s ON a.id = s.account_id
		JOIN university_mail um ON s.university_mail_id = um.id
		JOIN program p ON um.program_id = p.id
		LEFT JOIN year_group y ON p.year_group_id = y.id
		LEFT JOIN department d ON p.department_id = d.id
		LEFT JOIN major m ON p.major_id = m.id;
	`
	rows, err := db.Query(statement)
	if err != nil {
		return []schema.Student{}, err
	}
	defer rows.Close()

	var students []schema.Student
	for rows.Next() {
		var student schema.Student
		err := rows.Scan(
			&student.ID, &student.Mail, &student.Name, &student.Role, &student.Confirmed, &student.CreatedAt, &student.UnivID, &student.MailUBS, &student.ProgID, &student.YearGroup, &student.Department, &student.Major, &student.TutorID, &student.FirstName, &student.State, &student.CV, &student.Bio, &student.MasterName, &student.MasterFirstName, &student.MasterFunction, &student.MasterMail, &student.MasterPhone,
		)
		if err != nil {
			return []schema.Student{}, err
		}
		HideStudentPassword(&student)
		students = append(students, student)
	}

	if err = rows.Err(); err != nil {
		return []schema.Student{}, err
	}

	return students, nil
}

/*
Récupère l'étudiant (student) qui correspond à l'id passé en paramètre. Le mot de passe de l'étudiant est masqué.
*/
func GetStudent(id int32) (schema.Student, error) {
	if !constrs.ValidId(id) {
		return schema.Student{}, errors.New("id is invalid")
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
			s.tutor_id,
			s.first_name,
			s.state,
			s.cv,
			s.bio,
			s.master_name,
			s.master_first_name,
			s.master_function,
			s.master_mail,
			s.master_phone
		FROM account a
		JOIN student s ON a.id = s.account_id
		JOIN university_mail um ON s.university_mail_id = um.id
		JOIN program p ON um.program_id = p.id
		LEFT JOIN year_group y ON p.year_group_id = y.id
		LEFT JOIN department d ON p.department_id = d.id
		LEFT JOIN major m ON p.major_id = m.id
		WHERE a.id = $1;
	`
	rows, err := db.Query(statement, id)
	if err != nil {
		return schema.Student{}, err
	}

	var student schema.Student
	for rows.Next() {
		err = rows.Scan(
			&student.ID,
			&student.Mail,
			&student.Name,
			&student.Role,
			&student.Confirmed,
			&student.CreatedAt,
			&student.UnivID,
			&student.MailUBS,
			&student.ProgID,
			&student.YearGroup,
			&student.Department,
			&student.Major,
			&student.TutorID,
			&student.FirstName,
			&student.State,
			&student.CV,
			&student.Bio,
			&student.MasterName,
			&student.MasterFirstName,
			&student.MasterFunction,
			&student.MasterMail,
			&student.MasterPhone,
		)
		if err != nil {
			return schema.Student{}, err
		}
	}
	HideStudentPassword(&student)

	return student, nil
}

func HideStudentPassword(student *schema.Student) {
	HideAccountPassword(&student.Account)
}

func DeleteStudent(id int32) error {
	if !constrs.ValidId(id) {
		return errors.New("id is invalid")

	}
	statement :=
		`DELETE FROM account WHERE id = $1;`

	_, err := db.Exec(statement, id)
	return err
}

func UpdateStudent(userID uint64, updates map[string]interface{}) error {
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

	// Update the student table
	studentCols := []string{
		"tutor_id",
		"first_name",
		"state",
		"bio",
		"cv",
		"master_name",
		"master_first_name",
		"master_function",
		"master_mail",
		"master_phone",
	}
	var studentSetValues []string
	var studentValues []interface{}

	index = 1
	for _, col := range studentCols {
		if value, ok := updates[col]; ok {
			studentSetValues = append(studentSetValues, col+" = $"+fmt.Sprint(index+1))
			studentValues = append(studentValues, value)
			index++
		}
	}

	if len(studentSetValues) > 0 {
		studentUpdateCols := strings.Join(studentSetValues, ", ")
		studentStatement := "UPDATE student SET " + studentUpdateCols + " WHERE account_id = $1"

		_, err = tx.Exec(studentStatement, append([]interface{}{userID}, studentValues...)...)
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

func GetStudentsByProgram(programID uint64) ([]schema.Student, error) {
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
			s.tutor_id,
			s.first_name,
			s.state,
			s.cv,
			s.bio,
			s.master_name,
			s.master_first_name,
			s.master_function,
			s.master_mail,
			s.master_phone
		FROM account a
		JOIN student s ON a.id = s.account_id
		JOIN university_mail um ON s.university_mail_id = um.id
		JOIN program p ON p.id = um.program_id
		LEFT JOIN year_group y ON p.year_group_id = y.id
		LEFT JOIN department d ON p.department_id = d.id
		LEFT JOIN major m ON p.major_id = m.id
		WHERE p.id = $1;
	`
	rows, err := db.Query(statement, programID)
	if err != nil {
		return []schema.Student{}, err
	}
	defer rows.Close()

	var students []schema.Student
	for rows.Next() {
		var student schema.Student
		err := rows.Scan(
			&student.ID,
			&student.Mail,
			&student.Name,
			&student.Role,
			&student.Confirmed,
			&student.CreatedAt,
			&student.UnivID,
			&student.MailUBS,
			&student.ProgID,
			&student.YearGroup,
			&student.Department,
			&student.Major,
			&student.TutorID,
			&student.FirstName,
			&student.State,
			&student.CV,
			&student.Bio,
			&student.MasterName,
			&student.MasterFirstName,
			&student.MasterFunction,
			&student.MasterMail,
			&student.MasterPhone,
		)
		if err != nil {
			return []schema.Student{}, err
		}
		HideStudentPassword(&student)
		students = append(students, student)
	}

	if err = rows.Err(); err != nil {
		return []schema.Student{}, err
	}

	return students, nil
}

// func GetUniversityMailFromStudent(studentID uint64) (schema.UniversityMail, error) {
// 	statement := `
// 		SELECT s.mail_ubs
// 		FROM student s
// 		LEFT JOIN account a ON s.account_id = a.id
// 		WHERE id = $1;
// 	`
// 	rows, err := db.Query(statement, studentID)
// 	if err != nil {
// 		return schema.UniversityMail{}, err
// 	}
// 	defer rows.Close()

// 	var universityMail schema.UniversityMail
// 	for rows.Next() {
// 		err := rows.Scan(&universityMail.UniversityMail)
// 		if err != nil {
// 			return schema.UniversityMail{}, err
// 		}
// 	}

// 	return universityMail, nil
// }

func GetProgramFromUniversityMail(univ_mail string) (schema.Program, error) {
	statement := `
		SELECT p.id, y.name, d.name, m.name
		FROM university_mail u
		LEFT JOIN program p ON u.program_id = p.id
		LEFT JOIN year_group y ON p.year_group_id = y.id
		LEFT JOIN department d ON p.department_id = d.id
		LEFT JOIN major m ON p.major_id = m.id
		WHERE u.university_mail = $1;
	`
	rows, err := db.Query(statement, univ_mail)
	if err != nil {
		return schema.Program{}, err
	}
	defer rows.Close()

	var program schema.Program
	for rows.Next() {
		err := rows.Scan(
			&program.ProgID,
			&program.YearGroup,
			&program.Department,
			&program.Major,
		)
		if err != nil {
			return schema.Program{}, err
		}
	}

	return program, nil
}

func GetStudentIDFromUBSMail(univ_mail string) (uint64, error) {
	statement := `
		SELECT account_id
		FROM student
		JOIN university_mail um ON student.university_mail_id = um.id
		WHERE um.university_mail = $1;
	`
	rows, err := db.Query(statement, univ_mail)
	if err != nil {
		return 0, err
	}
	defer rows.Close()

	var studentID uint64
	for rows.Next() {
		err := rows.Scan(&studentID)
		if err != nil {
			return 0, err
		}
	}

	return studentID, nil
}

func GetStudentsByTutor(tutorID uint64) ([]schema.Student, error) {
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
			s.tutor_id,
			s.first_name,
			s.state,
			s.cv,
			s.bio,
			s.master_name,
			s.master_first_name,
			s.master_function,
			s.master_mail,
			s.master_phone
		FROM account a
		JOIN student s ON a.id = s.account_id
		JOIN university_mail um ON s.university_mail_id = um.id
		LEFT JOIN program p ON p.id = um.program_id
		LEFT JOIN year_group y ON p.year_group_id = y.id
		LEFT JOIN department d ON p.department_id = d.id
		LEFT JOIN major m ON p.major_id = m.id
		WHERE s.tutor_id = $1;
	`
	rows, err := db.Query(statement, tutorID)
	if err != nil {
		return []schema.Student{}, err
	}
	defer rows.Close()

	var students []schema.Student
	for rows.Next() {
		var student schema.Student
		err := rows.Scan(
			&student.ID,
			&student.Mail,
			&student.Name,
			&student.Role,
			&student.Confirmed,
			&student.CreatedAt,
			&student.UnivID,
			&student.MailUBS,
			&student.ProgID,
			&student.YearGroup,
			&student.Department,
			&student.Major,
			&student.TutorID,
			&student.FirstName,
			&student.State,
			&student.CV,
			&student.Bio,
			&student.MasterName,
			&student.MasterFirstName,
			&student.MasterFunction,
			&student.MasterMail,
			&student.MasterPhone,
		)
		if err != nil {
			return []schema.Student{}, err
		}
		HideStudentPassword(&student)
		students = append(students, student)
	}

	if err = rows.Err(); err != nil {
		return []schema.Student{}, err
	}

	return students, nil
}

func IsValidUniversityEmail(email string) (bool, error) {
	statement := `
		SELECT u.university_mail
		FROM university_mail u
		WHERE u.university_mail = $1;
	`
	rows, err := db.Query(statement, email)
	if err != nil {
		return false, err
	}
	defer rows.Close()

	var universityMail schema.UniversityMail
	for rows.Next() {
		err := rows.Scan(&universityMail.MailUBS)
		if err != nil {
			return false, err
		}
		if universityMail.MailUBS == email {
			return true, nil
		}
	}

	return false, nil
}

func UpdateStudents(updates map[string]interface{}, ids ...interface{}) error {
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

	index := 0
	for _, col := range accountCols {
		if value, ok := updates[col]; ok {
			accountSetValues = append(accountSetValues, col+" = $"+fmt.Sprint(index+1))
			accountValues = append(accountValues, value)
			index++
		}
	}

	if len(accountSetValues) > 0 {
		accountUpdateCols := strings.Join(accountSetValues, ", ")
		accountStatement := "UPDATE account SET " + accountUpdateCols + " WHERE "

		for i, _ := range ids {
			if i != 0 {
				accountStatement += " OR "
			}
			accountStatement += "id = $" + strconv.Itoa(index+(i+1))
		}

		accountStatement += "; "

		var accountParams []interface{}
		accountParams = append(accountParams, accountValues...)
		accountParams = append(accountParams, ids...)
		_, err = tx.Exec(accountStatement, accountParams...)
		if err != nil {
			return err
		}
	}

	// Update the student table
	studentCols := []string{
		"tutor_id",
		"first_name",
		"state",
		"bio",
		"cv",
		"master_name",
		"master_first_name",
		"master_function",
		"master_mail",
		"master_phone",
	}
	var studentSetValues []string
	var studentValues []interface{}

	index = 0
	for _, col := range studentCols {
		if value, ok := updates[col]; ok {
			studentSetValues = append(studentSetValues, col+" = $"+fmt.Sprint(index+1))
			studentValues = append(studentValues, value)
			index++
		}
	}

	if len(studentSetValues) > 0 {
		studentUpdateCols := strings.Join(studentSetValues, ", ")
		studentStatement := "UPDATE student SET " + studentUpdateCols + " WHERE "

		for i, _ := range ids {
			if i != 0 {
				studentStatement += " OR "
			}
			studentStatement += "account_id = $" + strconv.Itoa(index+(i+1))
		}

		studentStatement += "; "

		var studentParams []interface{}
		studentParams = append(studentParams, studentValues...)
		studentParams = append(studentParams, ids...)
		_, err = tx.Exec(studentStatement, studentParams...)
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
