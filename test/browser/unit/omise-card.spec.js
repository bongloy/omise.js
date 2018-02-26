/**
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 * Mocha - Browser test Bongloy.js
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 */

(function($, expect, BongloyCard, TO) {

'use strict';

// Don't need to display test output.
TO.silentMode();

/**
 * --------------------------------------------------------
 * Spec - Pay.js
 * --------------------------------------------------------
 */
describe('BongloyCard - Control iframe app', function() {

  var $bongloyInjectIframeApp = null;
  var $testForm = null;
  var _frameWrapperId = '';


  before(function() {
    $bongloyInjectIframeApp = $(BongloyCard.Bongloy.frame.frameWrapper);
    $testForm = $('#test-form');
    _frameWrapperId = BongloyCard.getIframeId();
  });


  it('Should found iframe app if bongloy script tag are visible', function() {
    expect($bongloyInjectIframeApp).to.have.length(1);
  });


  it('Should auto generate button from bongloy script tag work properly', function(done) {
    // don't show iframe app in test.
    $bongloyInjectIframeApp.css('opacity', 0)
      .find('iframe').on('load', function() {
        $testForm.find('button').trigger('click');
        expect($bongloyInjectIframeApp.css('display')).to.equal('block');
        done();
      });
  });


  it('Should get form element from bongloy script tag', function() {
    expect(BongloyCard.payForm.nodeType).to.equal(1);
    expect(BongloyCard.payForm.tagName).to.equal('FORM');
  });


  it('Should get form element by selector properly (config - submit form target)', function() {
    expect(BongloyCard.getFormBySelector('#test-form')).to.not.equal(null);
  });


  it('Should iframe app close properly', function(done) {
    setTimeout(function() {
      BongloyCard.close();

      setTimeout(function() {
        expect($bongloyInjectIframeApp.css('display')).to.equal('none');
        done();
      }, 250);
    }, 250);
  });


  it('Should remove iframe app properly', function() {
    var frameWrapper = BongloyCard.removeInjectIframe();
    $bongloyInjectIframeApp = null;
    expect(frameWrapper).to.equal(null);
  });


  it('Should manual set configure', function() {
    var config = BongloyCard.configure({
      publicKey: 'your_public_key_123456789',
      logo: 'https://bongloy-cdn.s3.amazonaws.com/assets/dashboard/images/bongloy-only-logo.png',
      locationField: 'yes',
      submitFormTarget: '#form-target'
    });
    var result = {
      key: 'your_public_key_123456789',
      image: 'https://bongloy-cdn.s3.amazonaws.com/assets/dashboard/images/bongloy-only-logo.png',
      location: 'yes',
      formTarget: '#form-target'
    };

    expect(config).to.deep.equal(result);

    config = BongloyCard.configure({
      amount: 1234
    });
    result = {
      amount: 1234
    };
    expect(config).to.deep.equal(result);
  });


  it('Should manually configure button', function() {
    var $testOutput = $('#test-output');

    // inject button for config.
    var $buttonA = $('<button id="checkout-button-a">Test button A</button>');
    var $buttonB = $('<button id="checkout-button-b">Test button B</button>');

    $buttonA.appendTo($testOutput);
    $buttonB.appendTo($testOutput);

    var configA = {
      frameLabel: 'Merchant A',
      submitLabel: 'PAY RIGHT NOW !',
      amount: 98765,
      buttonLabel: 'Test config button A'
    };
    var configB = {
      frameLabel: 'Merchant B',
      submitLabel: 'PAY RIGHT NOW !',
      amount: 56789,
      buttonLabel: 'Test config button B'
    };

    var resultA = BongloyCard.configureButton('#checkout-button-a', configA);
    expect(resultA.buttonId).to.equal('#checkout-button-a');
    expect(configA).to.deep.equal(resultA.configuration);

    var resultB = BongloyCard.configureButton('#checkout-button-b', configB);
    expect(resultB.buttonId).to.equal('#checkout-button-b');
    expect(configB).to.deep.equal(resultB.configuration);
  });


  it('Should not found iframe before attach (if not found script tag)', function(done) {
    // remove script tag.
    $(BongloyCard.bongloyScriptTag).remove();

    expect(document.getElementById(_frameWrapperId)).to.equal(null);

    BongloyCard.attach();

    setTimeout(function() {
      expect(document.getElementById(_frameWrapperId)).to.not.equal(null);
      done();
    }, 250);
  });


  it('Should custom button configure properly', function() {
    BongloyCard.targetButtonConfig.forEach(function(config) {
      var $targetButton = $(config.buttonId);
      expect($targetButton.text()).to.equal(config.configuration.buttonLabel);
      expect($targetButton.data()).to.deep.equal(config.configuration);
    });
  });

});


/**
 * --------------------------------------------------------
 * Spec - Bongloy.js
 * --------------------------------------------------------
 */
describe('Bongloy.js - Data testing', function() {
  var _windowMessageHandler;

  before(function() {
    Bongloy.setPublicKey('pkey_test_54gujlsw2olh76emx9n');
  });

  it('Should create token from card information properly', function(done) {
    var cardInfomation = {
      name: 'Ratchagarn Naewbuntad',
      number: '4242424242424242',
      expiration_month: '12',
      expiration_year: '2020',
      security_code: '123'
    };

    Bongloy.createToken('card', cardInfomation, function(code, resp) {
      expect(code).to.equal(200);
      expect(resp.object).to.equal('token');
      expect(typeof resp.id).to.equal('string');
      done();
    });
  });

  it('Should handler error from card information properly', function(done) {
    var cardInfomation = {
      name: 'Ratchagarn Naewbuntad',
      number: '424242424242424',
      expiration_month: '13',
      expiration_year: '2099',
      security_code: '092'
    };

    Bongloy.createToken('card', cardInfomation, function(code, resp) {
      expect(code).to.equal(400);
      expect(resp.code).to.equal('invalid_card');
      expect(typeof resp.message).to.equal('string');
      done();
    });
  });

  it('Should `sendTokenAndCloseFrame` work properly', function(done) {
    var BongloyForm = Bongloy.createForm({});
    var mockToken = 'token_1234';
    var mockNote  = 'Note message';
    var _data = {};

    _windowMessageHandler = function(resp) {
      _data = JSON.parse(resp.data);
    }

    window.addEventListener('message', _windowMessageHandler, false);
    BongloyForm.sendTokenAndCloseFrame(mockToken, mockNote);

    // using `setTimeout` for change process order execute
    // need to test in this scope for test result.
    setTimeout(function() {
      expect(_data.action).to.equal('submitTokenAndClose');
      expect(_data.args).to.have.length(2);
      expect(_data.args[0]).to.equal(mockToken);
      expect(_data.args[1]).to.equal(mockNote);
      done();
    }, 100);
  });

  after(function() {
    window.removeEventListener('message', _windowMessageHandler, false);
  })
});

})(
  window.jQuery,
  window.chai.expect,
  window.BongloyCard,
  window._TO_
);
