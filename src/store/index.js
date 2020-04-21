import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import user from './modules/user'
import cart from './modules/cart'
import shopFood from './modules/shopFood'
import getters from './getters'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user,
    cart,
    shopFood
  },
  getters,
  plugins: [createLogger()]
})

export default store
