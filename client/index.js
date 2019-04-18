/*
 * index.js
 * 项目的入口文件
 * */
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './app.vue'
import Meta from 'vue-meta'

Vue.use(VueRouter)
Vue.use(Meta)

// 引入全局CSS样式
import './assets/styles/global.styl'
import createRouter from './config/router'

const router = createRouter()

import Notification from './components/notification'
Vue.use(Notification)

// 在body下创建一个根节点
const root = document.createElement('div');
document.body.appendChild(root);

// 将根节点root注入到app.vue组件中
new Vue({
	router,
    render: (h) => h(App)
}).$mount(root);