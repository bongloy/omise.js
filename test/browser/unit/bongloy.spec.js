/**
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 * Mocha - Browser test Bongloy.js
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 */

(function($, expect, TO) {

'use strict';

// Don't need to display test output.
TO.silentMode();

/**
 * --------------------------------------------------------
 * Spec - Bongloy.js
 * --------------------------------------------------------
 */
describe('Bongloy.js - Data testing', function() {
  var _windowMessageHandler;

  before(function() {
    Bongloy.setPublicKey('pk_test_1044d8940f2c0067b6977bb3945394d3660d9487a638f882a0bd7e271f8583db');
  });

  it('Should create token from card information properly', function(done) {
    this.timeout(5000);

    var cardInfomation = {
      name: 'Ratchagarn Naewbuntad',
      number: '4242424242424242',
      exp_month: '12',
      exp_year: '2020',
      cvc: '123'
    };

    Bongloy.createToken('card', cardInfomation, function(code, resp) {
      expect(code).to.equal(201);
      expect(resp.object).to.equal('token');
      expect(typeof resp.id).to.equal('string');
      done();
    });
  });

  it('Should handler error from card information properly', function(done) {
    var cardInfomation = {
      name: 'Ratchagarn Naewbuntad',
      number: '424242424242424',
      exp_month: '13',
      exp_year: '2099',
      cvc: '092'
    };

    Bongloy.createToken('card', cardInfomation, function(code, resp) {
      expect(code).to.equal(422);
      expect(resp.error.card[0]).to.equal('is invalid');
      expect(typeof resp.error.message).to.equal('object');
      done();
    });
  });

  after(function() {
    window.removeEventListener('message', _windowMessageHandler, false);
  })
});

})(
  window.jQuery,
  window.chai.expect,
  window._TO_
);
