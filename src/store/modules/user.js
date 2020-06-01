import {saveSearch, deleteSearch, clearSearch, loadSearch} from '@/utils/cache'
const state = {
  userInfo: wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : '',
  searchHitory: loadSearch(),
  curAddress: '',
  location: wx.getStorageSync('location') || {}
}

const mutations = {
  SET_USER: (state, user) => {
    state.userInfo = user
  },
  SET_SEARCH_HITORY: (state, hitory) => {
    state.searchHitory = hitory
  },
  SET_ADDRESS: (state, address) => {
    state.curAddress = address
  },
  LOGIN_OUT: (state, data) => {
    state.userInfo = ''
    wx.removeStorage('userInfo')
    wx.removeStorage('token')
  },
  SET_LOCATION: (state, location) => {
    state.location = location
  }
}

const actions = {
  setUser ({ commit }, data) {
    commit('SET_USER', data)
  },
  saveSearchHitory  ({commit}, query) {
    commit('SET_SEARCH_HITORY', saveSearch(query))
  },
  deleteSearchHitory  ({commit}, query) {
    commit('SET_SEARCH_HITORY', deleteSearch(query))
  },
  clearSearchHitory  ({commit}) {
    commit('SET_SEARCH_HITORY', clearSearch())
  }
}

export default {
  state,
  mutations,
  actions
}
