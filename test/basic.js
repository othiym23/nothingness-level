var inherits = require('util').inherits
var join = require('path').join

var mkdirp = require('mkdirp')
var rimraf = require('rimraf')
var test = require('tap').test
var uuid = require('node-uuid').v4

var Adaptor = require('..').default

var testDBpath = join(__dirname, 'readme-example')
var testDBfile = join(testDBpath, 'test.leveldb')

var DAO = require('nothingness').default
function ThingerDAO (db) {
  DAO.call(this, db)
}
inherits(ThingerDAO, DAO)

ThingerDAO.prototype.generateID = function (pojo) {
  pojo[DAO.idSymbol] = uuid()
  return pojo[DAO.idSymbol]
}

test('setup', function (t) {
  setup()
  t.end()
})

test('simple example from the README', function (t) {
  var adaptor = new Adaptor(testDBfile)
  var dao = new ThingerDAO(adaptor)
  var thingy = {
    type: 'great band'
  }

  dao.save(thingy, function (err) {
    t.ifError(err, 'saving should have worked')

    dao.findAll(function (err, results) {
      t.ifError(err, 'fetching should have worked')

      t.deepEqual(
        results,
        [{ type: 'great band' }],
        'should only have one item, of type "great band"'
      )

      adaptor.closeDB(function (err) {
        t.ifErr(err, 'database closed OK')

        t.end()
      })
    })
  })
})

test('closing the database works', function (t) {
  setup()

  var dao = new ThingerDAO(new Adaptor(testDBfile))
  var thingy = {
    type: 'great band'
  }

  dao.save(thingy, function (err) {
    t.ifError(err, 'saving should have worked')

    dao.findAll(function (err, results) {
      t.ifError(err, 'fetching should have worked')

      t.deepEqual(
        results,
        [{ type: 'great band' }],
        'should only have one item, of type "great band"'
      )

      t.end()
    })
  })
})

test('cleanup', function (t) {
  cleanup()
  t.end()
})

function setup () {
  cleanup()
  mkdirp.sync(testDBpath)
}

function cleanup () {
  rimraf.sync(testDBpath)
}

