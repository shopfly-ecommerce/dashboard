<template>
  <el-menu class="navbar" mode="horizontal">
    <div class="navbar-left">
      <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
      <breadcrumb class="breadcrumb-container"></breadcrumb>
    </div>

    <div class="right-menu">
      <el-tooltip v-if="MixinIsIM && permission_chat" effect="dark" content="客服系统">
        <chat-entry class="right-menu-item" />
      </el-tooltip>

      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <lang-select class="international right-menu-item"></lang-select>

      <!--<el-tooltip effect="dark" content="换肤" placement="bottom">-->
        <!--<theme-picker class="theme-switch right-menu-item"></theme-picker>-->
      <!--</el-tooltip>-->

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" v-if="user.face" :src="user.face">
          <img class="user-avatar" v-else src="../../../assets/logo_images/icon-noface.jpg">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <span @click="logout">
            <el-dropdown-item divided>退出登录</el-dropdown-item>
          </span>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import { domain } from '~/ui-domain'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import ChatEntry from '@/components/ChatEntry'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    LangSelect,
    ThemePicker,
    ChatEntry
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'user',
      'permission_chat'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$confirm('确定退出吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('logoutAction').then(() => {
          window.location.reload()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../../styles/variables";
  .navbar {
    height: 80px;
    border-radius: 0 !important;
    background-color: $nav_bg !important;
    border-color: $nav_bg !important;
    .navbar-left {
      float: left;
      display: flex;
      height: 80px;
      align-items: center;
    }
    .hamburger-container {
      padding: 0 10px;
    }
    .breadcrumb-container{
      float: left;
      /deep/ {
        .el-breadcrumb__separator,
        .el-breadcrumb__item .el-breadcrumb__inner a {
          color: $nav_text !important;
        }
        .el-breadcrumb__item .el-breadcrumb__inner .no-redirect {
          color: $nav_text_active !important;
        }
      }
    }
    .right-menu {
      display: flex;
      align-items: center;
      float: right;
      height: 80px;
      /deep/ svg {
        fill: $nav_text_active !important;
      }
      &:focus{
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        margin: 0 15px;
      }
      .avatar-container {
        height: 50px;
        margin-right: 30px;
        .avatar-wrapper {
          cursor: pointer;
          margin-top: 5px;
          position: relative;
          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 100%;
          }
          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
          /deep/ .el-icon-caret-bottom {
            color: $nav_text_active !important;
          }
        }
      }
    }
  }
</style>
