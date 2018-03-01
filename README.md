# Bongloy.js

Bongloy.js was inspired from [Omise.js](https://github.com/omise/omise.js). Thanks to the Omise team for such a great library.

## Setup

Insert Bongloy.js script into your page

Primary CDN (Singapore)
```html
<script src="https://js.bongloy.com/v3/"></script>
```

#### Then set your public key in a `script` tag

```js
Bongloy.setPublicKey("pk_test_1044d8940f2c0067b6977bb3945394d3660d9487a638f882a0bd7e271f8583db");
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
* `object` (required) - a javascript object containing the 5 values required for a card:  `name`, `number`, `exp_month`, `exp_year`, `cvc`.
* `callback`: (required) - a callback that will be triggered whenever the request with bongloy server completes (for both error and success). Two arguments will be passed back into the callback. The HTTP statusCode, like `201` for success or `422` for bad request. The second argument is the response from the Bongloy API.

### Example

The following example shows you how to send the card data to Bongloy API and get a token back.  
If card authorization passed, `response.card.cvc_check` will be `true`. If it's `false` you should ask user to check the card details.  
The Token is in `response.id`, send this token to your backend for creating a charge using your secret key.

```js
// Given that you have a form element with an id of "card" in your page.
var card_form = document.getElementById("card");

// Serialize the card into a valid card object.
var card = {
  "name": card_form.holder_name.value,
  "number": card_form.number.value,
  "exp_month": card_form.expiration_month.value,
  "exp_year": card_form.expiration_year.value,
  "cvc": card_form.security_code.value
};

Bongloy.createToken("card", card, function (statusCode, response) {
  if (statusCode == 201) {
    // Success: send back the TOKEN_ID to your server to create a charge.
    // The TOKEN_ID can be found in `response.id`.
  } else {
    // Error: display an error message. Note that `response.message` contains
    // a preformatted error message.

    // Example Error displaying
    alert(response.code+": "+response.message);
  }
});
```

### Response Object:

```js
{
  "id":"1f491f39-b732-4979-ac58-5ee613094852",
  "used":false,
  "livemode":false,
  "object":"token",
  "card":{
    "id":"18ee0d88-4b07-4208-bbd0-683b633fda60",
    "exp_month":12,
    "exp_year":2020,
    "name":"Ratchagarn Naewbuntad",
    "address_line1":null,
    "address_line2":null,
    "address_city":null,
    "address_state":null,
    "address_zip":null,
    "address_country":null,
    "brand":"visa",
    "fingerprint":null,
    "country":null,
    "cvc_check":"unchecked",
    "address_line1_check":"unchecked",
    "address_zip_check":"unchecked",
    "object":"card",
    "last4":"4242",
    "created":1519875653,
    "customer":null
  },
  "type":"card",
  "created":1519875653,
  "client_ip":"127.0.0.1"
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
