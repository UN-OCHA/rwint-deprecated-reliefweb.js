var assert = require('assert')
  , reliefweb = require('../lib/reliefweb')
  , content = require('./content')
  , meta = require('./meta')
  , advanced = require('./advanced')
  , facets = require('./facets')
  , processors = require('./processors')

;

var config = require('config');

var resources = {
  "v0": ["job", "training", "disaster", "source", "country", "report"],
  "v1": ["jobs", "training", "disasters", "sources", "countries", "reports"]
};

var items = {
  "v1": {"jobs": 656171, "training": 586347, "disasters": 14072, "sources": 1503, "countries": 13, "reports": 436552}
};

describe('reliefweb.js', function() {
  var rw = reliefweb.client({
    'host': config.api.host
  });
  it ('produces a valid API client', function() {
    rw.should.be.an.instanceOf(reliefweb.Client);
  })
});

describe('API Meta-Resources', function() {
  meta.shouldBehaveLikeAMetaResource(reliefweb, config, resources, items);
})

describe('API v1 Entity:', function() {
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
      })

      content.shouldBehaveLikeAnEntity();
    })
  })
})

describe('API v1: Advanced Use Cases', function() {
  advanced.shouldBehaveAsExpected(reliefweb, config, resources, items);
})

describe('API v1 status field tests', function() {
  var rw;
  before(function() {
    rw = reliefweb.client({
      'host': config.api.host
    });
  });

  it('should see the status field', function(done) {
    rw.method('POST').reports().fields('status').limit(1).end(function(err, response) {
      response.status.should.equal(200);
      response.body.data[0].fields.status.should.exist;
      done();
    });
  })
})

describe('API v1 POST tests', function() {
  var rw;
  before(function() {
    rw = reliefweb.client({
      'host': config.api.host
    });
  });

  it('simple GET test to verify functionality', function (done) {
    rw.reports(238722).end(function(err, response) {
      response.status.should.equal(200);
      done();
    });
  })

  it('allows POST requests to be made', function(done) {
    rw.method('POST').reports().end(function(err, response) {
      response.status.should.equal(200);
      done();
    });
  })
})

describe('API v1 Facet support', function() {
  facets.shouldBehaveAsExpected(reliefweb, config, resources, items);
})


describe('API v1 Processors', function() {
  processors.shouldBehaveAsExpected(reliefweb, config, resources, items);
})
