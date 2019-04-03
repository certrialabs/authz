'use strict'

require('harmony-reflect')

const SCOPE_OPTION_TYPE = 'scope'
const AUTHORIZE_OPTION_TYPE = 'authorize'

let options = {}

let initContext = (res) => {
  res['authz'] = res['authz'] || {}
}

let skipScoping = (res, data) => {
  initContext(res)
  res['authz']['skipScoping'] = true

  return new Promise((resolve) => resolve(data))
}

let skipAuthorization = (res, data) => {
  initContext(res)
  res['authz']['skipAuthorization'] = true

  return new Promise((resolve) => resolve(data))
}

let scope = (res, user, model, policy) => {
  initContext(res)
  res['authz']['scoped'] = true
  if (res['authz']['fullscope']) {
    return new Promise(resolve => resolve(model))
  } else {
    // eslint-disable-next-line new-cap
    return new policy['scope'](user, model).resolve()
  }
}

let authorized = (res, user, model, action, policy) => {
  initContext(res)
  res['authz']['authorized'] = true

  try {
    if (res['authz']['fullaccess']) {
      return new Promise((resolve) => resolve(model))
    } else {
      // eslint-disable-next-line new-cap
      return new policy['actions'](user, model)[action]()
        .then((allowed) => {
          return new Promise((resolve, reject) => {
            if (allowed) {
              resolve(model)
            } else {
              // eslint-disable-next-line prefer-promise-reject-errors
              reject(false)
            }
          })
        })
    }
  } catch (e) {
    console.log(e.stack)
    // eslint-disable-next-line prefer-promise-reject-errors
    return new Promise((resolve, reject) => reject(false))
  }
}

let grantFullAccess = (res) => {
  initContext(res)
  // If you grant fullaccess and fullscope you don't have to use req.user any more.
  res['authz']['fullaccess'] = true
  res['authz']['fullscope'] = true

  return new Promise((resolve) => resolve(true))
}

let doCheckActionRequired = (options, key) => {
  let included = options && options.included ? options.included : null
  let excluded = options && options.excluded ? options.excluded : null

  if (!included && !excluded) {
    return true
  }

  if (included && included.includes(key)) {
    return true
  }

  if (excluded && !excluded.includes(key)) {
    return true
  }

  return false
}

let doCheckScoped = (res, options, key) => {
  if (res['authz']['scopeVerificationRequired'] && doCheckActionRequired(options, key)) {
    if (!res['authz']['scoped'] === true && !res['authz']['skipScoping'] === true) {
      throw new Error('Please call policy scope before modifying the result')
    }
  }
}

let doCheckAuthorized = (res, options, key) => {
  if (res['authz']['authzVerificationRequired'] && doCheckActionRequired(options, key)) {
    if (!res['authz']['authorized'] && !res['authz']['skipAuthorization'] === true) {
      throw new Error('Please call policy authorized before modifying the result')
    }
  }
}

let initProxy = (res, o, type) => {
  if (o) {
    let included = o && o.included ? o.included : null
    let excluded = o && o.excluded ? o.excluded : null

    if (included && excluded) {
      throw new Error("Cloudn't set both included and excluded")
    }
    options[type] = o
  }
  if (!res['authz']['proxied']) {
    res['authz']['proxied'] = true
    Object.setPrototypeOf(res, new Proxy(Object.getPrototypeOf(res), {
      get: (target, key) => {
        doCheckScoped(res, options[SCOPE_OPTION_TYPE], key)
        doCheckAuthorized(res, options[AUTHORIZE_OPTION_TYPE], key)
        return target[key]
      }
    }))
  }
}

module.exports = {
  middlewares: {
    verifyScoped: (options) => {
      return (req, res, next) => {
        initContext(res)
        initProxy(res, options, SCOPE_OPTION_TYPE)

        res['authz']['scoped'] = false
        res['authz']['skipScoping'] = false
        res['authz']['scopeVerificationRequired'] = true

        next()
      }
    },
    verifyAuthorized: (options) => {
      return (req, res, next) => {
        initContext(res)
        initProxy(res, options, AUTHORIZE_OPTION_TYPE)

        res['authz']['authorized'] = false
        res['authz']['skipAuthorization'] = false
        res['authz']['authzVerificationRequired'] = true

        next()
      }
    },
    skipAuthorization: () => {
      return (req, res, next) => {
        skipAuthorization(res, null).then(() => next())
      }
    },
    skipScoping: () => {
      return (req, res, next) => {
        skipScoping(res, null).then(() => next())
      }
    },
    grantFullAccess: () => {
      return (req, res, next) => {
        grantFullAccess(res).then(() => next())
      }
    }
  },
  helpers: {
    scope: scope,
    authorized: authorized,
    skipAuthorization: skipAuthorization,
    skipScoping: skipScoping,
    grantFullAccess: grantFullAccess
  }
}
