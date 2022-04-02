<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane v-for="connect in connects" :key="connect.type" :label="connect.name">
        <el-form :model="connect" label-width="100px" style="width: 500px">
          <el-collapse v-model="connect.collapses">
            <el-collapse-item v-for="client in connect.client_list" :key="client.name" :title="client.name" :name="client.key">
              <el-form-item v-for="config in client.config_list" :key="config.key" :label="config.name + '：'">
                <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" v-model="config.value"></el-input>
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
          <el-form-item>
            <el-button type="primary" size="small" class="save-btn" @click="handleSaveConfig(connect)">立即保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import * as API_Connect from '@/api/connect'

  export default {
    name: 'trustLogin',
    data() {
      return {
        /** 信任登录参数 */
        connects: []
      }
    },
    mounted() {
      API_Connect.getConnect().then(response => {
        this.connects = response.map(item => {
          const _collapses = []
          item.client_list = item.client_list.map((client, index) => {
            const _key = `${item.type}-${index}`
            client.key = _key
            _collapses.push(_key)
            return client
          })
          item.collapses = _collapses
          return item
        })
      })
    },
    methods: {
      /** 保存配置 */
      handleSaveConfig(connect) {
        const params = this.MixinClone(connect)
        delete params.collapses
        API_Connect.editConnect(connect.type, params).then(() => {
          this.$message.success('修改成功！')
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .save-btn {
    margin-top: 10px;
  }
</style>
