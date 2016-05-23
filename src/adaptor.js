import level from 'level'
import DAO from 'nothingness'

// the dumbest possible leveldb adaptor
export default class Adaptor {
  // need to be able to pass the idSymbol in cases where there could be two
  // instances of the DAO class floating around (i.e. when testing)
  constructor (path, idSymbol = DAO.idSymbol) {
    this.db = level(path, { valueEncoding: 'json' })
    this.idSymbol = idSymbol
  }

  save (key, value, cb) {
    this.db.put(key, value, cb)
  }

  findAll (cb) {
    var results = []
    var idSymbol = this.idSymbol
    this.db
      .createReadStream()
      .on('data', function (entry) {
        entry.value[idSymbol] = entry.key
        results.push(entry.value)
      })
      .on('end', function () { cb(null, results) })
      .on('error', cb)
  }

  closeDB (cb) {
    this.db.close(cb)
  }
}
