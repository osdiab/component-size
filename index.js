'use strict'
var React = require('react')
var useState = React.useState
var useCallback = React.useCallback
var useLayoutEffect = React.useLayoutEffect

function getSize(el) {
  if (!el) {
    return {
      width: 0,
      height: 0
    }
  }

  var boundingRect = el.getBoundingClientRect();
  return {
    width: boundingRect.width,
    height: boundingRect.height,
  }
}

function useComponentSize(el, opts) {
  var ResizeObserverConstructor = opts && opts.ResizeObserver
    ? opts.ResizeObserver
    : typeof ResizeObserver === 'function'
      ? ResizeObserver
      : undefined;

  var _useState = useState(getSize(el))
  var ComponentSize = _useState[0]
  var setComponentSize = _useState[1]

  var handleResize = useCallback(
    function handleResize() {
      if (el) {
        setComponentSize(getSize(el))
      }
    },
    [el]
  )

  useLayoutEffect(
    function() {
      if (!el) {
        return;
      }

      handleResize()

      if (ResizeObserverConstructor) {
        var resizeObserver = new ResizeObserverConstructor(function() {
          handleResize()
        })
        resizeObserver.observe(el)

        return function() {
          resizeObserver.disconnect(el)
          resizeObserver = null
        }
      } else {
        window.addEventListener('resize', handleResize)

        return function() {
          window.removeEventListener('resize', handleResize)
        }
      }
    },
    [el, ResizeObserverConstructor]
  )

  return ComponentSize
}

module.exports = useComponentSize
