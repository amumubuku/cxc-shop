const state = {
  shopList: [],
  shopMoreAttrsList: []
}

const mutations = {
  // 设置商家堂食菜单
  SET_SHOP_LIST: (state, list) => {
    state.shopList = list
  },

  // 设置多属性购物车列表
  SET_SHOP_MORE_ATTRS_LIST: (state, list) => {
    state.shopMoreAttrsList = list
  },

  // 设置商家堂食数量
  SET_SHOP_FOOD_NUM: (state, ary) => {
    let [ index, _index, changeNum ] = ary
    state.shopList[index].goods[_index].num += changeNum
    if (state.shopList[index].goods[_index].num <= 0) {
      state.shopList[index].goods[_index].num = 0
    }
  }
}

const getters = {
  // 两部分 列表单属性 + 多属性
  allFoodList: (state) => {
    // 单属性列表
    let singleAry = []
    state.shopList.forEach(item => {
      item.goods.forEach(_item => {
        if (_item.num !== 0 && _item.hasMoreAttrs === 0) {
          let catchItem = JSON.parse(JSON.stringify(_item))
          catchItem.price = catchItem.num * catchItem.sku[0].price
          singleAry.push(catchItem)
        }
      })
    })

    let moreAry = JSON.parse(JSON.stringify(state.shopMoreAttrsList))
    return [
      ...singleAry,
      ...moreAry
    ]
  }
}

export default {
  state,
  mutations,
  getters
}
