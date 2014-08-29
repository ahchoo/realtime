var expect = require('expect.js')
var request = require('supertest')
var proxyquire = require('proxyquire')

describe('Routes test', function () {
  describe('Game', function () {
    var app
    var item

    before(function (done) {
      var connectDB = proxyquire('../../lib/connect-db', {
        '../config/mongo': require('../../test/config/mongo')
      })
      proxyquire('../../fixture', {
        '../lib/connect-db': connectDB
      })()
      app = proxyquire('../../app', {
        '../lib/connect-db': connectDB
      })

      setTimeout(function () {
        // TODO stupid too...
        request(app)
          .get('/api/items')
          .end(function (err, res) {
            item = res.body.data[0]
            done()
          })
      }, 1000)
    })

    after(function () {
      require('mongoose').disconnect()
    })

    describe('POST /api/games', function () {
      it('expect create a game info', function (done) {
        request(app)
          .post('/api/games')
          .type('form')
          .send({
            item: item._id,
            capacity: 50,
            status: 'stub status',
            countdown: 49
          })
          .end(function (err, res) {
            expect(err).to.not.be.ok()
            expect(res.body.data.item.title).to.be(item.title)
            expect(res.body.data.capacity).to.be(50)
            expect(res.body.data.status).to.be('stub status')
            expect(res.body.data.countdown).to.be(49)
            done()
          })
      })
    })

    describe('GET /api/games', function () {
      it('expect get all games info', function (done) {
        request(app)
          .get('/api/games')
          .end(function (err, res) {
            expect(err).to.not.be.ok()
            expect(res.body.data).to.be.ok()
            expect(res.body.data.length).to.be(1)
            expect(res.body.data[0].item.title).to.be(item.title)
            expect(res.body.data[0].capacity).to.be(50)
            expect(res.body.data[0].status).to.be('stub status')
            expect(res.body.data[0].countdown).to.be(49)
            done()
          })
      })
    })
  })
})

