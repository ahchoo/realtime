var Game = require('../../lib/socket/game')
var sinon = require('sinon')

describe('Realtime game model', function () {
  var game
  var clock

  before(function () { clock = sinon.useFakeTimers() })
  after(function () { clock.restore() })

  beforeEach(function () {
    game = new Game('abc')

    sinon.stub(game, 'emit')
  })

  it('should add a player to the game', function () {
    game.players.should.have.length(0)

    game.join({id: 'foo'})

    game.players.should.have.length(1)
    game.emit.calledWith('player joined', {id: 'foo'}).should.be.true
  })

  it('should remove a player from the game', function () {
    game.join({id: 'foo'})

    game.leave({id: 'foo'})

    game.players.should.have.length(0)

    game.emit.calledWith('player left', {id: 'foo'})
  })

  it('should start the game and end in 10s', function () {
    game.start()

    game.emit.calledWith('start').should.be.true

    clock.tick(10000)

    game.emit.calledWith('end').should.be.true
  })

  it('should update game status', function () {
    game.status.should.equal('idle')

    game.start()

    game.status.should.equal('started')

    clock.tick(10000)

    game.status.should.equal('ended')
  })

  it('should reset the game', function () {
    game.join({id: 'foo'})

    game.start()

    clock.tick(5000)

    game.reset({id: 'foo'})

    game.emit.calledWith('reset', {id: 'foo'}).should.be.true

    clock.tick(5000)

    game.emit.calledWith('end').should.be.false

    clock.tick(5000)

    game.emit.calledWith('end').should.be.true
  })

  it('cannot reset game if player not exists', function () {
    game.start()

    clock.tick(3000)

    game.reset({id: 'foo'})

    clock.tick(7000)

    game.emit.calledWith('end').should.be.true
  })

  it('cannot reset game if balance is 0', function () {
    game.join({id: 'foo'})
    game.balance.foo = 0

    game.start()

    clock.tick(7000)

    game.reset({id: 'foo'})

    clock.tick(3000)

    game.emit.calledWith('end').should.be.true
  })

  it('cannot reset game if game is not started', function () {
    game.join({id: 'foo'})
    game.reset({id: 'foo'})

    game.emit.calledWith('reset', {id: 'foo'}).should.be.false
  })

})
