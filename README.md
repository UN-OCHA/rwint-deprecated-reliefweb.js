# reliefweb.js

JavaScript and Node bindings for the ReliefWeb API.
Read the [docs on ReliefWeb.int](http://reliefweb.int/help/api) or [get started with the API](http://api.rwlabs.org).

[![Build Status](https://travis-ci.org/reliefweb/reliefweb.js.svg)](https://travis-ci.org/reliefweb/reliefweb.js)
[![npm version](https://badge.fury.io/js/reliefweb.svg)](https://www.npmjs.com/package/reliefweb)

# Installation

## Install via NPM

Checkout this repository and run:

    npm install

Include in your code with

    var reliefweb = require("reliefweb");

## Manual installation

Download the latest code from GitHub, and include lib/reliefweb.js in your html.

```javascript
<script type="text/javascript" src="node_modules/superagent/superagent.js"></script>
<script type="text/javascript" src="lib/reliefweb.js"></script>
```

# Usage

## Node.js

```javascript
var reliefweb = require('reliefweb');
var rw = reliefweb.client();

rw.reports(1414, function(err, response) {
  console.log(response.body);
});
```
## Browser &lt;script>

```javascript
<script type="text/javascript">
    var rw = reliefweb.client();

    rw.reports(1414, function(err, response) {
        console.log(response.body);
    });
</script>
```

## Running Tests

* Install all dev dependencies.
* Use `make test` or `make jenkins`
* To specify configuration for the tests, such as the host, we are using the [node-config](http://lorenwest.github.io/node-config/latest/) library.
** For example, `export NODE_CONFIG='{"api":{"host":"api.rwlabs.org"}}'`

# Tips & Tricks

## Get the full URL in the response callback

```js
    rw.reports().end(function(err, response) {
      var request = response.request;
      console.log(request.url);
    });
```
