package main

import (
	"api-iutconnect/config"
	"api-iutconnect/endpoints"
	functions "api-iutconnect/internal/models/functions"
)

func main() {
	/*
	 * Log file won't work with docker.
	 */ 
	//logs.LogIsnstance("../../env/")
	config.Load("../../env/iut-connect.toml")
	functions.InitDB()
	endpoints.InitRoutes()
}