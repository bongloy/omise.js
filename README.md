# Bongloy.js

## Setup

Insert Bongloy.js script into your page, you can select from our two CDNs

Primary CDN (Singapore)
```html
<script src="https://cdn.bongloy.com/bongloy.js.gz"></script>
```

Secondary CDN (Japan)
```html
<script src="https://cdn2.bongloy.com/bongloy.js.gz"></script>
```

For uncompressed version, remove .gz extension.


#### Then set your public key in a `script` tag

```js
Bongloy.setPublicKey("pkey_test_4xpip92iqmehclz4a4d");
```

That's it. You're good to send card data securely to Bongloy servers.

## Browser compatibility

Bongloy.js relies on the excellent [easyXDM](https://github.com/oyvindkinsey/easyXDM) library for communication with the API. The following browsers are supported:

* Internet Explorer 8 and above.
* Opera 9 and above.
* Firefox 1.0 and above.
* Safari 4 and above.
* Chrome 2 and above.

With the following mobile environment:

* iOS 4 and above.
* Android 2.2 and above.
* Windows Phone 8 and above.

With the following browsers operate in compatibility mode:

* Internet Explorer 6-7 if Flash is installed on user machine.
* Internet Explorer 6 requires TLS 1.0 to be enabled in the browser settings.

## API

### setPublicKey(key)

Setup your public key to authenticate with Bongloy API.

**Arguments:**

* `key` (required) - key is the public keys that you can find in your [dashboard](https://dashboard.bongloy.com) once you're signed in.

### createToken(type, object, callback)

Create a token with the API. This token should be used in place of the card number when communicating with Bongloy API.

**Arguments:**

* `type` (required) - type of token you want to create. For now this value must be `card`.
* `object` (required) - a javascript object containing the 5 values required for a card:  `name`, `number`, `expiration_month`, `expiration_year`, `security_code`.
* `callback`: (required) - a callback that will be triggered whenever the request with bongloy server completes (for both error and success). Two arguments will be passed back into the callback. The HTTP statusCode, like `200` for success or `400` for bad request. The second argument is the response from the Bongloy API.

### Example

The following example shows you how to send the card data to Bongloy API and get a token back.  
If card authorization passed, `response.card.security_code_check` will be `true`. If it's `false` you should ask user to check the card details.  
The Token is in `response.id`, send this token to your backend for creating a charge using your secret key.

```js
// Given that you have a form element with an id of "card" in your page.
var card_form = document.getElementById("card");

// Serialize the card into a valid card object.
var card = {
  "name": card_form.holder_name.value,
  "number": card_form.number.value,
  "expiration_month": card_form.expiration_month.value,
  "expiration_year": card_form.expiration_year.value,
  "security_code": card_form.security_code.value
};

Bongloy.createToken("card", card, function (statusCode, response) {
  if (statusCode == 200) {
    // Success: send back the TOKEN_ID to your server to create a charge.
    // The TOKEN_ID can be found in `response.id`.
  } else {
    // Error: display an error message. Note that `response.message` contains
    // a preformatted error message. Also note that `response.code` will be
    // "invalid_card" in case of validation error on the card.

    // Example Error displaying
    alert(response.code+": "+response.message);
  }
});
```

### Response Object:

```js
{
  "object": "token",
  "id": "tokn_test_5086xl7c9k5rnx35qba",
  "livemode": false,
  "location": "https://vault.bongloy.com/tokens/tokn_test_5086xl7c9k5rnx35qba",
  "used": false,
  "card": {
    "object": "card",
    "id": "card_test_5086xl7amxfysl0ac5l",
    "livemode": false,
    "country": "us",
    "city": "Bangkok",
    "postal_code": "10320",
    "financing": "",
    "last_digits": "4242",
    "brand": "Visa",
    "expiration_month": 10,
    "expiration_year": 2018,
    "fingerprint": "mKleiBfwp+PoJWB/ipngANuECUmRKjyxROwFW5IO7TM=",
    "name": "Somchai Prasert",
    "security_code_check": true,
    "created": "2015-06-02T05:41:46Z"
  },
  "created": "2015-06-02T05:41:46Z"
}

```

Please note that it is important to leave `name` attribute in form `input`s to prevent the credit card data to be sent to your server. For more completed example, please refer to examples/index.html.

## How about validations?

Bongloy.js doesn't validate credit card data before sending them to the API. But if the card isn't valid the API will send a message in the response containing the errors. If you need client side validation you can use something like the [jQuery Credit Card Validator](http://jquerycreditcardvalidator.com) library by [PawelDecowski](https://github.com/PawelDecowski).


## LIBRARY DEVELOPMENT 
For usage, please follow the instruction at [Setup section](#setup) at the top

### Setup

- `npm install`.

### Run

- `npm start`. (build)
- `npm run dev-server`. (run server for development)

### How to run test

- `npm start`.
- `python -m SimpleHTTPServer 8000`.
- Then you can see test result at http://localhost:8000/test/browser.
