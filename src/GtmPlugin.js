import { logDebug, loadScript, hasScript } from './utils'
import pluginConfig from './config'
/**
 * Plugin main class
 */
var inBrowser = typeof window !== 'undefined'

export default class AnalyticsPlugin {
  enabled() {
    return pluginConfig.enabled
  }

  enable(val) {
    pluginConfig.enabled = val

    if (inBrowser && !!val && !hasScript()) {
      loadScript(pluginConfig.id, pluginConfig.elementId, this.getNonce())
    }
  }

  debugEnabled() {
    return pluginConfig.debug
  }

  debug(val) {
    pluginConfig.debug = val
  }

  hasElementId() {
    return typeof pluginConfig.elementId === 'string'
  }

  getElementId() {
    return pluginConfig.elementId
  }

  hasNonceContainerAttributeSet() {
    return typeof pluginConfig.nonceContainerAttribute === 'string'
  }

  getNonceContainerAttribute() {
    return pluginConfig.nonceContainerAttribute
  }

  hasNonceContainerIdSet() {
    return typeof pluginConfig.nonceContainerId === 'string'
  }

  getNonceContainerId() {
    return pluginConfig.nonceContainerId
  }

  getNonce() {
    if (!this.hasNonceContainerIdSet() || !this.hasNonceContainerAttributeSet()) {
      return '';
    }

    const containerId = this.getNonceContainerId();
    let element = document.getElementById(containerId);

    if (!element) {
      return '';
    }

    return element.getAttribute(this.getNonceContainerAttribute());
  }

  trackView(screenName, path) {
    if (inBrowser && pluginConfig.enabled) {
      logDebug('Dispatching TrackView', { screenName, path })

      let dataLayer = (window.dataLayer = window.dataLayer || [])
      dataLayer.push({
        event: 'content-view',
        'content-name': path,
        'content-view-name': screenName
      })
    }
  }

  trackEvent({
    event = null,
    category = null,
    action = null,
    label = null,
    value = null,
    noninteraction = false,
    ...rest
  } = {}) {
    if (inBrowser && pluginConfig.enabled) {
      logDebug('Dispatching event', {
        event,
        category,
        action,
        label,
        value,
        ...rest
      })

      let dataLayer = (window.dataLayer = window.dataLayer || [])
      dataLayer.push({
        event: event || 'interaction',
        target: category,
        action: action,
        'target-properties': label,
        value: value,
        'interaction-type': noninteraction,
        ...rest
      })
    }
  }
}
