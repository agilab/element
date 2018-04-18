import Popup from './src/main';

/* istanbul ignore next */
Popup.install = function(Vue) {
  Vue.component('el-popup', Popup);
};

export default Popup;
