
const SEARCH_KEY = '_search_'
const SEARCH_MAX_LEN = 10
function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (arr.length > maxLen) {
    arr.pop()
  }
}
function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
export function saveSearch (query) {
  let searches = wx.getStorageSync(SEARCH_KEY) || []
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  wx.setStorageSync(SEARCH_KEY, searches)
  return searches
}
export function deleteSearch (query) {
  let searches = wx.getStorageSync(SEARCH_KEY)
  deleteFromArray(searches, (item) => {
    return item === query
  })
  wx.setStorageSync(SEARCH_KEY, searches)
  return searches
}

export function clearSearch () {
  wx.removeStorageSync(SEARCH_KEY)
  return []
}
export function loadSearch () {
  return wx.getStorageSync(SEARCH_KEY)
}
