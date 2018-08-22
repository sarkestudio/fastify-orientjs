const fp = require("fastify-plugin");
const ODatabase = require("orientjs").ODatabase;

function errorPropertyMissing(name) {
  return new Error("OrientDB: missing property '" + name + "'");
}

function orientdbPlugin(fastify, opts, next) {
  if (!opts.host) return next(errorPropertyMissing("host"));
  if (!opts.name) return next(errorPropertyMissing("name"));

  let db = new ODatabase(opts);

  db.open()
    .then(function() {
      fastify.decorate("orient", db).addHook("onClose", close);

      next();
    })
    .catch(next);
}

function close(fastify, done) {
  fastify.orientdb.close().finally(done);
}

module.exports = fp(orientdbPlugin, {
  name: "fastify-orientjs"
});
