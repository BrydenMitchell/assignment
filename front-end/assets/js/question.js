class Question {
    constructor(id, text, answers) {
        if (!id) {
            this.id = Question.getID()
        } else {
            this.id = id
        }

        if (!text) {
            this.text = ""
        } else {
            this.text = text
        }

        if (!answers) {
            this.answers = []
        } else {
            this.answers = answers
        }
    }

    static newQuestionID = 0

    static getID() {
        let newID = Question.newQuestionID
        Question.newQuestionID += 1
        return "new" + newID
    }
}