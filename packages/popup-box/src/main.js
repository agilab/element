const defaults = {
  title: null,
  message: '',
  type: '',
  showInput: false,
  showClose: true,
  modalFade: true,
  lockScroll: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  closeOnHashChange: true,
  inputValue: null,
  inputPlaceholder: '',
  inputType: 'text',
  inputPattern: null,
  inputValidator: null,
  inputErrorMessage: '',
  showConfirmButton: true,
  showCancelButton: false,
  confirmButtonPosition: 'right',
  confirmButtonHighlight: false,
  cancelButtonHighlight: false,
  confirmButtonText: '',
  cancelButtonText: '',
  confirmButtonClass: '',
  cancelButtonClass: '',
  customClass: '',
  beforeClose: null,
  dangerouslyUseHTMLString: false,
  center: false,
  roundButton: false
};

import Vue from 'vue';
import popupboxVue from './main.vue';
import merge from 'element-ui/src/utils/merge';
import { isVNode } from 'element-ui/src/utils/vdom';

const PopupBoxConstructor = Vue.extend(popupboxVue);

let currentMsg, instance;
let msgQueue = [];

const defaultCallback = action => {
  if (currentMsg) {
    let callback = currentMsg.callback;
    if (typeof callback === 'function') {
      if (instance.showInput) {
        callback(instance.inputValue, action);
      } else {
        callback(action);
      }
    }
    if (currentMsg.resolve) {
      if (action === 'confirm') {
        if (instance.showInput) {
          currentMsg.resolve({ value: instance.inputValue, action });
        } else {
          currentMsg.resolve(action);
        }
      } else if (action === 'cancel' && currentMsg.reject) {
        currentMsg.reject(action);
      }
    }
  }
};

const initInstance = () => {
  instance = new PopupBoxConstructor({
    el: document.createElement('div')
  });

  instance.callback = defaultCallback;
};

const showNextMsg = () => {
  if (!instance) {
    initInstance();
  }
  instance.action = '';

  if (!instance.visible || instance.closeTimer) {
    if (msgQueue.length > 0) {
      currentMsg = msgQueue.shift();

      let options = currentMsg.options;
      for (let prop in options) {
        if (options.hasOwnProperty(prop)) {
          instance[prop] = options[prop];
        }
      }
      if (options.callback === undefined) {
        instance.callback = defaultCallback;
      }

      let oldCb = instance.callback;
      instance.callback = (action, instance) => {
        oldCb(action, instance);
        showNextMsg();
      };
      if (isVNode(instance.message)) {
        instance.$slots.default = [instance.message];
        instance.message = null;
      } else {
        delete instance.$slots.default;
      }
      ['modal', 'showClose', 'closeOnClickModal', 'closeOnPressEscape', 'closeOnHashChange'].forEach(prop => {
        if (instance[prop] === undefined) {
          instance[prop] = true;
        }
      });
      document.body.appendChild(instance.$el);

      Vue.nextTick(() => {
        instance.visible = true;
      });
    }
  }
};

const PopupBox = function(options, callback) {
  if (Vue.prototype.$isServer) return;
  if (typeof options === 'string' || isVNode(options)) {
    options = {
      message: options
    };
    if (typeof arguments[1] === 'string') {
      options.title = arguments[1];
    }
  } else if (options.callback && !callback) {
    callback = options.callback;
  }

  if (typeof Promise !== 'undefined') {
    return new Promise((resolve, reject) => { // eslint-disable-line
      msgQueue.push({
        options: merge({}, defaults, PopupBox.defaults, options),
        callback: callback,
        resolve: resolve,
        reject: reject
      });

      showNextMsg();
    });
  } else {
    msgQueue.push({
      options: merge({}, defaults, PopupBox.defaults, options),
      callback: callback
    });

    showNextMsg();
  }
};

PopupBox.setDefaults = defaults => {
  PopupBox.defaults = defaults;
};

PopupBox.alert = (message, title, options) => {
  if (typeof title === 'object') {
    options = title;
    title = null;
  } else if (title === undefined) {
    title = null;
  }
  return PopupBox(merge({
    title: title,
    message: message,
    $type: 'alert',
    center: true,
    showClose: false,
    closeOnPressEscape: false,
    closeOnClickModal: false
  }, options));
};

PopupBox.confirm = (message, title, options) => {
  if (typeof title === 'object') {
    options = title;
    title = null;
  } else if (title === undefined) {
    title = null;
  }

  return PopupBox(merge({
    title: title,
    message: message,
    $type: 'confirm',
    center: true,
    showCancelButton: true
  }, options));
};

PopupBox.prompt = (message, title, options) => {
  if (typeof title === 'object') {
    options = title;
    title = null;
  } else if (title === undefined) {
    title = null;
  }
  return PopupBox(merge({
    title: title,
    message: message,
    showCancelButton: true,
    showInput: true,
    $type: 'prompt',
    center: true
  }, options));
};

PopupBox.close = () => {
  instance.doClose();
  instance.visible = false;
  msgQueue = [];
  currentMsg = null;
};

export default PopupBox;
export { PopupBox };
