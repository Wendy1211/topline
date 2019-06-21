import Vue from 'vue'
import App from './App.vue'
// 优先文件
// 然后找目录 优先加载index.js
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
