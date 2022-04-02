<template>
  <div class="static-page-container">
    <el-form :model="pageForm" :rules="pageRules" ref="pageForm" label-width="160px" style="width: 500px;">
      <el-form-item label="PC静态页服务地址" prop="static_page_address">
        <el-input v-model="pageForm.static_page_address">
          <el-button slot="append" icon="el-icon-check" @click="handleSaveAddress('pc')"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="要生成的页面">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkedPages" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="page in pages" :label="page" :key="page.value">{{ page.text }}</el-checkbox>
        </el-checkbox-group>
        <el-button
          type="primary"
          :disabled="status === 'DOING'"
          :loading="status === 'DOING'"
          @click="handleCreateStaticPage"
        >{{ status === 'DOING' ? '生成中' : '生成' }}</el-button>
        <el-button type="danger" @click="handleStopStaticPage">停止</el-button>
      </el-form-item>
      <el-form-item label="">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage" :status="status"/>
        <p :class="['progress-text', status === 'EXCEPTION' && 'error']">{{ status_text }}</p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import * as API_StaticPage from '@/api/staticPage'
  import * as API_Task from '@/api/task'

  const pageOptions = [
    { text: '首页', value: 'INDEX' },
    { text: '商品页', value: 'GOODS' },
    { text: '帮助中心', value: 'HELP' }
  ]
  export default {
    name: 'staticPage',
    data() {
      return {
        percentage: 0,
        status: '',
        status_text: '',
        checkAll: true,
        checkedPages: pageOptions,
        pages: pageOptions,
        isIndeterminate: true,
        task_id: 'PAGE_CREATE',
        // 静态页 表单
        pageForm: {
          address: ''
        },
        // 静态页 表单规则
        pageRules: {
          static_page_address: [this.MixinRequired('PC静态页服务地址不能为空！')]
        },
        /** 定时器 */
        timer: null
      }
    },
    created() {
      /** 检查是否有静态页生成任务 */
      API_Task.hasTask(this.task_id).then(response => {
        this.status = 'DOING'
        this.GET_Progress()
      })
      /** 获取静态页生成地址 */
      API_StaticPage.getStaticPageAddress().then(response => {
        this.pageForm = response || {}
      })
    },
    methods: {
      /** 保存静态页地址 */
      handleSaveAddress(type) {
        this.$refs['pageForm'].validate((valid) => {
          if (valid) {
            API_StaticPage.saveStaticPageAddress(this.pageForm).then(response => {
              this.$message.success('保存成功！')
            })
          } else {
            this.$message.error('请输入静态页服务地址！')
            return false
          }
        })
      },
      handleCheckAllChange(val) {
        this.checkedPages = val ? pageOptions : []
        this.isIndeterminate = false
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.pages.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.pages.length
      },
      /** 生成静态页 */
      handleCreateStaticPage() {
        if (this.checkedPages.length === 0) {
          this.$message.error('请选择要生成的页面！')
          return false
        }
        this.$confirm('确定要生成静态页吗？', '提示', { type: 'warning' }).then(() => {
          const choose = this.checkedPages.map(item => item.value)
          const params = { choose_pages: choose }
          this.percentage = 0
          API_StaticPage.createStaticPage(params).then(response => {
            this.GET_Progress()
          })
        }).catch(() => {})
      },
      /** 停止生成静态页 */
      handleStopStaticPage() {
        API_Task.clearTask(this.task_id).then(() => {
          this.status = 'SCUESS'
          this.status_text = ''
          clearTimeout(this.timer)
          this.timer = null
        })
      },
      /** 获取生成进度 */
      GET_Progress() {
        API_Task.getProgressById(this.task_id).then(response => {
          const { text, status, percentage } = response
          this.percentage = percentage
          this.status = status
          this.status_text = text
          if (status === 'DOING') {
            this.timer = setTimeout(this.GET_Progress, 1000)
          } else if (status === 'SUCCESS') {
            this.$message.success('静态页生成完成！')
          }
        })
      }
    },
    deactivated() {
      this.timer && clearTimeout(this.timer)
    },
    destroyed() {
      this.timer && clearTimeout(this.timer)
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .static-page-container {
    background-color: #fff;
    padding: 10px;
  }
  .progress-text {
    font-size: 14px;
    &.error {
      color: #f42424;
    }
  }
  /deep/ .progress-box .el-progress-bar__inner {
    transition: width ease-in .2s;
  }
</style>
