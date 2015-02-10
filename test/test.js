var assert = require('assert')
  , reliefweb = require('../lib/reliefweb')
  , config = require('config')
;

var resources = {
  "v0": ["job", "training", "disaster", "source", "country", "report"],
  "v1": ["jobs", "training", "disasters", "sources", "countries", "reports"]
};

var items = {
  "v1": {
    "jobs": 656171,
    "training": 586347,
    "disasters": 14072,
    "sources": 1503,
    "countries": 13,
    "reports": 436552
  }
};

describe('reliefweb.js', function() {
  var rw = reliefweb.client({
    'host': config.api.host
  });

  it('produces a valid API client', function() {
    rw.should.be.an.instanceOf(reliefweb.Client);
  });

  it('can be used to query the API', function(done) {
    rw.request('/', function(err, response) {
      response.status.should.equal(200);
      done();
    });
  });
});


describe('Verify Resource', function() {
  before(function() {
    this.rw = reliefweb.client({
      'host': config.api.host
    });
  });

  resources.v1.map(function(resource) {
    describe(resource, function() {
      before(function() {
        this.resource = resource;
        this.id = items.v1[resource];
      });

      it('provides lists of content', function(done) {
        this.rw.get(this.resource, function(err, response) {
          response.status.should.equal(200);
          done();
        });
      });

      it('provides single entities', function(done) {
        this.rw.get(this.resource + '/' + this.id, function(err, response) {
          response.status.should.equal(200);
          done();
        });
      });

      it('may be listed via a wrapper method', function(done) {
        this.rw[this.resource]().end(function(err, response) {
          response.status.should.equal(200);
          done();
        });
      });

      it('may have items retrieved via a wrapper method', function(done) {
        this.rw[this.resource](this.id).end(function(err, response) {
          response.status.should.equal(200);
          done();
        });
      });
    });
  });
});

describe('Invalid Resources', function() {
  var rw = reliefweb.client({
    'host': config.api.host
  });

  it('provide a 404 when queried', function(done) {
    rw.get('fake').end(function(err, response) {
      var request = response.request;
      response.status.should.equal(404);
      done();
    });
  });

  it('are not supported with a wrapper', function() {
    rw.should.not.have.property('fake');
  });
});

describe('Specify Methods', function() {
  var rw = reliefweb.client({
    'host': config.api.host
  });

  it('uses GET by default', function(done) {
    rw.reports().end(function(err, response) {
      var request = response.request;
      request.method.should.equal('GET');
      done();
    });
  });

  it('should allow method overriding to POST', function(done) {
    rw.method('POST').reports().end(function(err, response) {
      var request = response.request;
      request.method.should.equal('POST');
      done();
    });
  });
});
