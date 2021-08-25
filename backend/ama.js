const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);
const createError = require('http-errors');

class AmaSession {
    constructor(ownerId) {
        this.ownerId = ownerId;
        this.questions = [];
        this.answers = [];
        this.status = 0;
    }

    updateSession(action) {
        if (action === 'stop') {
            this.status = 0;
        } else if (action === 'start') {
            this.status = 1;
        } else {
            throw createError(400, `Unknown Action: ${action}`);
        }
    }

    askQuestion(question) {
        this.questions.push(question);
        this.answers.push('');
        console.log(this.questions, this.answers);
        return this.questions.length - 1;
    }
}

// responsible for formatting the response body
module.exports = class Ama {
    sessions = {}; // each session is identified by the session Id

    getAndCheckSession(sessionId) {
        const session = this.sessions[sessionId];
        if (!session) throw createError(404, `Unknown Session: ${sessionId}`);
        return session;
    }

    createSession() {
        const sessionId = nanoid(); //assume no collision
        const ownerId = nanoid();
        this.sessions[sessionId] = new AmaSession(ownerId);
        return { session_id: sessionId, owner_id: ownerId };
    }

    updateSession(sessionId, action) {
        const session = this.getAndCheckSession(sessionId);
        session.updateSession(action);
    }

    askQuestion(sessionId, question) {
        const session = this.getAndCheckSession(sessionId);
        const questionId = session.askQuestion(question);
        return { question_id: questionId };
    }
};
