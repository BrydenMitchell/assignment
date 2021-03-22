export class Database {
    constructor() {
        this.connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "31TTpUot!U%GMfv",
            database: "lab5",
        })
    }

    getQuestions() {
        this.connection.connect(function(err) {
            if (err) throw err;
            this.connection.query("SELECT * FROM question", function (err, result, fields) {
                if (err) throw err;
                console.log(result);
                let jsonData = JSON.stringify(result)
                response.end(jsonData)
            });
        });
    }
}