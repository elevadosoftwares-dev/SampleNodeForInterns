const errorHandler = async (err, req, res, next) => {
    console.log("Error : ",err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error"
    })
};

module.exports = errorHandler;