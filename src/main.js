// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './public-path'
import Vue from 'vue'
import App from './App'
import router from './router'
import VueI18n from 'vue-i18n'

Vue.config.productionTip = false

Vue.use(VueI18n)

const messages = {
  en: {
    message: {
      hello: 'hello app world',
      title: 'I am title',
      description: 'I am description'
    }
  },
  cn: {
    message: {
      hello: '你好、app 世界',
      title: '我是标题',
      description: '我是描述'
    }
  }
}

const i18n = new VueI18n({
  locale: 'en', // set locale
  messages // set locale messages
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  created () {
    // prerender修改locale
    if (window.__PRERENDER_INJECTED__ && window.__PRERENDER_INJECTED__.lang) {
      i18n.locale = window.__PRERENDER_INJECTED__.lang
    }
  },
  mounted () {
    document.title = this.$t('message.title')
    const metaList = document.getElementsByTagName('meta')
    for (let i = 0; i < metaList.length; i += 1) {
      if (metaList[i].getAttribute('name') === 'description') {
        metaList[i].content = this.$t('message.description')
      }
    }
    document.dispatchEvent(new Event('render-event'))
  },
  render: h => h(App)
})
