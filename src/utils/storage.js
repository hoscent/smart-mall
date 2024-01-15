const INFO_KEY = 'mall_userInfo'

export const getUserInfo = () => {
  const result = localStorage.getItem(INFO_KEY)
  return result ? JSON.parse(result) : { token: '', userId: '' }
}
export const setUserInfo = (userInfo) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(userInfo))
}
export const removeUserInfo = () => {
  localStorage.removeItem(INFO_KEY)
}

const SEARCH_KEY = 'mall_search'
export const getSearch = () => {
  const result = localStorage.getItem(SEARCH_KEY)
  return result ? JSON.parse(result) : []
}
export const setSearch = (search) => {
  localStorage.setItem(SEARCH_KEY, JSON.stringify(search))
}
