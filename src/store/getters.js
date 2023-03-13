const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  isRoot: (state) => state.user.isRoot,
  name: (state) => state.user.name,
  isMobile: (state) => state.settings.isMobile
}
export default getters
