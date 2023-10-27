package config

import (
	"api-iutconnect/utils/system"
	"fmt"
	"log"
	"reflect"
	"strconv"

	"github.com/BurntSushi/toml"
)

type tomlEnv struct {
	
	Network struct {
		Wan string `toml:"Wan"`
		Lan string `toml:"Lan"`
	} `toml:"network"`

	Mailer struct {
		Server string `toml:"Server"`
		Mail string   `toml:"Mail"`
		Pswd string   `toml:"Pswd"`
		Port int      `toml:"Port"`
	} `toml:"mailer"`

	Database struct {
		User string `toml:"User"`
		Pswd string `toml:"Pswd"`
		Name string `toml:"Name"`
		Key  string `toml:"Key"`
	} `toml:"database"`

	DBMS struct {
		Port int    `toml:"Port"`
	} `toml:"dbms"`

	Backend struct {
		Port int `toml:"Port"`
	} `toml:"backend"`

	Frontend struct {
		Port int `toml:"Port"`
	} `toml:"frontend"`
}

var Env tomlEnv

func getToml(path string) tomlEnv {
	if _, err := toml.DecodeFile(path, &Env); err != nil {
		log.Fatalf("Une erreur est survenue lors de l'analyse du fichier: %v", err)
	}
	return (Env)
}

func Load(path string) {
	const lineLen = 49
	
	Env = getToml(path)
	message := "\n" + system.DefaultColors.Black +
		" ┌───────────────────────────────────────────────────┐\n" +
		" │ " + system.CenterValue("Configuration loaded", lineLen, system.DefaultColors.Yellow) + " │\n" +
		" │ " + system.Center(fmt.Sprintf("From %s", path), lineLen) + " │\n" +
		" │                                                   │\n"
	for _, conf := range showConfig(reflect.ValueOf(Env), lineLen-3) {
		message += " │ " + conf + " │\n"
	}
	message += " └───────────────────────────────────────────────────┘" + system.DefaultColors.Reset

	fmt.Println(message)
}

func showConfig(val reflect.Value, width int) []string {
	t := val.Type()
	prefixI := system.DefaultColors.Yellow + "│ " + system.DefaultColors.Black
	prefixT := system.DefaultColors.Yellow + "├ " + system.DefaultColors.Black
	prefixL := system.DefaultColors.Yellow + "└ " + system.DefaultColors.Black

	var result []string

	for i := 0; i < val.NumField(); i++ {
		field := val.Field(i)
		fieldType := t.Field(i)

		if fieldType.Type.Kind() == reflect.Struct {
			if i >= val.NumField()-1 {
				result = append(result, prefixL+fieldType.Name+fmt.Sprintf("%"+strconv.Itoa(width-len(fieldType.Name)+1)+"s", " "))
				childs := showConfig(field, width-2)
				for _, child := range childs {
					result = append(result, "  "+child)
				}
			} else {
				result = append(result, prefixT+fieldType.Name+fmt.Sprintf("%"+strconv.Itoa(width-len(fieldType.Name)+1)+"s", " "))
				childs := showConfig(field, width-2)
				for _, child := range childs {
					result = append(result, prefixI+child)
				}
			}
		} else {
			if i >= val.NumField()-1 {
				result = append(result, prefixL+fieldType.Name+" "+system.Value(fmt.Sprintf("%v", field.Interface()), width-len(fieldType.Name)-1, system.DefaultColors.Yellow))
			} else {
				result = append(result, prefixT+fieldType.Name+" "+system.Value(fmt.Sprintf("%v", field.Interface()), width-len(fieldType.Name)-1, system.DefaultColors.Yellow))
			}
		}
	}

	return result
}
