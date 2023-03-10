import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await login(userInfo)
        commit('SET_TOKEN', data.token)
        setToken(data.token, data.expireTime)
        return resolve('ok')
      } catch (error) {
        return reject(error)
      }
    })
  },
  // 用户退出登录
  async logout({ commit }) {
    try {
      await logout()
      removeToken()
      commit('RESET_STATE')
      return Promise.resolve('ok')
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
