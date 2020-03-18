const getters = {
  user: state => state.user.userInfo,
  cartList: state => state.cart.cartList,
  hitory: state => state.user.searchHitory,
  curAddress: state => state.user.curAddress,
  location: state => state.user.location,
  cart: state => {
    let infoCart = [
      {
        id: '',
        title: '',
        goods: [
          {
            sku: []
          }
        ]
      },
      {
        id: '',
        title: '',
        goods: [
          {
            sku: []
          }
        ]
      },
      {
        id: '',
        title: '',
        goods: [
          {
            sku: []
          }
        ]
      },
      {
        id: '',
        title: '',
        goods: [
          {
            sku: []
          }
        ]
      },
      {
        id: '',
        title: '',
        goods: [
          {
            sku: []
          }
        ]
      }
    ]
    return state.cart.cartList.length ? state.cart.cartList : infoCart
  },
  food: state => state.cart.food

}
export default getters
