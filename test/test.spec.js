var expect = require('expect')
var app = require('../app')
var request = require('supertest')

describe('A suite', function () {
  it('contains spec with an expectation', function () {
    expect(true).toBe(true)
  })
})

describe('Server test', function () {
  it('GET /api/games', function (done) {
    request(app)
      .get('/api/games')
      .end(function (err, res) {
        console.log(res.headers)
        done()

        // TODO same stupid
        setTimeout(function () {
          process.exit()
        }, 1000)
      })
  })
})
