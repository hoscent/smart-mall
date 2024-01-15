import { getCartList, updateGoods, deleteGoods } from '@/api/cart'

const state = {
  cartList: []
}

const mutations = {
  setCartList (state, cartList) {
    state.cartList = cartList
  },
  setChecked (state, id) {
    const goods = state.cartList.find(item => item.goods_id === id)
    goods.isChecked = !goods.isChecked
  },
  setAllChecked (state, check) {
    state.cartList.forEach(item => {
      item.isChecked = !check
    })
  },
  changeCount (state, { goodsId, goodsNum }) {
    const goods = state.cartList.find(item => item.goods_id === goodsId)
    goods.goods_num = goodsNum
  }
}

const getters = {
  cartTotal (state) {
    return state.cartList.length
  },
  selGoods (state) {
    return state.cartList.filter(item => item.isChecked)
  },
  selCount (state, getters) {
    return getters.selGoods.reduce((sum, item) => sum + item.goods_num, 0)
  },
  totalPrice (state, getters) {
    return getters.selGoods.reduce((sum, item) => sum + item.goods_num * item.goods.goods_price_min, 0).toFixed(2)
  },
  isAllChecked (state) {
    if (state.cartList.length === 0) return false
    return state.cartList.every(item => item.isChecked)
  }
}

const actions = {
  async getCartAction (context) {
    await getCartList().then(res => {
      const data = res.data
      data.list.forEach(item => {
        item.isChecked = false
      })
      context.commit('setCartList', data.list)
    })
  },
  changeGoods (context, obj) {
    const { goodsId, goodsNum, goodsSkuId } = obj
    context.commit('changeCount', { goodsId, goodsNum })
    updateGoods(goodsId, goodsNum, goodsSkuId)
  },
  deleteCart (context) {
    const sel = context.getters.selGoods
    const cartIds = sel.map(item => item.id)
    deleteGoods(cartIds)
    context.dispatch('getCartAction')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
