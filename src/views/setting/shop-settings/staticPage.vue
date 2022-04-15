<template>
  <div class="static-page-container">
    <el-form :model="pageForm" :rules="pageRules" ref="pageForm" label-width="160px" style="width: 500px;">
      <el-form-item label="PCStatic page service address" prop="static_page_address">
        <el-input v-model="pageForm.static_page_address">
          <el-button slot="append" icon="el-icon-check" @click="handleSaveAddress('pc')"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="The page to generate">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Select all</el-checkbox>
        <el-checkbox-group v-model="checkedPages" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="page in pages" :label="page" :key="page.value">{{ page.text }}</el-checkbox>
        </el-checkbox-group>
        <el-button
          type="primary"
          :disabled="status === 'DOING'"
          :loading="status === 'DOING'"
          @click="handleCreateStaticPage"
        >{{ status === 'DOING' ? 'In the generated' : 'generate' }}</el-button>
        <el-button type="danger" @click="handleStopStaticPage">stop</el-button>
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
    { text: 'Home', value: 'INDEX' },
    { text: 'Commodity page', value: 'GOODS' },
    { text: 'Help center', value: 'HELP' }
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
        // Static page form
        pageForm: {
          address: ''
        },
        // Static page form rules
        pageRules: {
          static_page_address: [this.MixinRequired('PCThe static page service address cannot be empty！')]
        },
        /** The timer*/
        timer: null
      }
    },
    created() {
      /** Check if there is a static page generation task*/
      API_Task.hasTask(this.task_id).then(response => {
        this.status = 'DOING'
        this.GET_Progress()
      })
      /** Gets the static page generation address*/
      API_StaticPage.getStaticPageAddress().then(response => {
        this.pageForm = response || {}
      })
    },
    methods: {
      /** Save the static page address*/
      handleSaveAddress(type) {
        this.$refs['pageForm'].validate((valid) => {
          if (valid) {
            API_StaticPage.saveStaticPageAddress(this.pageForm).then(response => {
              this.$message.success('Save success！')
            })
          } else {
            this.$message.error('Please enter the static page service address！')
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
      /** Generate static pages*/
      handleCreateStaticPage() {
        if (this.checkedPages.length === 0) {
          this.$message.error('Select the page you want to generate！')
          return false
        }
        this.$confirm('Are you sure you want to generate static pages？', 'prompt', { type: 'warning' }).then(() => {
          const choose = this.checkedPages.map(item => item.value)
          const params = { choose_pages: choose }
          this.percentage = 0
          API_StaticPage.createStaticPage(params).then(response => {
            this.GET_Progress()
          })
        }).catch(() => {})
      },
      /** Stop generating static pages*/
      handleStopStaticPage() {
        API_Task.clearTask(this.task_id).then(() => {
          this.status = 'SCUESS'
          this.status_text = ''
          clearTimeout(this.timer)
          this.timer = null
        })
      },
      /** Get build progress*/
      GET_Progress() {
        API_Task.getProgressById(this.task_id).then(response => {
          const { text, status, percentage } = response
          this.percentage = percentage
          this.status = status
          this.status_text = text
          if (status === 'DOING') {
            this.timer = setTimeout(this.GET_Progress, 1000)
          } else if (status === 'SUCCESS') {
            this.$message.success('Static page generation is complete！')
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
