let testJSON = [
    {
        "id": 123,
        "text": "Here is a question",
        "answers": [
            {
                "id": 123,
                "text": "Here is an answer",
                "isCorrect": true
            }, {
                "id": 456,
                "text": "Here is an answer",
                "isCorrect": false
            }, {
                "id": 789,
                "text": "Here is an answer",
                "isCorrect": false
            }
        ]
    }, {
        "id": 456,
        "text": "Here is a question",
        "answers": [
            {
                "id": 111,
                "text": "Here is an answer",
                "isCorrect": true
            }, {
                "id": 222,
                "text": "Here is an answer",
                "isCorrect": false
            }, {
                "id": 333,
                "text": "Here is an answer",
                "isCorrect": false
            }
        ]

    }

]

let allQuestions = []

function createQuestions(questionJSON) {
    let questions = []
    for (let questionIterator in questionJSON) {
        let question = questionJSON[questionIterator]
        let answers = []
        for (let answerIterator in question.answers) {
            let answer = question.answers[answerIterator]
            answers.push(new Answer(answer["id"], answer["text"], answer["isCorrect"]))
        }
        question = new Question(question["id"], question["text"], answers)
        questions.push(question)
        allQuestions.push(question)
    }
    return questions
}

function createQuestionHTML(question) {
    let questionHTML = document.createElement("div")
    questionHTML.id = question.id
    let qText = document.createElement("input")
    qText.type = "textarea"
    qText.value = question.text
    qText.id = "q" + question.id
    questionHTML.appendChild(qText)
    for (let answerIterator in question.answers) {
        let answer = question.answers[answerIterator]
        let aButton = document.createElement("input")
        aButton.type = "radio"
        aButton.name = question.id
        aButton.id = "q" + question.id + "button" + answer.id
        if (answer.isCorrect) {
            aButton.checked = true
        }
        let aText = document.createElement("input")
        aText.type = "text"
        aText.id = "q" + question.id + "text" + answer.id
        aText.value = answer.text

        questionHTML.appendChild(aButton)
        questionHTML.appendChild(aText)

    }
    return questionHTML
}

function addQuestionsHTML(questions) {
    let questionsHTML = document.getElementById("questions")
    for (let questionIterator in questions) {
        questionsHTML.appendChild(createQuestionHTML(questions[questionIterator]))
    }
}

function addQuestion() {
    let newQuestion = new Question()
    let numberOfAnswers = parseInt(prompt("How many answers? (2-4)"))
    if (numberOfAnswers < 2) {
        numberOfAnswers = 2
    } else if (numberOfAnswers > 4) {
        numberOfAnswers = 4
    }
    let answers = []
    for (let i = 0; i < numberOfAnswers; i++) {
        newQuestion.answers.push(new Answer())
    }
    allQuestions.push(newQuestion)
    addQuestionsHTML([newQuestion])
}

function findQuestion(id) {
    let intID = parseInt(id)
    return allQuestions.filter(obj => {
        return obj.id === intID
    })
}

function getQuestionGET() {
    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let result = JSON.parse(this.responseText)
            console.log(result);
            addQuestionsHTML(createQuestions(result))
        }
    }
    xhttp.open("GET", "/questions.http", true)
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}

function updateQuestionPUT(question) {
    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            // response
        }
    }
    xhttp.open("PUT", "/questions", true)
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(JSON.stringify(question));
}

function createQuestionPOST(question) {
    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            // response
        }
    }
    xhttp.open("POST", "/questions.http", true)
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    console.log(JSON.stringify(question))
    xhttp.send(JSON.stringify(question));
}

function saveQuestions() {
    let toSaveQuestions = document.getElementById("questions")

    let children  = toSaveQuestions.children
    for (let i = 0; i < children.length; i++) {
        let child = toSaveQuestions.children[i]
        console.log(child);
        let question = findQuestion(child.id)
        if (question.length === 1) {
            // updateQuestionPUT(child)
        } else if (question.length === 0) {
            createQuestionPOST(child)
        } else {
            throw "data integrity issue"
        }
    }
}

getQuestionGET()