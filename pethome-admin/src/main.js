import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
// import Mock from './mock'  注释掉Mock
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
import axios from 'axios'
//配置axios的全局基本路径
axios.defaults.baseURL = 'http://localhost:8080/'
//全局属性配置，在任意组件内可以使用this.$http获取axios对象
Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
    routes
})

//为了后端校验是否已经登录，只要用axios的请求都要携带token
//这个算前置拦截器
axios.interceptors.request.use(config => {
    //从本地存储空间获取这个token然后添加到请求中的headers里面给后端!
    let token = localStorage.getItem("token");
    if (token) {
        config.headers["token"] = token;
    }
    return config;
}, error => {
    Promise.reject(error)
});

//这个是前端后置拦截器,在获取每一个请求的响应走这个拦截器
axios.interceptors.response.use(config=>{
    console.log(config)
    if (config.data.code === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("logininfo");
        router.push({ path: '/login' });
    }
    return config;
},error => {
    Promise.reject(error)
})

// 静态资源拦截器,拦截页面请求path比如登录或者店铺注册就不拦截,其他访问静态资源如:path判断是不是有token,有则不拦截
router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path === '/login' || to.path==='/shopRegister') {
    localStorage.removeItem("token");
    localStorage.removeItem("logininfo");
    next(); //放行
    return; //不往下执行

  }
  let user = JSON.parse(localStorage.getItem('logininfo'));
  if (!user) {
    next({ path: '/login' })
  } else {
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    //components: { App }
    render: h => h(App)
}).$mount('#app')

