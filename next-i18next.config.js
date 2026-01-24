const path = require('path');

module.exports = {
  // https://www.i18next.com/overview/configuration-options#logging
  debug: false,
  i18n: {
    defaultLocale: 'vi',
    locales: ['en', 'vi'],
    localeDetection: false, // Tắt auto-detect, luôn dùng tiếng Việt
  },
  localePath: path.resolve('./public/locales'),
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
