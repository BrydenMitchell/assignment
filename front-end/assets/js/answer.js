class Answer {
    constructor(id, text, isCorrect) {
        if (!id) {
            this.id = Answer.getID()
        } else {
            this.id = id
        }

        if (!text) {
            this.text = ""
        } else {
            this.text = text
        }

        if (!isCorrect) {
            this.isCorrect = false
        } else {
            this.isCorrect = isCorrect
        }
    }

    static newAnswerID = 0

    static getID() {
        let newID = Answer.newAnswerID
        Answer.newAnswerID += 1
        return "new" + newID
    }
}