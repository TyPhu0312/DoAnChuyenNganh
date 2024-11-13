var mysql = require('mysql');
const colors = require('colors') //màu cho consolelog phias duoi
var connection = mysql.createConnection({
	host:'127.0.0.1',
	user:'root',
	password:'',
	database:'qlbantranh'
});
connection.connect(function(error){
	if(error) {
		console.log(error);
	} else {
		console.log('MySQL Database connected!'.bgGreen.white);
	}
});

module.exports = connection;