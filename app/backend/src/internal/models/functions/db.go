package models

import (
	"database/sql"
	"fmt"

	ini "api-iutconnect/config"
	"api-iutconnect/utils/system"

	_ "github.com/lib/pq"
)

var db *sql.DB

func InitDB() {
	var err error
	
	db, err = sql.Open("postgres", fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", ini.Env.Network.Wan, ini.Env.DBMS.Port, ini.Env.Database.User, ini.Env.Database.Pswd, ini.Env.Database.Name))
	if err != nil {
		panic(err)
	}
	err = db.Ping()
	if err != nil {
		fmt.Println(err)
	} else {
		clr := system.DefaultColors
		const lineLen = 49
		fmt.Printf(
			"\n"+clr.Black+
				" ┌───────────────────────────────────────────────────┐\n"+
				" │ "+system.CenterValue("Postgres Connected", lineLen, clr.Green)+" │\n"+
				" │ "+system.Center(fmt.Sprintf("http://%s:%d", ini.Env.Network.Wan, ini.Env.DBMS.Port), lineLen)+" │\n"+
				" │                                                   │\n"+
				" │ User %s  DBName %s │\n"+
				" └───────────────────────────────────────────────────┘"+
				clr.Reset+"\n",
			system.Value(ini.Env.Database.User, 18, clr.Green), system.Value(ini.Env.Database.Name, 15, clr.Green),
		)
	}
}
