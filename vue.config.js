// Build date
let today = new Date().toLocaleDateString(undefined, {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
})
process.env.VUE_APP_BUILD_DATE = today

process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
