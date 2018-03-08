/**
 * Dependencie(s)
 */

const query = require('array-compose')


/**
 * Expose promise handler as default.
 */

module.exports = driver => {
  const async = promise(driver)
  async.stream = stream(driver)
  return async
}


/**
 * Run cypher queries as promises.
 *
 * @param {Object} driver
 * @return {Function} tagged template
 * @api public
 */

function promise (driver) {
  return (chunks, data) => {
    const session = driver.session()
    const params = parameters(data)
    return session.writeTransaction(tx => tx.run(query(chunks, Object.keys(params)), params))
      .then(result => {
        session.close()
        return result
      }, err => console.error(err))
  }
}


/**
 * Transform template data into object.
 *
 * @param {Array} data
 * @return {Object}
 * @api private
 */

function parameters (data) {
  return data.reduce((result, item, index) => {
    result[index] = item
    return result
  }, {})
}
