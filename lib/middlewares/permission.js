module.exports = function (permissions) {
  return function (req, res, next) {
    //console.log(req.method)
    if (permissions[req.method].indexOf(getUserRole()) == -1) {
      // reject
      return next(err)
    } else {
      return next()
    }
  }
}
