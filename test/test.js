var assert = require('assert')
  , reliefweb = require('../lib/reliefweb')
  , shared = require('./shared');

var config = require('config');

var resources = {
  "v0": ["job", "training", "disaster", "source", "country", "report"],
  "v1": ["jobs", "training", "disasters", "sources", "countries", "reports"]
};

var items = {
  "v1": {"jobs": 606898, "training": 634730, "disasters": 13596, "sources": 13656, "countries": 8657, "reports": 436552}
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
      rw.get('/', null, function(err, response) {
        response.status.should.equal(200);
        done();
      });
    })
  })
  describe('Version (/v0)', function(){
    var rw;
    before(function() {
      rw = reliefweb.client({
        'host': config.api.host
      });
    });

    it('should return 200', function(done) {
      rw.get('/v0', null, function(err, response) {
        response.status.should.equal(200);
        done();
      });
    })
    it('should have all elements', function(done) {
      rw.get('/v0', null, function(err, response) {
        response.body.data.title.should.be.ok;
        response.body.time.should.be.an.instanceOf(Number);
        response.body.version.should.equal('0');
        response.body.status.should.equal(response.status);
        response.body.data.endpoints.should.be.ok;
        done();
      });
    })
    it('should list all resources', function(done) {
      rw.get('/v0', null, function(err, response) {
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
      rw.get('/v1', null, function(err, response) {
        response.status.should.equal(200);
        done();
      });
    })
    it('should have all elements', function(done) {
      rw.get('/v1', null, function(err, response) {
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
      rw.get('/v1', null, function(err, response) {
        resources.v1.map(function(resource){
          response.body.data[resource].should.be.ok;
          response.body.data[resource].href.should.be.ok;
          response.body.data[resource].title.should.be.ok;
        });
        done();
      });
    })
    it('should be cached for 3 hours', function(done) {
      rw.get('/v1', null, function(err, response) {
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
