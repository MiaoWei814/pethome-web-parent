import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
import Department from './views/org/Department'
import System from './views/org/system'
import Shop from './views/org/Shop'
import SearchMasterMsgPending from './views/pet/SearchMasterMsgPending';
import SearchMasterMsgProcessed from './views/pet/SearchMasterMsgProcessed';

let routes = [
    {
        path: '/shopRegister',
        component: Shop,
        name: '门店入驻',
        hidden: true //不显示在页面
    },
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '首页',
        iconCls: 'fa fa-bar-chart',
        children: [
            {path: '/echarts', component: echarts, name: '首页'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '组织机构管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            {path: '/dept', component: Department, name: '部门管理'},
            {path: '/emp', component: Department, name: '员工管理'},
            {path: '/shop', component: Department, name: '店铺管理'},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: 'fa fa-id-card-o',
        children: [
            {path: '/log', component: Department, name: '日志管理'},
            {path: '/d', component: System, name: '数据字典'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '宠物管理',
        iconCls: 'fa fa-address-card',
        children: [
            {path: '/pending', component: SearchMasterMsgPending, name: '待处理寻主消息'},
            {path: '/processed', component: SearchMasterMsgProcessed, name: '已处理寻主消息'},
            {path: '/petType', component: SearchMasterMsgProcessed, name: '宠物类型'},
            {path: '/pet', component: SearchMasterMsgProcessed, name: '宠物管理'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            {path: '/page6', component: Page6, name: '导航三'}
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: {path: '/404'}
    }
];

export default routes;
