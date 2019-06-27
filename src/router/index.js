import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'

Vue.use(Router)
// 使用路由拦截器 处理页面访问权限
const router = new Router({
  routes: [
    // {
    //   name: 'home',
    //   path: '/',
    //   component: () => import('@/views/home')
    // },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    },
    {
      name: 'layout',
      path: '/',
      component: () => import('@/views/layout'),
      children: [
        {
          name: 'home',
          path: '', // 默认layout子路由
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        },
        {
          name: 'article-list',
          path: '/article',
          component: () => import('@/views/article')
        }
      ]
    }
  ]
})
/**
 * 所有路由导航都要经过这里
 * to 去哪儿
 * from 来自哪里
 * next 允许通过的方法
 */
router.beforeEach((to, from, next) => {
  NProgress.start()
  const userInfo = window.localStorage.getItem('user_info')
  if (to.path !== '/login') { // 如果不是登录页
    if (!userInfo) { // 判断是否登录了
      next({ name: 'login' }) // 没有登录 就去登录页
    } else {
      next()
    }
  } else { // 如果是登录页
    if (userInfo) { // 如果登录了 就不访问登录页了
      next(false)
    } else {
      next()
    }
  }
})
router.afterEach((to, from) => {
  NProgress.done()
})
export default router
