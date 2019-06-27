import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import ElementUI from 'element-ui'
import JSONbig from 'json-bigint'
// 优先文件
// 然后找目录 优先加载index.js
import router from './router'
import './styles/index.less'
import 'nprogress/nprogress.css'
import 'element-ui/lib/theme-chalk/index.css'

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0/'
// 使用JSONbig处理 返回数据中超出js中最大整数范围的数字
axios.defaults.transformResponse = [function (data) {
  try {
    return JSONbig.parse(data)
  } catch (err) {
    return data
  }
}]
// Axios 请求拦截器
axios.interceptors.request.use(config => {
  const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  // config.headers.Authorization = `Bearer ${userInfo.token}`
  if (userInfo) { // 登录了 才给令牌
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }
  return config // 我们可以通过修改 config 配置来统一自定义请求相关参数
}, error => {
  return Promise.reject(error)
})

// Axios 响应拦截器
axios.interceptors.response.use(response => {
  // return response.data.data
  if (typeof response.data === 'object' && response.data.data) {
    return response.data.data
  } else {
    return response.data
  }
}, error => { // 401
  // 务必删除本地存储中的用户的信息
  const status = error.response.status
  if (status === 401) {
    window.localStorage.removeItem('user_info')
    router.push({ // 跳转到登录页面
      name: 'login'
    })
  }
  return Promise.reject(error)
})

Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
