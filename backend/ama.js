require('dotenv').config();

const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);
const createError = require('http-errors');

const pg = require('pg');
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

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
        if (this.status === 0) throw createError(403, `Session not started`);
        this.questions.push(question);
        this.answers.push('');
        return this.questions.length - 1;
    }

    getQuestions() {
        return this.questions;
    }
    getAnswers() {
        return this.answers;
    }
    getStatus() {
        return this.status ? 'started' : 'stopped';
    }
    getQuestion(questionId) {
        if (questionId >= this.questions.length) throw createError(404, 'No such question');
        return [this.questions[questionId], this.answers[questionId]];
    }

    answerQuestion(ownerId, questionId, answer) {
        if (ownerId !== this.ownerId) throw createError(401, `OwnerId ${ownerId} does not match`);
        if (this.answers[questionId].length > 0) throw createError(400, `Question already answered`);
        this.answers[questionId] = answer;
        console.log(this.questions, this.answers);
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
        const query = `INSERT INTO sessions_tab (session_id, owner_id) VALUES ($1, $2)`;
        return pool.query(query, [sessionId, ownerId]).then(function () {
            return { session_id: sessionId, owner_id: ownerId };
        });
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

    getSession(sessionId) {
        const session = this.getAndCheckSession(sessionId);
        const questions = session.getQuestions();
        const answers = session.getAnswers();
        const status = session.getStatus();
        return { questions, answers, status };
    }

    getQuestion(sessionId, questionId) {
        const session = this.getAndCheckSession(sessionId);
        const [question, answer] = session.getQuestion(questionId);
        return { question, answer };
    }

    answerQuestion(sessionId, ownerId, questionId, answer) {
        const session = this.getAndCheckSession(sessionId);
        return session.answerQuestion(ownerId, questionId, answer);
    }

    setupTable() {
        const query = `
            DROP TABLE IF EXISTS sessions_tab;
            CREATE TABLE sessions_tab (
                id SERIAL primary key,
                session_id VARCHAR(10) unique not null,
                owner_id VARCHAR(10) unique not null,
                status INT not null default 0
            );

            DROP TABLE IF EXISTS questions_tab;
            CREATE TABLE questions_tab (
                id SERIAL primary key,
                session_id VARCHAR(10) unique not null,
                question TEXT not null,
                answer TEXT not null
            );
        `;
        return pool.query(query);
    }
};
