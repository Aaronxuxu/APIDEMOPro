<template>
  <section ref="appMain" class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
import { mapActions } from 'vuex'
import _debounce from 'lodash/debounce'
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  },

  mounted() {
    this.DBResizeLayout()
    window.addEventListener('resize', this.DBResizeLayout)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.DBResizeLayout)
  },
  methods: {
    DBResizeLayout: _debounce(
      function() {
        const width = window.innerWidth
        if (width >= 768 && this.$store.getters.isMobile) {
          this.changeSetting({ key: 'isMobile', value: false })
        }
        if (width < 768 && !this.$store.getters.isMobile) {
          this.changeSetting({ key: 'isMobile', value: true })
        }
      },
      20,
      {
        leading: false,
        trailing: true
      }
    ),
    ...mapActions('settings', ['changeSetting'])
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
