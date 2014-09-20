var arena = require('../../lib/socket/arena')
var Game = require('../../lib/socket/game')
var _ = require('underscore')

describe('Realtime arena model', function () {

  beforeEach(function () {
    arena.games = {}
  })

  it('should add a game by id', function () {
    var game = arena.addGame('abc')

    var res = game instanceof Game
    res.should.be.true

    _.keys(arena.games).should.have.length(1)
  })

  it('should get a game by id', function () {
    arena.addGame('abc')

    var game = arena.game('abc')

    game.id.should.equal('abc')
  })

  it('should remove a game by id', function () {
    arena.addGame('abc')

    arena.removeGame('abc')

    _.keys(arena.games).should.have.length(0)
  })

  it('should remove the game on game ends', function () {
    var game = arena.addGame('abc')

    game.start()
    game.end()

    _.keys(arena.games).should.have.length(0)
  })

  it('should remove the game on player left if there are no players in the game', function () {
    var game = arena.addGame('abc')

    game.join({id: 'foo'})
    game.leave({id: 'foo'})

    _.keys(arena.games).should.have.length(0)
  })

  it('should not remove the game on player left if there are players in the game', function () {
    var game = arena.addGame('abc')

    game.join({id: 'foo'})
    game.join({id: 'bar'})
    game.leave({id: 'bar'})

    _.keys(arena.games).should.have.length(1)
  })

})
