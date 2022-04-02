<template>
  <div class="goods-index-container">
    <el-button
      type="primary"
      :disabled="status === 'DOING'"
      :loading="status === 'DOING'"
      @click="handleCreateGoodsIndex"
    >{{ status === 'doing' ? '生成中' : '生成' }}</el-button>
    <el-button type="danger" @click="handleStopGoodsIndex">停止</el-button>
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
        // DOING("进行中"), SUCCESS("成功"), EXCEPTION("异常")
        status: '',
        status_text: '',
        // 任务Id
        task_id: 'GOODS_INDEX_INIT',

        /** 定时器  */
        timer: null
      }
    },
    created() {
      /** 检查是否有商品索引生成任务 */
      API_Task.hasTask(this.task_id).then(this.GET_Progress)
    },
    methods: {
      /** 生成商品索引 */
      handleCreateGoodsIndex() {
        this.percentage = 0
        this.$confirm('确定要生成商品索引吗？', '提示', { type: 'warning' }).then(() => {
          API_Goods.initSearchIndex().then(response => {
            this.GET_Progress()
          })
        }).catch(() => {})
      },
      /** 停止生成 */
      handleStopGoodsIndex() {
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
