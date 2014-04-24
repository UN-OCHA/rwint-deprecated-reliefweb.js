var assert = require('assert')
  , reliefweb = require('../lib/reliefweb')
  , shared = require('./shared');

var config = require('config');

var resources = {
  "v0": ["job", "training", "disaster", "source", "country", "report"],
  "v1": ["jobs", "training", "disasters", "sources", "countries", "reports"]
};

var items = {
  "v1": {"jobs": 606898, "training": 399467, "disasters": 13596, "sources": 13656, "countries": 8657, "reports": 436552}
};

describe('reliefweb.js', function() {
  var rw = reliefweb.client({
    'host': config.api.host
  });
  it ('produces a valid API client', function() {
    rw.should.be.an.instanceOf(reliefweb.Client);
  })
});

describe('API Meta-Resources', function(){
  describe('Root (/)', function(){
    var rw;
    before(function() {
      rw = reliefweb.client({
        'host': config.api.host
      });
    });

    it('should return 200', function(done) {
      rw.request('/', function(err, response) {
        response.status.should.equal(200);
        done();
      });
    })
  })
  describe('Version (/v0)', function(){
    var rw;
    before(function() {
      rw = reliefweb.client({
        'host': config.api.host,
        'version': '0'
      });
    });

    it('should return 200', function(done) {
      rw.get('/', function(err, response) {
        response.status.should.equal(200);
        done();
      });
    })
    it('should have all elements', function(done) {
      rw.get('/', function(err, response) {
        response.body.data.title.should.be.ok;
        response.body.time.should.be.an.instanceOf(Number);
        response.body.version.should.equal('0');
        response.body.status.should.equal(response.status);
        response.body.data.endpoints.should.be.ok;
        done();
      });
    })
    it('should list all resources', function(done) {
      rw.get('/', function(err, response) {
        resources.v0.map(function(resource){
          response.body.data.endpoints[resource].should.be.ok;
          response.body.data.endpoints[resource].item.should.be.ok;
          response.body.data.endpoints[resource].list.should.be.ok;
          response.body.data.endpoints[resource].info.should.be.ok;
        });
        done();
      });
    })
  })
  describe('Version 1 (/v1)', function(){
    var rw;
    before(function() {
      rw = reliefweb.client({
        'host': config.api.host
      });
    });

    it('should return 200', function(done) {
      rw.get('/', function(err, response) {
        response.status.should.equal(200);
        done();
      });
    })
    it('should have all elements', function(done) {
      rw.get('/', function(err, response) {
        response.body.title.should.be.ok;
        response.body.description.should.be.ok;
        response.body.build.should.be.ok;
        response.body.links.should.be.ok;
        response.body.data.should.be.ok;
        response.body.time.should.be.an.instanceOf(Number);
        response.body.version.should.equal('1');
        // Status is not used in v1.
        response.body.should.not.have.property('status');
        done();
      });
    })
    it('should list all resources', function(done) {
      rw.get('/', function(err, response) {
        resources.v1.map(function(resource){
          response.body.data[resource].should.be.ok;
          response.body.data[resource].href.should.be.ok;
          response.body.data[resource].title.should.be.ok;
        });
        done();
      });
    })
    it('should be cached for 3 hours', function(done) {
      rw.get('/', function(err, response) {
        response.headers['cache-control'].should.equal('public, max-age=10800');
        done();
      });
    })
  })
})

describe('API v1 Entity:', function(){
  before(function() {
    this.rw = reliefweb.client({
      'host': config.api.host
    });
  });

  resources.v1.map(function(resource){
    describe(resource, function() {
      before(function() {
        this.resource = resource;
        this.id = items.v1[resource];
      })

      shared.shouldBehaveLikeAnEntity();
    })
  })
})

describe('API v1: Reports - Advanced Testing', function() {
  var rw;
  before(function() {
    rw = reliefweb.client({
      'host': config.api.host
    });
  });

  it('allows lists to be filtered by multiple conditions', function(done) {
    var params = {
      filter: {
        operator: 'AND',
        conditions: [
          {
            field: 'title',
            value: 'humanitarian'
          },
          {
            field: 'source',
            value: 'OCHA'
          }
        ]
      }
    };
    rw.reports().send(params).end(function(err, response) {
      response.status.should.equal(200);
      response.body.count.should.equal(10);
      done();
    });
  })

  it('allows date fields to be filtered with ISO 8601 inputs', function(done) {
    var params = {
      filter: {
        field: 'date.created',
        value: {
          from: '2007-07-31T04%3A00%3A00%2B00%3A00'
        }
      }
    };

    rw.reports().send(params).end(function(err, response) {
      response.status.should.equal(200);
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
      console.log(response.body);
      response.status.should.equal(200);
      done();
    });
  })

  it('allows POST requests to be made', function(done) {
    rw.method('POST').reports().end(function(err, response) {
      console.log(err);
      response.status.should.equal(200);
      done();
    });
  })
})
