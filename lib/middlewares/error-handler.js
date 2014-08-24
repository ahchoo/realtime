module.exports = function () {
  return function (err, req, res, next) {
    res.json({
      error: {message: err.message},
      data: null
    })
  }
}
