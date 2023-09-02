const errorHandler = (err, req, res, next) => {
    console.log(err.stack);
    return res.status(500).json(
        {
            status: 500,
            error: err.stack
        }
    )
}

module.exports = errorHandler;