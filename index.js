var debug = require("debug")("graphLookup");

function lookup(src, lookupDoc, connectFrom, connectTo, as, maxDepth) {
  let connectFromVal = src[connectFrom];
  src[as] = [];
  var doc;
  var match;

  for (var i = 0; i < lookupDoc.length; i++) {
    doc = lookupDoc[i];
    match = connectFromVal === doc[connectTo];

    debug("iteration: ", i);
    debug("from:", connectFromVal, "to:", doc[connectTo]);

    debug("condition", match);
    if (match) {
      // Push the documet to the source
      src[as].push(doc);

      debug("current length:", src[as].length, "maxDepth:", maxDepth);
      // Check for max depth
      if (src[as].length >= maxDepth) {
        break;
      }
      // Change the connect from to matched document
      connectFromVal = doc[connectFrom];

      // check if connectFromVal exist
      if (connectFromVal === undefined) {
        break;
      }

      i = -1
    }
  }
  return src
}

function graphLookup(src, lookupDoc, connectFrom, connectTo, as, maxDepth) {
  var obj = [];
  for (var i = 0; i < src.length; i++) {
    obj.push(lookup(src[i], lookupDoc, connectFrom, connectTo, as, maxDepth));
  }

  return obj
}

module.exports = {
  lookup: lookup,
  graphLookup: graphLookup
}
