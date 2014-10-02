exports.shouldBehaveLikeAnEntity = function() {
  it('is available (HTTP 200)', function(done) {
    this.rw.get(this.resource, function(err, response) {
      response.status.should.equal(200);
      done();
    });
  });
  it('should cache lists of items for 2 seconds', function(done) {
    this.rw.get(this.resource, function(err, response) {
      response.headers['cache-control'].should.equal('public, max-age=2');
      done();
    });
  });
  it('will have individual items tested with a legitimate identifier', function() {
    this.id.should.be.an.instanceOf(Number);
  });
  it('can provide individual items' , function(done) {
    this.rw.get(this.resource + '/' + this.id, function(err, response) {
      response.status.should.equal(200);
      done();
    });
  });
  it('defaults lists to a sort order of id descending', function(done) {
    this.rw.get(this.resource, function(err, response) {
      response.status.should.equal(200);
      response.body.data[0].id.should.be.above(response.body.data[1].id);
      done();
    });
  });
  it('allows lists to be sorted', function(done) {
    this.rw.post(this.resource).sort('id', 'asc')
      .end(function(err, response) {
        response.status.should.equal(200);
        // The default sort order is id:desc
        response.body.data[0].id.should.be.below(response.body.data[1].id);
        done();
    });
  });
  it('does not allow individual items to be sorted', function(done) {
    this.rw.get(this.resource + '/' + this.id).query({ sort: ['id:asc'] })
      .end(function(err, response) {
        response.status.should.equal(400);
        done();
    });
  });
  it('allows lists to be queried', function(done) {
    this.rw.post(this.resource).search('rain').end(function(err, response) {
      response.status.should.equal(200);
      done();
    });
  });
  it('allows number of items in list to be controlled by a limit', function(done) {
    this.rw.get(this.resource).limit(3).end(function(err, response) {
      response.body.count.should.equal(3);
      done();
    });
  });
  it('provides a pager mechanism that cannot go back before the first item', function(done) {
    this.rw.get(this.resource, function(err, response) {
      response.body.links.should.not.have.property('prev');
      done();
    });
  });
  it('provides a pager mechanism that can page backwards if there are items', function(done) {
    this.rw.get(this.resource).offset(5).end(function(err, response) {
      response.body.links.should.have.property('prev');
      done();
    });
  });
  it('does not allow individual items to be queried', function(done) {
    this.rw.get(this.resource + '/' + this.id).query({ query: {value: 'rain'}})
      .end(function(err, response) {
        response.status.should.equal(400);
        done();
    });
  });
  it('allows lists to have fields specified', function(done) {
    var label = 'title';
    if (this.resource == 'countries' || this.resource == 'sources' || this.resource == 'disasters') {
      label = 'name';
    }
    this.rw.post(this.resource).fields(['id'], [label])
      .end(function(err, response) {
        response.status.should.equal(200);
        fields = Object.keys(response.body.data[0].fields)
        fields.length.should.equal(1);
        response.body.data[0].fields.should.have.property('id');
        done();
    });
  });
  it('allows individual items to have fields specified', function(done) {
    this.rw.get(this.resource + '/' + this.id).query({fields: {include: ['id']}})
      .end(function(err, response) {
        response.status.should.equal(200);
        fields = Object.keys(response.body.data[0].fields)
        fields.length.should.equal(1);
        response.body.data[0].fields.should.have.property('id');
        done();
    })
  });
  it('allows lists to be filtered via a single condition (using POST)', function(done) {
    var params = { filter: { field: 'id', value: this.id }};
    this.rw.post(this.resource).send(params).end(function(err, response) {
      response.status.should.equal(200);
      response.body.count.should.be.equal(1);
      done();
    });
  });
  it('should cache individual items for 5 minutes', function(done) {
    this.rw.get(this.resource + '/' + this.id, function(err, response) {
      response.headers['cache-control'].should.equal('public, max-age=300');
      done();
    });
  });
};
