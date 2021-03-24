let url = require('url');
let fs = require('fs');
let https = require('https');
let http = require('http')
let options = {
    key: fs.readFileSync(".ssl/key.pem"),
    cert: fs.readFileSync(".ssl/cert.pem")
}
let path = require('path')
let mysql = require('mysql')
let {parse} = require('querystring')

let request;
let response;
let questions;

let connection;

let batchTotalNumber
let batchCount;
let batchCallback;

// Database
let dbConnect = () => {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "quiz",
        port: 8889
    });
}

let getQuestionsComplete = () => {
    response.end(JSON.stringify(questions))
}

let findQuestion = (id) => {
    let intID = parseInt(id)
    return questions.filter(obj => {
        return obj.ID === intID
    })
}

let batchCompletion = (number, callback) => {
    if (number) {
        batchTotalNumber = number
        batchCallback = callback
        batchCount = 0
    } else {
        batchCount++
        if (batchCount >= batchTotalNumber) {
            batchCallback()
        }
    }
}

let getQuestions = () => {
    connection = dbConnect()
    connection.connect(function (err) {
        if (err) throw err;
        connection.query("SELECT * FROM question", function (err, result, fields) {
            if (err) throw err;
            questions = JSON.parse(JSON.stringify(result))
            batchCompletion(questions.length, getQuestionsComplete)
            for (let i = 0; i < questions.length; i++) {
                let id = questions[i]['ID']
                connection.query("SELECT * FROM answer WHERE questionID = " + id, function (err, result, fields) {
                    if (err) throw err
                    let answers = JSON.parse(JSON.stringify(result))
                    let question = findQuestion(answers[0].questionID)
                    question[0].answers = answers
                    batchCompletion()
                })
            }
        });
    });}

let addQuestion = (req, res) => {
    let body = "";

    request.on("data", function (chunk) {
        body += chunk;
    });

    request.on('end', () => {
        let data = JSON.parse(body);
        for (let i = 0; i < data.length; i++) {
            let question = data[i]
            console.log(question);
            connection.query("INSERT INTO question VALUES (NULL, '" + question["text"] + "')")
        }
    });

    res.end("updated")
}

let updateQuestion = () => {

}

// Request utils
let getURLMIMEType = (currentURL) => {
    switch (path.extname(currentURL)) {
        case ".html":
            return "text/html"
        case ".css":
            return "text/css"
        case ".js":
            return "text/javascript"
        case ".png":
            return "image/png"
        case ".jpeg":
        case ".jpg":
            return "image/jpeg"
        default:
            return "text/plain"
    }
}

let checkEmptyURL = (req) => {
    if (req.url === "/") {
        req.url = "/index.html"
        return req
    }
    if (path.extname(req.url) === "") {
        req.url = req.url + "/index.html"
    }
    return req
}

// Request handling
let handleRequest = (req, res) => {
    req = checkEmptyURL(req)
    /**
     * Special Request filtering. Add cases to bypass standard file response.
     */
    switch (req.url.toString().toLowerCase()) {
        case "/questions.http":
            handleQuestions(req, res)
            break
        default:
            standardFileRequest(req, res)
    }
};

let standardFileRequest = (req, res) => {
    let mimeType = getURLMIMEType(req.url)

    res.writeHead(200, {
        "Content-Type": mimeType,
        "Access-Control-Allow-Origin": "*"
    });

    console.log(req.url + "->" + mimeType);
    fs.readFile("." + req.url, null, function (error, data) {
        if (error) {
            res.writeHead(404);
            res.write('Whoops! File not found!');
        } else {
            res.write(data);
        }
        res.end();
    });
}

let handleQuestions = (req, res) => {
    request = req
    response = res
    if (req.method === "GET") {
        getQuestions()
    } else if (req.method === "POST") {
        addQuestion(req, res)
    } else if (req.method === "PUT") {
        updateQuestion(req, res)
    }
}

// Server
https.createServer(options, handleRequest).listen(443);

http.createServer(function (req, res) {
    res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
    res.end();
}).listen(80);

console.log("Server is running")