import Vue from 'vue'
import App from './App.vue'
import jQuery from 'jquery'

window.jQuery = jQuery
window.$ = jQuery
window.Vue = Vue


Vue.config.productionTip = false
Vue.component('vuRowFormat', require('./components/vu-row-format.vue'));
Vue.component('vuThResizer', require('./components/vu-th-resizer.vue'));

new Vue({
  render: h => h(App)
}).$mount('#app')