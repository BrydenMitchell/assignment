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

let handleRequest = (req, res) => {
    req = checkEmptyURL(req)

    /**
     * Special Request filtering. Add cases to bypass standard file response.
     */
    switch (req.url.toString().toLowerCase()) {
        case "/comp4537/labs/5/writedb.html":
            lab5WriteHandler(req, res)
            break
        case "/comp4537/labs/5/readdb.html":
            lab5ReadHandler(req, res)
            break
        default:
            standardFileRequest(req, res)
    }
};

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

let lab5WriteHandler = (req, res) => {
    if (req.method === "GET") {
        standardFileRequest(req, res)
    } else if (req.method === "POST") {
        let body = "";

        req.on("data", function (chunk) {
            body += chunk;
        });

        req.on('end', () => {
            let data = parse(body);
            if (lab5Write(data.name, data.score)) {
                res.end("Score Added");
            } else {
                res.end("An Error Occurred");
            }
        });
    }
}

let lab5Write = (name, score) => {
    let connection = lab5DBConnect()

    connection.connect(function(err) {
        if (err) return false;
        console.log("Connected!");
        let sql = "INSERT INTO score (name, score) VALUES ('" + name + "', '" + score + "')";
        connection.query(sql, function (err, result) {
            if (err) return false;
            console.log("1 record inserted");
        });
    });
    return true
}

let lab5ReadHandler = (req, res) => {

    request = req
    response = res

    console.log("read handler");
    if (req.method === "GET") {
        standardFileRequest(req, res)
    } else if (req.method === "POST") {

        let body = "";

        req.on("data", function (chunk) {
            body += chunk;
        });

        req.on('end', () => {
            lab5Read();
        });
    }
}

let lab5Read = () => {
    let connection = lab5DBConnect()

    connection.connect(function(err) {
        if (err) throw err;
        connection.query("SELECT * FROM score", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            let jsonData = JSON.stringify(result)
            response.end(jsonData)
        });
    });
}

let lab5DBConnect = () => {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "31TTpUot!U%GMfv",
        database: "lab5",
    });

}

// Server
https.createServer(options, handleRequest).listen(443);

http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);

console.log("Server is running")