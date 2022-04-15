<template>
  <div>
    <div class="logo-container" @click="linkIndex" :class="[isCollapse && 'collapse']">
      <img src="../../../../assets/logo_images/logo.png" class="logo-img">
    </div>
    <el-scrollbar wrapClass="scrollbar-wrapper">
      <el-menu
        mode="vertical"
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
      >
        <sidebar-item v-for="route in permission_routers" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    linkIndex() {
      this.$router.push({ path: '/dashboard' })
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  .logo-container{
    cursor: pointer;
  }
</style>

