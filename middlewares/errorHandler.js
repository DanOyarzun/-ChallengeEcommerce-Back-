const e = require("express");
const { DatabaseError } = require("pg");

const errorHandler = (err, req, res, next) => {
    console.log(req.method, req.path);
    console.error(err);

    const statusCode = res.statusCode !== 200 ? res.statusCode : err.status ?? 500;
    const message = err instanceof DatabaseError ? `Error en la base de datos: ${err.message}` : err.message ?? "Internal server error";

    res.status(statusCode).json({ error: message });
};

const notFound = (req, res, next) => {
    res.status(404);
    next(new Error(`Not found - ${req.originalUrl}`));
}

module.exports = { errorHandler, notFound };