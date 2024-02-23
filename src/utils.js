import pluginConfig from './config'

/**
 * Console log depending on config debug mode
 * @param {...*} message
 */
export const logDebug = function (message) {
  if (pluginConfig.debug) {
    console.log('VueGtm :', ...arguments)
  }
}

/**
 * Load GTM script tag
 * @param {String}  id  GTM ID
 * @param {String}  elementId  script tag id attribute
 * @param {String}  nonce  Nonce
 */
export const loadScript = function (id, elementId, nonce) {
  const win    = window,
        doc    = document,
        script = doc.createElement('script'),
        dl     = 'dataLayer'

  win[dl] = win[dl] || []

  win[dl].push({
    event      :'gtm.js',
    'gtm.start': new Date().getTime(),
  })

  if (!id) {
    return
  }

  script.async = true;
  script.src   = `https://www.googletagmanager.com/gtm.js?id=${id}`

  if (elementId) {
    script.id = elementId
  }

  if (nonce) {
    script.setAttribute('nonce', nonce);
  }

  doc.body.appendChild(script)
}

/**
 * Check if GTM script is in the document
 * @return {boolean}
 */
export const hasScript = function () {
  return Array
    .from(document.getElementsByName('script'))
    .some(script => script.src.includes('googletagmanager'))
}
