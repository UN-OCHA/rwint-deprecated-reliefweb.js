var url = require('url');

exports.shouldBehaveAsExpected = function(reliefweb, config, resources, items) {  
  var rw;
  before(function() {
    rw = reliefweb.client({
      'host': config.api.host
    });
  });

  it('should not return body when only body-html is requested', function(done) {
    rw.method('POST').reports().fields('body-html').end(function(err, response) {
      response.status.should.equal(200);
      response.body.data[0].fields.should.have.property('body-html');
      response.body.data[0].fields.should.not.have.property('body');
      done();
    });
  })

  it('allows lists to be filtered by multiple conditions', function(done) {
    var conditions = [
      {
        field: 'title',
        value: 'humanitarian'
      },
      {
        field: 'source',
        value: 'OCHA'
      }
    ];
    rw.method('POST').reports().filter(conditions, 'AND').end(function(err, response) {
      response.status.should.equal(200);
      response.body.count.should.equal(10);
      done();
    });
  })

  it('allows date fields to be filtered with ISO 8601 inputs', function(done) {
    rw.method('POST').reports()
      .filter('date.created', {from: '2007-07-31T00:00:00+00:00'})
      .end(function(err, response) {
        response.status.should.equal(200);
        done();
    });
  })

  it('allows limit parameter to be equal to 0.', function(done) {
    rw.reports().limit(0).end(function(err, response) {
      response.status.should.equal(200);
      response.body.count.should.equal(0);
      response.body.totalCount.should.be.above(0);
      done();
    });
  })

  it('allows sorting by score', function(done) {
    rw.method('POST').reports()
      .search('humanitarian essential ocha').sort('score', 'desc').limit(2)
      .end(function(err, response) {
        response.status.should.equal(200);
        response.body.data[0].score.should.be.above(response.body.data[1].score);
        done();
    });
  })

  it('pages by 10 by default', function(done) {
    rw.reports().end(function(err, response) {
      response.body.count.should.equal(10);
      done();
    });
  })

  it('persists the default limit in the pager link', function(done) {
    rw.reports().end(function(err, response) {
      response.body.links.next.should.have.property('href');
      var parts = url.parse(response.body.links.next.href, true);
      parts.query.limit.should.equal('10');
      done();
    });
  })

  it('persists the default offset in the pager link', function(done) {
    rw.reports().end(function(err, response) {
      var parts = url.parse(response.body.links.next.href, true);
      parts.query.offset.should.equal('10');
      done();
    });
  })

  it('persists the overridden limit in the pager link', function(done) {
    rw.reports().limit(7).end(function(err, response) {
      response.body.links.next.should.have.property('href');
      var parts = url.parse(response.body.links.next.href, true);
      parts.query.limit.should.equal('7');
      done();
    });
  })

  it('persists the overridden offset in the pager link', function(done) {
    rw.reports().offset(10).end(function(err, response) {
      var parts = url.parse(response.body.links.next.href, true);
      parts.query.offset.should.equal('20');
      done();
    });
  })

  it('persists the preset in the pager link', function(done) {
    rw.reports().preset('analysis').end(function(err, response) {
      response.body.links.next.should.have.property('href');
      var parts = url.parse(response.body.links.next.href, true);
      parts.query.preset.should.equal('analysis');
      done();
    });
  })
};