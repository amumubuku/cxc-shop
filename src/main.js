import Vue from 'vue'
import App from './App'
import Http from '@/utils/request'
import store from './store/index'
Vue.prototype.$store = store
Vue.prototype.$http = new Http()
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue(App)
app.$mount()
