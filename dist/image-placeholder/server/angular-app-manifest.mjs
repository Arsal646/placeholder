
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 4655, hash: 'c2e821af4b3b76b6b8c291db90c230dd1ce70b2f60286a10f93caf985272f2db', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1013, hash: '1114bc2fe38c12527d39018ad266e11ae01690beee99b38ad9620bbf3761ac38', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 20133, hash: 'e7513fbea0b4eaf420d97a5a2c1fcbcdb103a9ff89abc75ca2022492737e6cf1', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-JF2R5OQN.css': {size: 14036, hash: '9KhSC7cHF88', text: () => import('./assets-chunks/styles-JF2R5OQN_css.mjs').then(m => m.default)}
  },
};
