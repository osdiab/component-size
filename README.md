# `@rehooks/component-size`

## Install

```sh
yarn add @rehooks/component-size
```

## Usage

```js
import { useRef, useState } from 'react'
import useComponentSize from '@rehooks/component-size'

function MyComponent() {
  const [imgElem, setImageElem] = useState(null);
  // callback ref to ensure re-render when ref is set, as per React docs
  // https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  let ref = useCallback(elem => {
    if (elem !== null) {
      setImgElem(elem)
    }
  }, [])
  let size = useComponentSize(imgElem)
  // size == { width: 100, height: 200 }
  let { width, height } = size
  let imgUrl = `https://via.placeholder.com/${width}x${height}`

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <img ref={ref} src={imgUrl} />
    </div>
  )
}
```

## ResizeObserver

If it is present, this library uses the recent [`ResizeObserver` browser
API](https://developers.google.com/web/updates/2016/10/resizeobserver) to
determine if an element's content size has changed.

If a browser does not have the `ResizeObserver` API present, then this library
falls back to listening on window size changes, which is less efficient and does
not listen for changes to the component's size due to other factors like content
changes. If it is not present, you can use pass a `ResizeObserver`
implementation into the `useComponentSize()` hook (see below).

Browser support is pretty good in Chrome, but is still missing support in other
major browsers.

> [Can i use ResizeObserver?](https://caniuse.com/#feat=resizeobserver)

### Polyfill

You can import [a ResizeObserver
ponyfill](https://github.com/que-etc/resize-observer-polyfill) with this NPM
library:

```sh
yarn add resize-observer-polyfill
```

Then use it with the `useComponentSize()` hook:

```js
import ResizeObserver from 'resize-observer-polyfill'
// ...
useComponentSize(ref, { ResizeObserver });
```

If you are using Webpack (or similar) you could use [dynamic
imports](https://webpack.js.org/api/module-methods/#import), to load the
Polyfill only if needed. A basic implementation could look something like this:

```js
function getResizeObserver() {
  if (
    'ResizeObserver' in global &&
    'ResizeObserverEntry' in global &&
    'contentRect' in ResizeObserverEntry.prototype
  ) {
    return Promise.resolve(ResizeObserver);
  }
  return import('resize-observer-polyfill');
}
```

And in your component:
```js
const [ResizeObserverApi, setResizeObserverApi] = setState();
useEffect(() => {
  let cancelled = false;
  getResizeObserver().then(observer => {
    if (!cancelled) {
      setResizeObserverApi(observer);
    }
  });
  return () => {
    cancelled = true;
  }
}, []);
useComponentSize(ref, { ResizeObserver: ResizeObserverApi });
```
