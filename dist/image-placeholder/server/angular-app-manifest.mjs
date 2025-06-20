
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
    'index.csr.html': {size: 6036, hash: 'bbca335fe6d91c80f1228242b8b152d1f00195365dab42c19b15529407467644', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1013, hash: '555fc00ee4ccaa20ebb31cac12c31499b4f26f6375081170850b350437ce9b7d', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 21588, hash: 'de9733d376dd747eabc640fdce8540ee3bb9b1466fbc6d88a50667d05f3794ea', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-IYSUJ4WY.css': {size: 16379, hash: '59rkLmDL8y4', text: () => import('./assets-chunks/styles-IYSUJ4WY_css.mjs').then(m => m.default)}
  },
};
