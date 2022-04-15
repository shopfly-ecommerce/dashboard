<template>
  <chat-app
    v-if="userInfo.name"
    :user="userInfo"
    :apis="MixinApi"
    :request="MixinRequest"
    :domains="MixinDomain"
    type="seller"
  />
  <div v-else class="no-login">
    <span v-if="loading">In the load...</span>
    <span v-else>Please first<a :href="`/login?forward=${$route.fullPath}`" class="login-btn">Sign in</a></span>
  </div>
</template>

<script>
import ChatApp from '@/components/ChatApp/ChatApp'
import Storage from '@/utils/storage'
import * as API_Common from '@/api/common'
let user = Storage.getItem('seller_shop')
user = user ? JSON.parse(user) : {}
export default {
  name: 'chat',
  components: { ChatApp },
  data() {
    return {
      loading: true,
      userInfo: ''
    }
  },
  mounted() {
    this.getSiteInfo()
  },
  methods: {
    /**
     * Get site information
     * @returns {Promise<void>}
     */
    async getSiteInfo() {
      try {
        const res = await API_Common.getSiteData()
        this.userInfo = {
          face: res.logo,
          name: res.site_name
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.no-login {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  .login-btn {
    color: #1E50A2;
  }
}
</style>
