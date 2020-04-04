
const md5 = require('md5')
const state = {
  carts: [],
  shopId: 0,
  cartList: [],
  food: []
}
const mutations = {
  EMPTY_CART: (state, shopId) => {
    let carts = state.carts
    let cartIndex = carts.findIndex(item => {
      return item.shopId === shopId
    })
    carts[cartIndex].data.map((item, index) => {
      item.count = 0
      item.goods.forEach((food, foodIndex) => {
        food.count = 0
        food.index = index
        food.skuCount = 0
        food.foodIndex = foodIndex
        food.sku.forEach((sku, skuIndex) => {
          sku.skuIndex = skuIndex
          sku.num = 0
          sku.attr = []
        })
      })
    })
    state.cartList = carts[cartIndex].data
    state.food = []
    carts[cartIndex].food = []
    state.carts = carts
  },
  INIT_CART: (state, data) => {
    let hash = md5(JSON.stringify([...data.data]))
    data.hash = hash
    let menuList = data.data
    let carts = state.carts
    state.shopId = data.shopId
    let cartIndex = carts.findIndex(item => {
      return item.shopId === state.shopId
    })
    if (cartIndex >= 0) {
      let cartItem = carts[cartIndex]
      if (cartItem.hash === hash) {
        menuList = cartItem.data
        state.food = cartItem.food
        state.cartList = menuList
        return
      } else {
        carts.splice(cartIndex, 1)
      }
    }
    menuList.map((item, index) => {
      item.count = 0
      item.goods.forEach((food, foodIndex) => {
        food.count = 0
        food.index = index
        food.foodIndex = foodIndex
        food.sku.forEach((sku, skuIndex) => {
          sku.skuIndex = skuIndex
          sku.num = 0
          sku.attr = []
        })
      })
    })
    data.data = menuList
    carts.push(data)
    state.cartList = menuList
    state.food = []
    state.carts = carts
  },
  SKU_CART_CART: (state, data) => {
    let {index, foodIndex, count, num, skuIndex, attr, skuTitle} = data
    let categoryNum = 0
    let cart = state.cartList
    let food = state.food
    cart[index].goods[foodIndex].count = count
    cart[index].goods[foodIndex].attr = attr
    cart[index].goods[foodIndex].sku[skuIndex].skuTitle = skuTitle
    cart[index].goods[foodIndex].sku[skuIndex].num = num
    cart[index].goods.forEach(food => {
      categoryNum += food.count
    })
    cart[index].count = categoryNum
    let findIndex = food.findIndex(item => {
      // 购物车商品
      let cartFood = cart[index].goods[foodIndex]
      // 判断商品id
      let judgeGoodsId = (item.goods_id === cartFood.goods_id)
      // 判断商品属性是否相等
      let judgeGoodsAttrs = true
      item.attribute.forEach((item, index) => {
        if (item.curText !== cartFood.attr[index]) {
          judgeGoodsAttrs = false
        }
      })
      return judgeGoodsId && judgeGoodsAttrs
    })
    if (findIndex >= 0) {
      food[findIndex] = cart[index].goods[foodIndex]
    } else {
      food.push(JSON.parse(JSON.stringify(cart[index].goods[foodIndex])))
    }
    state.food = [...food]
    // 重新计算购物车数量
    let findNum = 0
    food.forEach(item => {
      if (Number(item.goods_id === Number(cart[index].goods[foodIndex].goods_id))) {
        findNum++
      }
    })
    cart[index].goods[foodIndex].count = findNum
    state.cartList = cart
  },
  UPTATE_CART: (state, time) => {
    let carts = state.carts
    let cartIndex = carts.findIndex(item => {
      return item.shopId === state.shopId
    })
    if (cartIndex >= 0) {
      carts[cartIndex].food = state.food
      carts[cartIndex].data = state.cartList
      state.cartList = []
      state.food = []
    }
  },
  ADD_CART: (state, data) => {
    let {index, foodIndex, num, skuIndex} = data
    if (num < 0) {
      return
    }
    let cart = state.cartList
    let food = state.food
    let categoryNum = 0
    let foodNum = 0
    cart[index].goods[foodIndex].sku[skuIndex].num = num

    if (cart[index].goods[foodIndex].sku.length > 1) {
      cart[index].goods[foodIndex].sku.forEach(sku => {
        if (sku.num) {
          foodNum += sku.num
        }
      })
      cart[index].goods[foodIndex].count = foodNum
    } else {
      cart[index].goods[foodIndex].count = num
    }
    cart[index].goods.forEach(food => {
      categoryNum += food.count
    })
    cart[index].count = categoryNum
    let findIndex = food.findIndex(item => {
      return item.goods_id === cart[index].goods[foodIndex].goods_id
    })
    if (findIndex >= 0) {
      if (cart[index].goods[foodIndex].count) {
        food[findIndex] = cart[index].goods[foodIndex]
      } else {
        food.splice(findIndex, 1)
      }
    } else {
      food.push(cart[index].goods[foodIndex])
    }
    state.food = [...food]
    state.cartList = cart
  }
}

const actions = {
  addCart ({ commit }, data) {
    commit('ADD_CART', data)
  },
  reductCart ({ commit }, food) {
    commit('REDUCT_CART', food)
  }
}

export default {
  state,
  mutations,
  actions
}
