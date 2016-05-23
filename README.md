# @nothingness/level

Minimal / simplistic / incomplete / bad adaptor to connect level to [`nothingness`](http://npm.im/nothingness).

## install

```
npm install --save nothingness @nothingness/level
```

## usage

```javascript
var ThingerDAO = require('./thinger-dao.js');
var Adaptor = require('@nothingness/level');
var assert = require('assert');

var dao = new ThingerDAO(new Adaptor('./thinger-db'));
var thingy = { type: 'great band' };

// uses Bluebird's .nodeify(), so callback or promise chain are fine
dao.save(thingy, function (err) {
  if (err) throw err;

  dao.findAll(function (err, results) {
    if (err) throw err;

    assert.deepEqual(
      results,
      [{ type: 'great band' }],
      'should only have one item, of type "great band"'
    );

    console.log('round trip succeeded!');
  });
});
```

## API

### new Adaptor(pathToLevelDB)

Connect the Adaptor to a LevelDB data directory; assumes that all values will be encoded as JSON.

### save(key, value, cb)

Maps to the `put` function for `levelup`; assumes that key generation and object preparation is handled elsewhere.

### findAll(cb)

Load all of the values in the collection. Override this unless you're only storing one type of value per LevelDB database.

### closeDB(cb)

Maps to the `close` function for `levelup`.

## caveats

This is pre-1.0.0 software, and I'm going to keep iterating on this and `nothingness` until I have the basic CRUD logic and simple finders worked out for both sides in a way that doesn't make me want to barf. Getting this done in a way that keeps the coupling level right is tricky.

It may take a little while given my other commitments, so don't be surprised if this doesn't go anywhere interesting for a while.
