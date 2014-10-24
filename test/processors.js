exports.shouldBehaveAsExpected = function(reliefweb, config, resources, items) {
  var rw;
  before(function() {
    rw = reliefweb.client({
      'host': config.api.host
    });
  });

  it('should swap profiles for items', function(done) {
    rw.reports(items.v1.reports).profile('minimal').end(function(err, response) {
      response.status.should.equal(200);
      Object.keys(response.body.data[0].fields).length.should.equal(1);
      done();
    });
  });
  it('should swap profiles for lists', function(done) {
    rw.reports().profile('minimal').end(function(err, response) {
      response.status.should.equal(200);
      Object.keys(response.body.data[0].fields).length.should.equal(1);
      done();
    });
  });
  it('should accept presets for items', function(done) {
    rw.reports(items.v1.reports).preset('analysis').end(function(err, response) {
      response.status.should.equal(200);
      done();
    });
  });
  it.only('should swap presets for lists', function(done) {
    rw.method('POST').jobs().preset('analysis').fields('status').filter('status', 'expired').end(function(err, response) {
      response.status.should.equal(200);
      response.body.data[0].fields.status.should.equal('expired');
      done();
    });
  });
};
