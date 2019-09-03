/**
 * CDN
 */

const isPrerender = window.__PRERENDER_INJECTED__ && window.__PRERENDER_INJECTED__.isPrerender
__webpack_public_path__ = isPrerender ? '/' : process.env.CDN_PATH

if (process.env.NODE_ENV === 'development') {
  __webpack_public_path__ = '/'
}
