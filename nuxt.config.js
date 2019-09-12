require('dotenv').config()
;['PUBLIC_PATH', 'API_SERVER', 'COOKIE_PATH', 'NO_LOGIN'].forEach(key =>
  console.log('%s\t: %s', key, process.env[key])
)

const env = process.env
const isProd = env.MODE == 'prod'
const mockServer = 'http://39.98.50.163:3000/mock/1399/'
// 'https://easy-mock.com/mock/5c1b3895fe5907404e654045/femessage-mock'

// 不能以斜杠结尾
let apiServer = process.env.API_SERVER || '/'

const appJson = require('./app.json')
const ossPath = `http://serverless-platform.deepexi.top/applications/${appJson.appKey}`

const publicPath = process.env.BUILD_TYPE === 'production' ? ossPath : '/_nuxt/'

const config = {
  aliIconFont: '',
  env: {
    mock: {
      '/test': mockServer,
      '/deepexi-tenant': mockServer,
      '/deepexi-permission': mockServer
    },
    dev: {
      '/deepexi-tenant': apiServer,
      '/deepexi-permission': apiServer
    }
  }
}

let axios = {
  proxy: true
}

// 如果生产指定apiServer, 则使用绝对路径请求api
if (isProd && apiServer) {
  axios = {
    proxy: false,
    baseURL: apiServer
  }
}

module.exports = {
  srcDir: 'src/',
  mode: 'spa',
  env: {
    NO_LOGIN: process.env.NO_LOGIN,
    COOKIE_PATH: process.env.COOKIE_PATH || '/'
  },
  proxy: config.env[env.MODE],
  router: {
    middleware: ['meta', 'breadcrumb'],
    mode: 'hash'
  },
  /*
   ** Build configuration
   */

  build: {
    publicPath,
    extractCSS: true,
    babel: {
      plugins: [
        [
          'component',
          {
            libraryName: 'element-ui',
            styleLibraryName: '~node_modules/@femessage/theme-deepexi/lib'
          }
        ]
      ]
    },
    /*
     ** Run ESLint on save
     */
    extend(config, {isDev}) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  /*
   ** Headers of the page
   */
  head: {
    title: 'dashboard',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {'http-equiv': 'x-ua-compatible', content: 'IE=edge, chrome=1'},
      {
        hid: 'description',
        name: 'description',
        content: ''
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href:
          'https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/favicon32x32.png'
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '//at.alicdn.com/t/font_1261976_pwsuu09jfo.css'
      }
    ]
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#5D81F9'
  },
  /**
   * Share variables, mixins, functions across all style files (no @import needed)
   * @Link https://github.com/nuxt-community/style-resources-module/
   */
  styleResources: {
    less: '~assets/var.less'
  },
  css: [
    {
      src: '~assets/global.less',
      lang: 'less'
    },
    {
      src: '~assets/router.css'
    },
    {
      src: './node_modules/element-ui/lib/theme-chalk/icon.css'
    }
  ],
  plugins: [
    {
      src: '~/plugins/axios'
    },
    {
      src: '~/plugins/element'
    },
    {
      src: '~/plugins/skeleton'
    },
    {
      src: '~/plugins/component'
    }
  ],
  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/axios',
    ['@nuxtjs/dotenv', {path: './'}]
  ],
  axios
}
