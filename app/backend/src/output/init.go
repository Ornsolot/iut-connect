package output

import "api-iutconnect/utils/system"

var clr = system.DefaultColors

var deepLog bool = false
var deepPrint bool = false

func SetDeepLog(deep bool) {
	deepLog = deep
}

func SetDeepPrint(deep bool) {
	deepPrint = deep
}
