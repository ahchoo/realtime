module.exports = function () {
  return function (err, req, res, next) {
    if (req.xhr) {
      res.json({
        error: {message: err.message}
      })
    } else {
      next(err)
    }
  }
}
