/**
 * JavaScript client library for Reliefweb
 *
 * @package reliefweb
 */

/**
 * Dependencies
 */
if (typeof require !== 'undefined')
  var agent = require("superagent");
else
  var agent = superagent;

// Default to the notion that we are running in a browser.
var isNode = false;

// Injects configuration on top of default values.
var Reliefweb = function(options) {
  options         = options || {};
  this.protocol   = options.protocol || 'http';
  this.host       = options.host || 'api.rwlabs.org';
  this.port       = options.port || 80;
  this.version    = options.version || '1';
  this.endpoint   = options.endpoint || this.protocol + '://' + this.host;
  this.query      = options.query || {};

  // Attempt to compel use of GET unless it's explicitly set.
  this.defaultMethod = 'GET';

  // Appends the client library to the current useragent.
  this.userAgent = function() {
    var pkg = require('../package.json');
    var agent = 'reliefweb.js/' + pkg.version;
    return 'Node.js/' + process.version + ' | ' + agent;
  };

  /**
   * Validates a URL
   *
   * @param url
   * @return {Boolean}
   *
   * @see http://stackoverflow.com/a/18593669
   */
  this.validateUrl = function(url) {
    return /^(http|https):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(\#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/.test(url);
  }

  // Constructs a base url based on configured client.
  this.baseUrl = function() {
    var port = this.port != 80 ? ':' + this.port : '';
    return this.protocol + '://' + this.host + port + '/v' + this.version;
  }

  // Takes the url or resource identifier and assembles an absolute URI.
  this.uri = function(url) {
    if (undefined == url || '/' == url) {
      return this.baseUrl();
    }
    if (this.validateUrl(url)) {
      return url;
    }

    return this.baseUrl() + '/' + url;
  }

  // ReliefWeb.js version of the Superagent factory.
  this.request = function(method, url) {
    var instance;
    // callback
    if ('function' == typeof url) {
      instance = new agent('GET', this.uri(method))
        .query(this.query);
      if (isNode) {
        instance.set('User-Agent', this.userAgent());
      }
      return instance.end(url);
    }

    // url first
    if (1 == arguments.length) {
      instance = new agent('GET', this.uri(method))
        .query(this.query);
      if (isNode) {
        instance.set('User-Agent', this.userAgent());
      }
      return instance;
    }

    instance = new agent(method, this.uri(url))
      .query(this.query);
    if (isNode) {
      instance.set('User-Agent', this.userAgent());
    }
    return instance;
  }

  // GET wrapper for dynamic resource specification.
  this.get = function(resource, cb) {
    if (undefined == cb) {
      return this.request('GET', resource)
    }
    return this.request('GET', resource).end(cb);
  }

  // POST wrapper for dynamic resource specification.
  this.post = function(resource, cb) {
    if (undefined == cb) {
      return this.request('POST', resource)
    }
    return this.request('POST', resource).end(cb);
  }

  /**
   * Specify the default method if one is supplied.
   *
   * This allows specification of the POST method as needed.
   */
  this.method = function(val) {
    if (undefined != val) {
      this.defaultMethod = val;
    }

    return this;
  }

  this.reports = function(id) {
    if (undefined == id) {
      return this.request(this.defaultMethod, 'reports');
    }

    return this.request(this.defaultMethod, 'reports/' + id);
  }

  this.jobs = function(id) {
    if (undefined == id) {
      return this.request(this.defaultMethod, 'jobs');
    }

    return this.request(this.defaultMethod, 'jobs/' + id);
  }

  this.training = function(id) {
    if (undefined == id) {
      return this.request(this.defaultMethod, 'training');
    }

    return this.request(this.defaultMethod, 'training/' + id);
  }

  this.sources = function(id) {
    if (undefined == id) {
      return this.request(this.defaultMethod, 'sources');
    }

    return this.request(this.defaultMethod, 'sources/' + id);
  }

  this.disasters = function(id) {
    if (undefined == id) {
      return this.request(this.defaultMethod, 'disasters');
    }

    return this.request(this.defaultMethod, 'disasters/' + id);
  }

  this.countries = function(id) {
    if (undefined == id) {
      return this.request(this.defaultMethod, 'countries');
    }

    return this.request(this.defaultMethod, 'countries/' + id);
  }
}

// ReliefWeb-specific request parameter helpers.
agent.Request.prototype.limit = function(val) {
  this.query({ limit: val});
  return this;
}

agent.Request.prototype.offset = function(val) {
  this.query({ offset: val});
  return this;
}

// 'query' is already taken, so replacing as 'search'.
agent.Request.prototype.search = function (val) {
  this.send({ query: { value: val }});
  return this;
}

agent.Request.prototype.sort = function (field, direction) {
  this.send({ sort: [field + ':' + direction] });
  return this;
}

agent.Request.prototype.fields = function (list, hide) {
  list = typeof list == 'string' ? [list] : list;
  hide = typeof hide == 'string' ? [hide] : hide;
  this.send({ fields: { include: list, exclude: hide}});
  return this;
}

agent.Request.prototype.filter = function (name, value) {
  var filter = {}
  if (name instanceof Array) {
    filter.conditions = name;
    filter.operator = value;
  }
  else {
    filter.field = name;
    if (value != undefined) {
      filter.value = value;
    }
  }
  this.send({filter: filter});
  return this;
}

agent.Request.prototype.profile = function(name) {
  this.query({ profile: name });
  return this;
}

agent.Request.prototype.preset = function(name) {
  this.query({ preset: name });
  return this;
}

// Loader.
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
  window.reliefweb = {
    client: function(options) {
      return new Reliefweb(options);
    }
  };
