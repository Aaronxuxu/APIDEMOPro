import Cookies from 'js-cookie'

const TokenKey = 'TOKEN'

const ROOTKEY = 'IS_ROOT'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, expires) {
  return Cookies.set(TokenKey, token, { expires })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export const getRoot = () => Cookies.get(ROOTKEY)

export const setRoot = (data, expires) =>
  Cookies.set(ROOTKEY, data, { expires })

export const removeRoot = () => Cookies.remove(ROOTKEY)
