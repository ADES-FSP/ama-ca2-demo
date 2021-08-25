const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());

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
