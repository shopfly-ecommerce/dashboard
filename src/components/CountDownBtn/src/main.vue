<template>
  <el-button :disabled="disabled" @click.stop="handleClicked" class="count-down-btn">{{ message || initTip }}</el-button>
</template>

<script>
  export default {
    name: 'EnCountDownBtn',
    props: {
      /** 需要倒数的时间 */
      time: {
        type: Number,
        default: 60
      },
      /** 初始化提示 */
      initTip: {
        type: String,
        default: '获取验证码'
      },
      /** 倒计时结束的提示 */
      endTip: {
        type: String,
        default: '重新获取'
      },
      /** 倒计时开始后 秒数的前缀 */
      preTip: {
        type: String,
        default: ''
      },
      /** 倒计时开始后 秒数的后缀*/
      sufTip: {
        type: String,
        default: '秒后重新获取'
      },
      /** 是否停止计时器 */
      isStop: {
        type: Boolean,
        default: false
      },
      /** 一个异步方法，回调后开始倒计时 */
      start: {
        type: Function,
        required: true
      }
    },
    data() {
      return {
        count_time: this.time,
        disabled: false,
        message: '',
        interval: null
      }
    },
    watch: {
      isStop() {
        if (this.isStop) { // 停止计时器
          clearInterval(this.interval)
          this.interval = null
          this.count_time = this.time
          this.message = ''
          this.disabled = false
          this.$emit('end')
        }
      }
    },
    methods: {
      handleClicked() {
        this.start().then(() => this.startCountDown()).catch(() => {})
      },
      startCountDown() {
        this.disabled = true
        this.interval = setInterval(() => {
          if (this.count_time > 1) {
            this.count_time--
            this.message = this.count_time + this.sufTip
          } else {
            clearInterval(this.interval)
            this.message = '重新发送'
            this.count_time = this.time
            this.disabled = false
            this.$emit('end')
          }
        }, 1000)
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .count-down-btn {
    &.is-disabled {
      color: #c0c4cc;
      cursor: not-allowed;
      background-image: none;
      background-color: #fff;
      border-color: #ddd;
      border-top: 1px solid;
    }
  }
</style>
