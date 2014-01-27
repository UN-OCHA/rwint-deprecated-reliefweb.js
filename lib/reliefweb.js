/**
 * JavaScript client library for Reliefweb
 *
 * @package reliefweb
 */

/**
 * Dependencies
 */
if (typeof require !== 'undefined')
  var request = require("superagent");
else
  var request = superagent;

// Default to the notion that we are running in a browser.
var isNode = false;

var Reliefweb = function(options) {
  /**
   * Configure our client based on provided options
   */
  options         = options || {};
  this.protocol   = options.protocol || 'http';
  this.host       = options.host || 'api.rwlabs.org';
  this.port       = options.port || 80;
  this.version    = options.version || '1';
  this.endpoint   = options.endpoint || this.protocol + '://' + this.host;

  this.userAgent = function() {
    var agent = 'reliefweb.js/0.0.1';
    if (isNode) {
      return 'Node.js/' + process.version + ' | ' + agent;
    }
    return navigator.userAgent + ' | ' + agent;
  }

  this.get = function(resource, params, cb) {
    var uri = this.endpoint;
    if (resource.indexOf('/') == 0) {
      uri += resource;
    }
    else {
      uri += '/v' + this.version + '/' + resource;
    }

    if (params != undefined && !isNaN(params)) {
      // In this case, we assume "params" represents a specific resource ID.
      uri += '/' + params;
      params = null;
    }
    else if (params == {}) {
      params = null;
    }

    var req = request.get(uri).set('User-Agent', this.userAgent());
    if (params != null) {
      req.query(params);
    }
    req.end(function(err, res) {
      if (err) cb(err, null);
      else if (res.error) {
        console.log(res.status);
        cb(new Error('Reliefweb API [HTTP ' + res.status + '] ' + res.body.error.message), res);
      }
      cb(null, res);
    });

   };

  this.reports = function(params, cb) {
    this.get('reports', params, cb);
  };

  this.sources = function(params, cb) {
    this.get('sources', params, cb);
  };

  this.jobs = function(params, cb) {
    this.get('jobs', params, cb);
  };

  this.training = function(params, cb) {
    this.get('training', params, cb);
  };

  this.countries = function(params, cb) {
    this.get('countries', params, cb);
  };

  this.disasters = function(params, cb) {
    this.contents('disasters', params, cb);
  };
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
  isNode = true,
  module.exports = {
    Client : Reliefweb,

    /*
     * Shorthand Client constructor function
     */
    client: function(options) {
      return new Reliefweb(options);
    }
  };
else
  window.reliefweb = Reliefweb;


