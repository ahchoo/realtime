// /* global describe, before, after, it */

// var expect = require('expect.js')
// var request = require('supertest')

// describe('Routes test', function () {
//   describe('Game', function () {
//     var app
//     var item
//     var gameId

//     before(function (done) {
//       require('mockgoose')(require('mongoose'))
//       require('../../fixture')().then(function () {
//         require('mongoose').disconnect(function () {
//           app = require('../../app')
//           request(app)
//             .get('/api/items')
//             .end(function (err, res) {
//               item = res.body.data[0]
//               done()
//             })
//         })
//       })
//     })

//     after(function () {
//       require('mongoose').disconnect()
//     })

//     describe('POST /api/games', function () {
//       it('expect create a game info', function (done) {
//         request(app)
//           .post('/api/games')
//           .type('form')
//           .send({
//             item: item._id,
//             capacity: 50,
//             status: 'stub status',
//             countdown: 49
//           })
//           .end(function (err, res) {
//             expect(err).to.not.be.ok()
//             done()
//           })
//       })
//     })

//     describe('GET /api/games', function () {
//       it('expect get all games info', function (done) {
//         request(app)
//           .get('/api/games')
//           .end(function (err, res) {
//             expect(err).to.not.be.ok()
//             expect(res.body.data).to.be.ok()
//             expect(res.body.data.length).to.be(2)

//             gameId = res.body.data[0]._id

//             done()
//           })
//       })
//     })

//     describe('GET /api/games/:gameId', function () {
//       it('expect get a specific game info', function (done) {
//         expect(gameId).to.be.ok()
//         request(app)
//           .get('/api/games/' + gameId)
//           .end(function (err, res) {
//             expect(err).to.not.be.ok()
//             expect(res.body.data).to.be.ok()
//             done()
//           })
//       })
//     })

//     describe('DELETE /api/games/:gameId', function () {
//       it('expect remove a specific game', function (done) {
//         expect(gameId).to.be.ok()
//         request(app)
//           .delete('/api/games/' + gameId)
//           .end(function (err, res) {
//             expect(err).to.not.be.ok()
//             expect(res.body.data).to.be.ok()

//             request(app)
//               .get('/api/games')
//               .end(function (err, res) {
//                 expect(err).to.not.be.ok()
//                 expect(res.body.data).to.be.ok()
//                 expect(res.body.data.length).to.be(1)
//                 done()
//               })
//           })
//       })
//     })

//   })
// })
