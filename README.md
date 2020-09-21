# evented-cache-api

## Usage

This library is a drop-in wrapper around the browser's CacheStorage and Cache APIs, adding the following events:

- `cache`: dispatched to the caches object when a cache is added or removed. the `details` property of the dispatched `CustomEvent` contains two properties: `name` for the name of the cache, and `cache` for its value (`null` when deleted).
- `response`: dispatched to a cache when a response is updated. the `details` property of the dispatched `CustomEvent` contains two properties: `request` for the request updated, and `response` for its value (`null` when deleted).

```js
import {caches} from './evented-cache-api.js'

void async function() {
  // start with a clean slate
  await caches.delete('test')

  // listen for a cache event when the cache is created
  caches.addEventListener('cache', e => console.log(e.detail))

  // the following logs {name: 'test', cache: EventTarget}
  let cache = await caches.open('test')

  // listen for a response event when the response is created
  cache.addEventListener('response', e => console.log(e.detail))

  // the following logs {request: './hello.html', response: Response}
  await cache.put('hello.html', new Response('world'))

  // the following logs {request: './hello.html', response: null}
  await cache.delete('hello.html')
}()
```
