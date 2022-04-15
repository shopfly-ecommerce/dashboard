<template>
  <div class="goods-index-container">
    <el-button
      type="primary"
      :disabled="status === 'DOING'"
      :loading="status === 'DOING'"
      @click="handleCreateGoodsIndex"
    >{{ status === 'doing' ? 'In the generated' : 'generate' }}</el-button>
    <el-button type="danger" @click="handleStopGoodsIndex">stop</el-button>
    <div class="progress-box">
      <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage" :status="status"/>
      <p :class="['progress-text', status === 'EXCEPTION' && 'error']">{{ status_text }}</p>
    </div>
  </div>
</template>

<script>
  import * as API_Goods from '@/api/goods'
  import * as API_Task from '@/api/task'

  export default {
    name: 'goodsIndex',
    data() {
      return {
        percentage: 0,
        // DOING(DOING), SUCCESS(DOING), EXCEPTION(DOING)
        status: '',
        status_text: '',
        // Task Id
        task_id: 'GOODS_INDEX_INIT',

        /** The timer*/
        timer: null
      }
    },
    created() {
      /** Check if there is a commodity index generation task*/
      API_Task.hasTask(this.task_id).then(this.GET_Progress)
    },
    methods: {
      /** Generate commodity index*/
      handleCreateGoodsIndex() {
        this.percentage = 0
        this.$confirm('Are you sure you want to generate the item index？', 'prompt', { type: 'warning' }).then(() => {
          API_Goods.initSearchIndex().then(response => {
            this.GET_Progress()
          })
        }).catch(() => {})
      },
      /** Stop producing*/
      handleStopGoodsIndex() {
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
          const { percentage, status, text } = response
          this.percentage = percentage
          this.status = status
          this.status_text = text
          if (status === 'DOING' && this) {
            this.timer = setTimeout(() => { this.GET_Progress() }, 1000)
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
  .goods-index-container {
    background-color: #fff;
    padding: 10px;
  }
  .progress-box {
    width: 500px;
    margin-top: 20px;
    .progress-text {
      font-size: 14px;
      &.error {
        color: #f42424;
      }
    }
  }
  /deep/ .progress-box .el-progress-bar__inner {
    transition: width ease-in .2s;
  }
</style>
