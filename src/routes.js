import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import terminalStorage from './views/terminal/terminalStorage.vue'
import terminalTransfer from './views/terminal/terminalTransfer.vue'
import transferRecord from './views/terminal/transferRecord.vue'
import transferVendor from './views/terminal/transferVendor.vue'
import policyManagement from './views/policy/policyManagement.vue'
import activateCashback from './views/policy/activateCashback.vue'
import activityCashBack from './views/policy/activityCashBack.vue'
import vipcashBack from './views/policy/vipcashBack.vue'
import couPon from './views/policy/couPon.vue'


let routes = [
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
    {
        path: '/',
        component: Home,
        name: '终端管理',
        iconCls: 'el-icon-setting',//图标样式class
        children: [
            { path: '/terminalStorage', component: terminalStorage, name: '终端入库', hidden: true },
            { path: '/terminalTransfer', component: terminalTransfer, name: '终端划拨' },
            { path: '/transferRecord', component: transferRecord, name: '划拨记录' },
            { path: '/transferVendor', component: transferVendor, name: '厂商管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '政策管理',
        iconCls: 'el-icon-setting',
        children: [
            { path: '/policyManagement', component: policyManagement, name: '政策管理－添加', hidden: true },
            { path: '/activateCashback', component: activateCashback, name: '激活返现' },
            { path: '/activityCashBack', component: activityCashBack, name: '活动返现' },
            { path: '/vipcashBack', component: vipcashBack, name: 'VIP返现' },
            { path: '/couPon', component: couPon, name: '优惠券' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;