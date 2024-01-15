import { getUserInfo, setUserInfo } from '@/utils/storage'

const state = {
  userInfo: getUserInfo()
}
const mutations = {
  setUserInfo (state, obj) {
    state.userInfo = obj
    setUserInfo(obj)
  }
}
const getters = {
}
const actions = {
  logout (context) {
    context.commit('setUserInfo', {})
    context.commit('cart/setCartList', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
