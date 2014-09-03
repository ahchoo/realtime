var router = require('../public/js/router')

describe('router', function () {

  beforeEach(function () {
    // clear route configs
    router._routes.length = 0
  })

  it('should match url', function () {
    var handler = jasmine.createSpy('handler')

    router
      .use('/item')
      .use('/item/:itemId/edit', handler)
      .use('/game/:gameId')

    router.goto('/item/123/edit')

    expect(handler).toHaveBeenCalledWith({itemId: '123'})
  })

})
