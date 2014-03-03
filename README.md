# reliefweb.js

Node.js and JavaScript bindings for the Reliefweb.int API.

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
    var reliefweb = require('reliefweb');
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
