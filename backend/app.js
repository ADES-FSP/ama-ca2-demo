const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const Ama = require('./ama');
const ama = new Ama();

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.post('/sessions', function (req, res, next) {
    // create a session
    const ids = ama.createSession();
    return res.status(201).json(ids);
});

app.put('/sessions/:sessionId', function (req, res, next) {
    // create a session
    const sessionId = req.params.sessionId;
    const action = req.query.action;
    ama.updateSession(sessionId, action);
    return res.send();
});

app.post('/sessions/:sessionId/questions', function (req, res, next) {
    // create a session
    const sessionId = req.params.sessionId;
    const question = req.body.question;
    const questionId = ama.askQuestion(sessionId, question);
    return res.status(201).json(questionId);
});

app.get('/sessions/:sessionId', function (req, res, next) {
    // create a session
    const sessionId = req.params.sessionId;
    const session = ama.getSession(sessionId);
    return res.json(session);
});

app.get('/sessions/:sessionId/questions/:questionId', function (req, res, next) {
    // create a session
    const sessionId = req.params.sessionId;
    const questionId = req.params.questionId;
    const question = ama.getQuestion(sessionId, questionId);
    return res.json(question);
});

app.post('/sessions/:sessionId/questions/:questionId', function (req, res, next) {
    // create a session
    const sessionId = req.params.sessionId;
    const questionId = req.params.questionId;
    const ownerId = req.query.owner_id;
    const answer = req.body.answer;
    ama.answerQuestion(sessionId, ownerId, questionId, answer);
    return res.status(201).send();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404, `Resource ${req.method} ${req.originalUrl} not found`));
});

// error handler
app.use(function (err, req, res, next) {
    // For Debugging
    console.error(err);

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.status(err.status || 500).json({ error: err.message || 'Unknown error!' });
});

module.exports = app;
