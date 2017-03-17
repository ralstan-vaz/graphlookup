let expect = require("chai").expect;
let assert = require("chai").assert;

if (!global.Promise) {
  global.Promise = Promise;
}
let chai = require('chai');
let debug = require("debug")("graphlookup:test");
let lu = require("../");


var lookupDoc = [{
  "name": "Admin",
  "user_name": "admin",
}, {
  "name": "Beatus F",
  "user_name": "beatus",
  "managerId": "yash",
}, {
  "name": "Yash S",
  "user_name": "yash",
  "managerId": "admin"
}, {
  "name": "Rohil V",
  "user_name": "rohil",
  "managerId": "admin"
}, {
  "name": "Chetna B",
  "user_name": "chetna",
  "managerId": "rohil"
}, {
  "name": "Saby M",
  "user_name": "saby",
  "managerId": "beatus"
}]

describe('lookup', function() {
  var src = {
    "user_name": "saby",
    "managerId": "beatus"
  }

  it("should honor the as parameter", function() {
    var connectFrom = "managerId";
    var connectTo = "user_name";
    var as = "hierarchy";
    var maxDepth = 2;

    let obj = lu.lookup(src, lookupDoc, connectFrom, connectTo, as, maxDepth);
    assert.property(obj, as)
  })

  it("should retrive the immediate lookup", function() {
    var connectFrom = "managerId";
    var connectTo = "user_name";
    var as = "hierarchy";
    var maxDepth = 3;

    let obj = lu.lookup(src, lookupDoc, connectFrom, connectTo, as, maxDepth);
    debug(JSON.stringify(obj));
    assert.equal(obj.hierarchy[0].user_name, "beatus");
    assert.equal(obj.hierarchy[1].user_name, "yash");
    assert.equal(obj.hierarchy[2].user_name, "admin");
  })

  it("should honor maxDepth", function() {
    var connectFrom = "managerId";
    var connectTo = "user_name";
    var as = "hierarchy";
    var maxDepth = 2;

    let obj = lu.lookup(src, lookupDoc, connectFrom, connectTo, as, maxDepth);
    assert.equal(obj.hierarchy.length, 2)
  })

  it("should not return any lookup if not found", function() {
    var connectFrom = "managersId";
    var connectTo = "user_name";
    var as = "hierarchy";
    var maxDepth = 2;

    let obj = lu.lookup(src, lookupDoc, connectFrom, connectTo, as, maxDepth);
    assert.equal(obj.hierarchy.length, 0)
  })
})

describe('graph lookup', function() {
  var src = [{
    "user_name": "chetna",
    "managerId": "rohil"
  }, {
    "user_name": "saby",
    "managerId": "beatus"
  }]

  it("should return lookups for multiple values", function() {
    var connectFrom = "managerId";
    var connectTo = "user_name";
    var as = "hierarchy";
    var maxDepth = 3;

    let obj = lu.graphLookup(src, lookupDoc, connectFrom, connectTo, as, maxDepth);
    debug(JSON.stringify(obj));
    assert.equal(obj.length, 2)
    assert.equal(obj[0].hierarchy[0].user_name, "rohil")
    assert.equal(obj[0].hierarchy[1].user_name, "admin")
    assert.equal(obj[1].hierarchy[0].user_name, "beatus")
    assert.equal(obj[1].hierarchy[1].user_name, "yash")
    assert.equal(obj[1].hierarchy[2].user_name, "admin")
  })
})