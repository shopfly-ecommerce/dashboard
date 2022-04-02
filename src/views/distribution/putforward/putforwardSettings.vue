<template>
  <div>
    <el-form ref="cycleForm" :model="cycleForm" label-width="180px"  :rules="rules">
      <el-form-item label="周期时间" prop="cycle">
        <el-input placeholder="请输入天数" v-model="cycleForm.cycle">
          <template slot="append">天</template>
        </el-input>
      </el-form-item>
      <el-form-item label="是否开启商品返现">
        <el-radio-group v-model="cycleForm.goods_model">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="reserveWithdrawCycle" :loading="loading">保存提现设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import * as API_distribution from '@/api/distribution'
    import { RegExp } from '~/ui-utils'
    export default {
      name: 'putforwardSettings',
      data() {
        const checkCycle = (rule, value, callback) => {
          if (!value && value !== 0) {
            return callback(new Error('周期天数不能为空'))
          }
          setTimeout(() => {
            if (!RegExp.integer.test(value) && parseInt(value) !== 0) {
              callback(new Error('请输入数字值'))
            } else {
              callback()
            }
          }, 1000)
        }
        return {
          /** 加载中。。。 */
          loading: false,

          /** 周期设置表单 */
          cycleForm: {
            /** 周期天数设置 */
            cycle: 1,

            /** 是否开启商品返现 */
            goods_model: 0
          },

          rules: {
            cycle: [
              { required: true, message: '', trigger: 'blur' },
              { validator: checkCycle, trigger: 'blur' }
            ]
          }
        }
      },
      mounted() {
        this.getWithdrawCycl()
      },
      methods: {
        /** 获取提现周期 */
        getWithdrawCycl() {
          API_distribution.getWithDrawSettings().then(response => {
            this.cycleForm = { ...response }
          })
        },
        /** 保存提现周期 */
        reserveWithdrawCycle() {
          this.loading = true
          this.$refs['cycleForm'].validate((valid) => {
            if (valid) {
              API_distribution.reserveWithDrawSettings(this.cycleForm).then(() => {
                this.$message.success('保存成功')
                this.loading = false
                this.getWithdrawCycl()
              })
            } else {
              this.loading = false
            }
          })
        }
      }
    }
</script>

<style type="text/scss" lang="scss" scoped>
  .el-form {
    background-color: #fff;
    padding: 10px;
    .el-input {
      width: 140px;
    }
  }
</style>
