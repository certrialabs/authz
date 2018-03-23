'use strict'

require('harmony-reflect')

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

let initProxy = (res) => {
  if (!res['authz']['proxied']) {
    res['authz']['proxied'] = true
    Object.setPrototypeOf(res, new Proxy(Object.getPrototypeOf(res), {
      get: (target, key) => {
        if (res['authz']['scopeVerificationRequired']) {
          if (!res['authz']['scoped'] === true && !res['authz']['skipScoping'] === true) {
            throw new Error('Please call policy scope before modifying the result')
          }
        }
        if (res['authz']['authzVerificationRequired']) {
          if (!res['authz']['authorized'] && !res['authz']['skipAuthorization'] === true) {
            throw new Error('Please call policy authorized before modifying the result')
          }
        }

        return target[key]
      }
    }))
  }
}

module.exports = {
  middlewares: {
    verifyScoped: () => {
      return (req, res, next) => {
        initContext(res)
        initProxy(res)

        res['authz']['scoped'] = false
        res['authz']['skipScoping'] = false
        res['authz']['scopeVerificationRequired'] = true

        next()
      }
    },
    verifyAuthorized: () => {
      return (req, res, next) => {
        initContext(res)
        initProxy(res)

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
