exports.shouldBehaveLikeAnEntity = function() {
  it('is available (HTTP 200)', function(done) {
    this.rw.get(this.resource, null, function(err, response) {
      response.status.should.equal(200);
      done();
    });
  })
  it('should cache lists of items for 2 seconds', function(done) {
    this.rw.get(this.resource, null, function(err, response) {
      response.headers['cache-control'].should.equal('public, max-age=2');
      done();
    });
  })
  it('will have individual items tested with a legitimate identifier', function() {
    this.id.should.be.an.instanceOf(Number);
  })
  it('can provide individual items' , function(done) {
    this.rw.get(this.resource, this.id, function(err, response) {
      response.status.should.equal(200);
      done();
    });
  })
  it('allows lists to be sorted', function(done) {
    this.rw.get(this.resource, 'sort[0]=id:desc', function(err, response) {
      response.status.should.equal(200);
      done();
    })
  })
  it('does not allow individual items to be sorted', function(done) {
    this.rw.get(this.resource + '/' + this.id, 'sort[0]=id:desc', function(err, response) {
      response.status.should.equal(400);
      done();
    });
  })
  it('allows lists to be queried', function(done) {
    this.rw.get(this.resource, 'query[value]=rain', function(err, response) {
      response.status.should.equal(200);
      done();
    })
  })
  it('allows number of items in list to be controlled by a limit', function(done) {
    this.rw.get(this.resource, 'limit=3', function(err, response) {
      response.body.count.should.equal(3);
      done();
    })
  })
  it('provides a pager mechanism that cannot go back before the first item', function(done) {
    this.rw.get(this.resource, null, function(err, response) {
      response.body.links.should.not.have.property('prev');
      done();
    })
  })
  it.only('provides a pager mechanism that can page backwards if there are items', function(done) {
    this.rw.get(this.resource, 'offset=5', function(err, response) {
      response.body.links.should.have.property('prev');
      done();
    })
  })
  it('does not allow individual items to be queried', function(done) {
    this.rw.get(this.resource + '/' + this.id, 'query[value]=rain', function(err, response) {
      response.status.should.equal(400);
      done();
    })
  })
  it('allows lists to have fields specified', function(done) {
    this.rw.get(this.resource, 'fields[include][]=id', function(err, response) {
      response.status.should.equal(200);
      done();
    })
  })
  it('allows individual items to have fields specified', function(done) {
    this.rw.get(this.resource + '/' + this.id, 'fields[include][]=id', function(err, response) {
      response.status.should.equal(200);
      done();
    })
  })
  it('should cache individual items for 5 minutes', function(done) {
    this.rw.get(this.resource, this.id, function(err, response) {
      response.headers['cache-control'].should.equal('public, max-age=300');
      done();
    });
  })
};
