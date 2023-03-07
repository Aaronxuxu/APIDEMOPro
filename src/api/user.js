import request from '@/utils/request'
import { GET, POST } from '@/utils/constant'
export function login(data) {
  return request({
    url: '/login',
    method: POST,
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
