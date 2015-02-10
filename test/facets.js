exports.shouldBehaveAsExpected = function(reliefweb, config, resources, items) {
  var rw;
  before(function() {
    rw = reliefweb.client({
      'host': config.api.host
    });
  });

  it('should allow lists to be faceted.', function(done) {
    var params = { facets: [
      {
        field: "status"
      }
    ]}

    rw.method('POST').reports().send(params).end(function(err, response) {
      response.status.should.equal(200);
      response.body.embedded.facets.should.have.property('status');
      response.body.embedded.facets.status.should.have.property('data');
      response.body.embedded.facets.status.data[0].should.have.keys('count', 'value');
      done();
    });
  });
  it('should allow multiple facets to be used in a list.', function(done) {
    var params = { facets: [
      {
        field: "status"
      },
      {
        field: "date.created"
      }
    ]}
    rw.method('POST').reports().send(params).end(function(err, response) {
      response.status.should.equal(200);
      response.body.embedded.facets.should.have.keys('status', 'date.created');
      done();
    });
  });
  it('should allow you to change the name of a facet with the name property.', function(done) {
    var params = { facets: [
      {
        field: "status",
        name: "workflow"
      }
    ]}
    rw.method('POST').reports().send(params).end(function(err, response) {
      response.status.should.equal(200);
      response.body.embedded.facets.should.have.property('workflow');
      done();
    });
  });
  it('should name facets based on field property in the API request (not the forwarded ElasticSearch parameter)', function(done) {
    var params = { facets: [
      {
        field: "date"
      },
      {
        field: "source"
      }
    ]}
    rw.method('POST').reports().send(params).end(function(err, response) {
      // Date is a container field converted to date.created.
      // Source is a container field converted to source.name.exact.
      response.body.embedded.facets.should.have.keys('date', 'source');
      done();
    });
  })
  it('should respect the limit property for any given term facet', function(done) {
    var params = { facets: [
      {
        field: "status",
        limit: 2
      }
    ]}
    rw.method('POST').reports().send(params).end(function(err, response) {
      response.status.should.equal(200);
      response.body.embedded.facets.status.data.length.should.be.equal(2);
      done();
    });
  })
  it('should deny the limit property for any given date facet', function(done) {
    var params = { facets: [
      {
        field: "date",
        limit: 2
      }
    ]}
    rw.method('POST').reports().send(params).end(function(err, response) {
      response.status.should.equal(400);
      done();
    });
  })
  it('should require the "field" property in all facet requests', function(done) {
    var params = { facets: [
      {
        limit: 2
      }
    ]}
    rw.method('POST').reports().send(params).end(function(err, response) {
      response.status.should.equal(400);
      done();
    });
  })
  it('should have the "date" type for all date fields', function(done) {
    var params = { facets: [
      {
        field: 'date'
      },
      {
        field: 'source'
      }
    ]}
    rw.method('POST').reports().send(params).end(function(err, response) {
      response.body.embedded.facets.date.type.should.be.equal('date');
      response.body.embedded.facets.source.type.should.be.equal('term');
      done();
    });
  })
  it('should allow the interval property for all date facets', function(done) {
    var params = { facets: [
      {
        field: 'date',
        interval: 'day'
      }
    ]}
    // Switched to disasters as dramatically reduced content speeds up the test.
    // This means it can more consistently complete in under 2 seconds on untuned
    // infrastructure.
    rw.method('POST').disasters().send(params).end(function(err, response) {
      response.status.should.equal(200);
      done();
    });
  })
  it('should block the interval property for all term facets', function(done) {
    var params = { facets: [
      {
        field: 'source',
        interval: 'day'
      }
    ]}
    rw.method('POST').reports().send(params).end(function(err, response) {
      response.status.should.equal(400);
      done();
    });
  })
  // @todo sort will be allowed for date facets in API v1.2+.
  it('should allow the sort property on date facets', function(done) {
    var params = { facets: [
      {
        field: 'date',
        sort: 'count'
      }
    ]}
    rw.method('POST').reports().send(params).end(function(err, response) {
      response.status.should.equal(200);
      done();
    });
  })
  it('should allow the sort property on term facets', function(done) {
    var params = { facets: [
      {
        field: 'status',
        sort: 'count'
      }
    ]}
    rw.method('POST').reports().send(params).end(function(err, response) {
      response.status.should.equal(200);
      done();
    });
  })
  it('should allow the sort property to use count and value for ordering', function(done) {
    var params = { facets: [
      {
        field: 'status',
        sort: 'count'
      },
      {
        field: 'status',
        name: 'status2',
        sort: 'value'
      }
    ]}
    rw.method('POST').reports().send(params).end(function(err, response) {
      response.status.should.equal(200);
      done();
    });
  })
  it('should not allow the sort property to use ordering other than count and value', function(done) {
    var params = { facets: [
      {
        field: 'status',
        sort: 'sequence'
      }
    ]}
    rw.method('POST').reports().send(params).end(function(err, response) {
      response.status.should.equal(400);
      done();
    });
  })
  it('should allow the sort property to use direction asc and desc', function(done) {
    var params = { facets: [
      {
        field: 'status',
        sort: 'count:asc'
      },
      {
        field: 'status',
        name: 'status2',
        sort: 'count:desc'
      }
    ]}
    rw.method('POST').reports().send(params).end(function(err, response) {
      response.status.should.equal(200);
      done();
    });
  })
  it('should not allow the sort property to use direction other than asc and desc', function(done) {
    var params = { facets: [
      {
        field: 'status',
        sort: 'count:number'
      },
      {
        field: 'status',
        name: 'status2',
        sort: 'count:alpha'
      }
    ]}
    rw.method('POST').reports().send(params).end(function(err, response) {
      response.status.should.equal(400);
      done();
    });
  })
  it('should use desc as the default direction for count ordering', function(done) {
    var params = { facets: [
      {
        field: 'status',
        sort: 'count',
        limit: 20
      },
      {
        field: 'status',
        name: 'status2',
        sort: 'count:desc',
        limit: 20
      }
    ]}
    rw.method('POST').reports().send(params).end(function(err, response) {
      var simple = response.body.embedded.facets;
      JSON.stringify(simple.status.data).should.equal(JSON.stringify(simple.status2.data));
      done();
    });
  })
  it('should use asc as the default direction for value ordering', function(done) {
    var params = { facets: [
      {
        field: 'status',
        sort: 'value',
        limit: 20
      },
      {
        field: 'status',
        name: 'status2',
        sort: 'value:asc',
        limit: 20
      }
    ]}
    rw.method('POST').reports().send(params).end(function(err, response) {
      var simple = response.body.embedded.facets;
      JSON.stringify(simple.status.data).should.equal(JSON.stringify(simple.status2.data));
      done();
    });
  })
  it('should have more equal to true when more facets are available', function(done) {
    var params = { facets: [
      {
        field: 'country',
        sort: 'value',
        limit: 1
      }
    ]}
    rw.method('POST').reports().send(params).end(function(err, response) {
      response.status.should.equal(200);
      response.body.embedded.facets.country.more.should.be.equal(true);
      done();
    });
  })
  it('should have more equal to false when all facet items have been returned', function(done) {
    var params = { facets: [
      {
        field: 'status',
        sort: 'value',
        limit: 100
      }
    ]}
    rw.method('POST').reports().send(params).end(function(err, response) {
      response.status.should.equal(200);
      response.body.embedded.facets.status.more.should.be.equal(false);
      done();
    });
  })
  it('should have same results when using facetsOn and exact.', function(done) {
    var params = { facets: [
      {
        field: 'country',
        name: 'country1'
      },
      {
        field: 'country.name',
        name: 'country2'
      },
      {
        field: 'country.name.exact',
        name: 'country3'
      }
    ]}
    rw.method('POST').reports().send(params).end(function(err, response) {
      response.status.should.equal(200);
      response.body.embedded.facets.country1.data.should.eql(response.body.embedded.facets.country2.data);
      response.body.embedded.facets.country1.data.should.eql(response.body.embedded.facets.country3.data);
      done();
    });
  })
  it('should be affected by search query and global filter when scope = default', function(done) {
    var params = {
      query: {
        value: 'Earthquake'
      },
      filter: {
        field: 'type.name.exact',
        value: 'Flood'
      },
      facets: [
      {
        field: 'type',
        limit: 30,
        scope: 'default'
      }
    ]}
    rw.method('POST').disasters().send(params).end(function(err, response) {
      response.status.should.equal(200);
      response.body.embedded.facets.type.data[0].count.should.equal(response.body.totalCount);
      done();
    });
  })
  it('should only be affected by search query when scope = query', function(done) {
    var params = {
      query: {
        value: 'Earthquake'
      },
      filter: {
        field: 'type.name.exact',
        value: 'Flood'
      },
      facets: [
      {
        field: 'type',
        limit: 30,
        scope: 'query'
      }
    ]}
    rw.method('POST').disasters().send(params).end(function(err, response) {
      response.status.should.equal(200);
      response.body.embedded.facets.type.data[0].value.should.equal('Earthquake');
      response.body.embedded.facets.type.data[0].count.should.be.above(response.body.totalCount);
      done();
    });
  })
  it('should not be affected by search query or global filter when scope = global', function(done) {
    var params = {
      query: {
        value: 'Earthquake'
      },
      filter: {
        field: 'type.name.exact',
        value: 'Flood'
      },
      facets: [
      {
        field: 'type',
        limit: 30,
        scope: 'global'
      }
    ]}
    rw.method('POST').disasters().send(params).end(function(err, response) {
      response.status.should.equal(200);
      response.body.embedded.facets.type.data[0].value.should.equal('Flood');
      response.body.embedded.facets.type.data[0].count.should.be.above(response.body.totalCount);
      response.body.embedded.facets.type.data.length.should.be.above(20);
      done();
    });
  })
  it('should return less result for filtered facets', function(done) {
    var params = {
      query: {
        value: 'Earthquake'
      },
      facets: [
      {
        field: 'type',
        name: 'type1',
        limit: 1
      },
      {
        field: 'type',
        name: 'type2',
        limit: 1,
        filter: {
          field: 'country.name.exact',
          value: 'China'
        }
      }
    ]}
    rw.method('POST').disasters().send(params).end(function(err, response) {
      response.status.should.equal(200);
      response.body.embedded.facets.type1.data[0].count.should.be.above(response.body.embedded.facets.type2.data[0].count);
      done();
    });
  })

};
