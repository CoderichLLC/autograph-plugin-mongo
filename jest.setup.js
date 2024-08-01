global.ObjectId = require('mongodb').ObjectId;
const { setup } = require('@coderich/autograph-db-tests');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const MongoAdapter = require('./src/MongoAdapter');

/**
 * https://www.mongodb.com/docs/drivers/node/v3.6/compatibility/
 */
beforeAll(async () => {
  // Start mongo servers
  global.mongoServerCeil = await MongoMemoryReplSet.create({
    binary: { version: '7.0.11' },
    replSet: { storageEngine: 'wiredTiger' },
  });

  global.mongoServerFloor = await MongoMemoryReplSet.create({
    binary: { version: '3.2.16' },
    replSet: { storageEngine: 'wiredTiger' },
  });

  // Configure clients
  global.mongoClientCeil = new MongoAdapter({
    uri: global.mongoServerCeil.getUri(),
    options: { useNewUrlParser: true, useUnifiedTopology: true, ignoreUndefined: false, minPoolSize: 3 },
    query: { collation: { locale: 'en', strength: 2 }, readPreference: 'primary' },
    session: { retryWrites: true, readPreference: { mode: 'primary' }, readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' } },
    transaction: { readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' } },
  });

  global.mongoClientFloor = new MongoAdapter({
    uri: global.mongoServerFloor.getUri(),
    options: { useNewUrlParser: true, useUnifiedTopology: true, ignoreUndefined: false, minPoolSize: 3 },
    // query: { collation: { locale: 'en', strength: 2 }, readPreference: 'primary' },
    session: { retryWrites: true, readPreference: { mode: 'primary' }, readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' } },
    transaction: { readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' } },
  });

  // Autograph
  Object.assign(global, setup({
    generator: ({ value }) => {
      if (value instanceof global.ObjectId) return value;

      try {
        const id = new global.ObjectId(value);
        return id;
      } catch (e) {
        return value;
      }
    },
    dataSource: {
      supports: ['nada'],
      client: global.mongoClientFloor,
    },
  }));

  // Extend jest!
  expect.extend({
    thunk: (val, fn) => {
      const pass = Boolean(fn(val));
      return { pass };
    },
    multiplex: (val, ...expectations) => {
      try {
        expectations.flat().forEach((expectation) => {
          expectation(val);
        });
        return { pass: true };
      } catch ({ message }) {
        return { message, pass: false };
      }
    },
  });
});

afterAll(() => {
  return Promise.all([
    global.mongoClientCeil.disconnect(),
    global.mongoClientFloor.disconnect(),
    global.mongoServerCeil.stop(),
    global.mongoServerFloor.stop(),
  ]);
});
