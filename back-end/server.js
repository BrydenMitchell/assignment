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

let getQuestions = () => {

}

let addQuestion = () => {

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
    if (req.method === "GET") {
        getQuestions()
    } else if (req.method === "POST") {
        addQuestion()
    } else if (req.method === "PUT") {
        updateQuestion()
    }
}

// Server
https.createServer(options, handleRequest).listen(443);

http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);

console.log("Server is running")