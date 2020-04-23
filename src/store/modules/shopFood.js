const state = {
  shopList: [],
  shopMoreAttrsList: [],
  searchKey: null,
  shopInfo: null,
  shopId: null
}

const mutations = {
  // 设置商家堂食菜单
  SET_SHOP_LIST: (state, list) => {
    state.shopList = list
  },

  // 设置商家ID
  SET_SHOP_ID: (state, id) => {
    state.shopId = id
  },

  // 添加多属性购物车列表
  ADD_SHOP_MORE_ATTRS_LIST: (state, goods) => {
    let goodsId = goods.goods_id
    let skuIndex = goods.skuIndex
    let attrStr = goods.attribute.map(item => item.attrsIndex).toString()

    let checkIndex = -1
    // 加入前判断
    state.shopMoreAttrsList.forEach((item, index) => {
      // 1.判断id
      if (item.goods_id === goodsId) {
        // 2.判断规格
        if (item.skuIndex === skuIndex) {
          // 3.判断属性
          let itemAttrStr = item.attribute.map(item => item.attrsIndex).toString()
          if (itemAttrStr === attrStr) {
            checkIndex = index
          }
        }
      }
    })
    if (checkIndex === -1) {
      state.shopMoreAttrsList.push(goods)
    } else {
      state.shopMoreAttrsList.splice(checkIndex, 1, goods)
    }
  },

  // 设置搜索关键字
  SET_SEARCH_KEY: (state, searchKey) => {
    state.searchKey = searchKey
  },

  // 设置商家信息
  SET_SHOP_INFO: (state, info) => {
    state.shopInfo = info
  },

  // 清空购物车
  CLEAR_CART: (state) => {
    state.shopMoreAttrsList = []
    let catchShopList = JSON.parse(JSON.stringify(state.shopList))
    catchShopList.forEach(item => {
      item.goods.forEach(_item => {
        _item.num = 0
      })
    })
    state.shopList = catchShopList
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

    let moreAry = []
    state.shopMoreAttrsList.forEach(item => {
      let num = item.num
      let price = item.sku[item.skuIndex].price
      let catchItem = JSON.parse(JSON.stringify(item))
      catchItem.price = num * price
      let desAry = []
      desAry.push(item.sku[item.skuIndex].id)
      item.attribute.forEach(_item => {
        desAry.push(_item.attrs[_item.attrsIndex].title)
      })
      catchItem.des = desAry.join('、')

      if (num > 0) {
        moreAry.push(catchItem)
      }
    })

    let cartFoodList = [
      ...singleAry,
      ...moreAry
    ]
    let cartFoodNumAry = cartFoodList.map(item => item.num)
    let cartFoodNumPrice = cartFoodList.map(item => item.price)
    let cartFoodNum = cartFoodNumAry.reduce((a, b) => a + b, 0)
    console.log(cartFoodNumPrice)
    let cartFoodPrice = cartFoodNumPrice.reduce((a, b) => (parseFloat(a) + parseFloat(b)).toFixed(2), 0)
    return {
      cartFoodList,
      cartFoodPrice,
      cartFoodNum
    }
  },

  // 搜索结果
  searchResult: (state) => {
    let { searchKey } = state
    let resultAry = []
    if (searchKey) {
      state.shopList.forEach(item => {
        item.goods.forEach(_item => {
          if (_item.title.includes(searchKey)) {
            resultAry.push(JSON.parse(JSON.stringify(_item)))
          }
        })
      })
    }
    return resultAry
  }
}

export default {
  state,
  mutations,
  getters
}
