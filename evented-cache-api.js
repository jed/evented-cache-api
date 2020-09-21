export class CacheStorage extends EventTarget {
  constructor(caches) {
    super()

    this.caches = caches
  }

  async match(request, options) {
    return this.caches.match(request, options)
  }

  async has(name) {
    return this.caches.has(name)
  }

  async open(name) {
    let exists = await this.has(name)
    let cache = new Cache(await this.caches.open(name))

    if (!exists) {
      let detail = {name, cache}
      let event = new CustomEvent('cache', {detail})
      this.dispatchEvent(event)
    }

    return cache
  }

  async delete(name) {
    let deleted = await this.caches.delete(name)

    if (deleted) {
      let detail = {name, cache: null}
      let event = new CustomEvent('cache', {detail})
      this.dispatchEvent(event)
    }

    return deleted
  }

  async keys() {
    return this.caches.keys()
  }
}

export class Cache extends EventTarget {
  constructor(cache) {
    super()

    this.cache = cache
  }

  async add(request) {
    let response = await fetch(request)
    if (response.ok) return this.put(request, response)
    throw new TypeError(response.statusText)
  }

  async addAll(requests) {
    let addAll = requests.map(request => this.add(request))
    await Promise.all(addAll)
  }

  async delete(request, options) {
    let found = await this.cache.delete(request, options)

    if (found) {
      let detail = {request, response: null}
      let event = new CustomEvent('response', {detail})
      this.dispatchEvent(event)
    }

    return found
  }

  async keys(request, options) {
    return this.cache.keys(request, options)
  }

  async match(request, options) {
    return this.cache.match(request, options)
  }

  async matchAll(request, options) {
    return this.cache.matchAll(request, options)
  }

  async put(request, response) {
    await this.cache.put(request, response)

    let detail = {request, response}
    let event = new CustomEvent('response', {detail})
    this.dispatchEvent(event)
  }
}

export const caches = new CacheStorage(window.caches)
