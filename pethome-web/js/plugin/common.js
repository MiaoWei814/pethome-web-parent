//配置axios的全局基本路径
axios.defaults.baseURL = 'http://localhost:8080/'
//全局属性配置，在任意组件内可以使用this.$http获取axios对象
Vue.prototype.$http = axios


//==============axios前置拦截器实现每次携带token======================//
axios.interceptors.request.use(config => {
    let token = localStorage.getItem("token");
    if (token) {
        //携带token
        config.headers["token"] = token;
    }

    return config;
}, error => {
    Promise.reject(error)
})
//==============axios前置拦截器实现每次携带token======================//
//==============axios后台拦截器实现后端已经退出登录的跳转登录页面======================//
axios.interceptors.response.use(config => {
    let data = config.data;
    //403权限问题
    if (data.code === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("logininfo");
        location.href = "/login.html";
    }
    return config;
}, error => {
    Promise.reject(error)
})
//==============axios后台拦截器实现后端已经退出登录的跳转登录页面======================//


//前端的登录拦截-common.js会被所有的界面导入
// 判断localStorage中是否有logininfo
// 因为没有router路由,所以这里模拟静态资源拦截器
let url = location.href;
//不是登录且不是注册，就要拦截
if (url.indexOf("login.html") === -1 &&
    url.indexOf("register.html") === -1 &&
    url.indexOf("callback.html") === -1 &&
    url.indexOf("binder.html") === -1) {
    let loginInfo = localStorage.getItem("logininfo");
    if (!loginInfo) {
        location.href = "/login.html"
    }
}

/**
 * 解析url获取参数对象
 * @param url
 * @returns {{}}
 */
function parseUrlParams2Obj(url){
    //获取请求参数
    let paramStr = url.substring(url.indexOf("?")+1);//code=021FdXFa14mYlA016OGa1L3R4X0FdXFO&state=1
    let paramStrs = paramStr.split("&");//[code=021FdXFa14mYlA016OGa1L3R4X0FdXFO,state=1]
    let paramObj = {};
    for(let i=0;i<paramStrs.length;i++){
        let paramName = paramStrs[i].split("=")[0];//code
        let paramValue = paramStrs[i].split("=")[1];//021FdXFa14mYlA016OGa1L3R4X0FdXFO
        paramObj[paramName] = paramValue;
    }
    return paramObj;
}


