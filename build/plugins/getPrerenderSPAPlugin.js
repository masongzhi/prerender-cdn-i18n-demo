const prerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = prerenderSPAPlugin.PuppeteerRenderer;
const path = require('path');
const chalk = require('chalk');

const langs = ['cn', 'en'];

const CDN_PATH = process.env.CDN_PATH;
const routes = ['/', '/about', '/contact']

let TOTAL = 0;
let COUNT = 0;

/**
 * 获取prerenderSPAPlugin
 * @param webpackConfig
 * @returns {Array}
 */
module.exports = webpackConfig => {
  const result = [];
  // const entryNames = ['index'];
  const ASSETS_ROOT = webpackConfig.output.path;

  TOTAL = (langs.length || 1) * (routes.length || 1);

  langs.forEach(lang => {
    pushResult(lang);
  });

  function pushResult(lang) {
    const renderConfig = {
      injectProperty: '__PRERENDER_INJECTED__',
      inject: {
        isPrerender: true,
        // 多语言输出
        lang: lang
      },
      headless: true,
      renderAfterDocumentEvent: 'render-event'
    };

    result.push(
      new prerenderSPAPlugin({
        staticDir: ASSETS_ROOT,
        indexPath: path.join(ASSETS_ROOT, 'index.html'),
        routes: routes,
        postProcess(renderedRoute) {
          // Ignore any redirects.
          renderedRoute.route = renderedRoute.originalRoute;
          // 若是首页就打包成相应的html文件
          if (renderedRoute.route === '/') {
            const fileName = lang ? `${lang}.html` : `index.html`;
            renderedRoute.outputPath = path.join(ASSETS_ROOT, fileName);
          } else {
            const fileName = lang
              ? `${renderedRoute.route}.${lang}.html`
              : `${renderedRoute.route}.html`;
            renderedRoute.outputPath = path.join(ASSETS_ROOT, renderedRoute.route, fileName);
          }

          COUNT++;
          console.log(chalk.cyan(`  build prerender progress... ${COUNT}/${TOTAL} ` + chalk.blue(renderedRoute.outputPath + '\n')));

          // add CDN
          renderedRoute.html = renderedRoute.html
            // 客户端激活 (client-side hydration)
            // https://ssr.vuejs.org/zh/guide/hydration.html#%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%BF%80%E6%B4%BB-client-side-hydration
            // todo 会导致svga渲染俩次且移位
            // .replace('id="app"', 'id="app" data-server-rendered="true"')
            .replace(
              /(<script[^<>]*src=\")((?!http|https|\/\/)[^<>\"]*)(\"[^<>]*>[^<>]*<\/script>)/gi,
              `$1${CDN_PATH}$2$3`
            )
            .replace(
              /(<link[^<>]*href=\")((?!http|https|\/\/)[^<>\"]*)(\"[^<>]*>)/gi,
              `$1${CDN_PATH}$2$3`
            )
            .replace(
              /(<[source|video|img][^<>]*src=\")((?!http|https|data:image)[^<>\"]*)(\"[^<>]*>)/gi,
              `$1${CDN_PATH}$2$3`
            );

          return renderedRoute;
        },
        renderer: new Renderer(renderConfig)
      })
    );
  }

  return result;
};
