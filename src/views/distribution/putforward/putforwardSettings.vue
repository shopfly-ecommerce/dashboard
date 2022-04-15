<template>
  <div>
    <el-form ref="cycleForm" :model="cycleForm" label-width="180px"  :rules="rules">
      <el-form-item label="Cycle time" prop="cycle">
        <el-input placeholder="Please enter days" v-model="cycleForm.cycle">
          <template slot="append">day</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Whether to open goods cash back">
        <el-radio-group v-model="cycleForm.goods_model">
          <el-radio :label="1">is</el-radio>
          <el-radio :label="0">no</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="reserveWithdrawCycle" :loading="loading">Save the withdrawal Settings</el-button>
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
            return callback(new Error('The period number of days cannot be empty'))
          }
          setTimeout(() => {
            if (!RegExp.integer.test(value) && parseInt(value) !== 0) {
              callback(new Error('Please enter a numeric value'))
            } else {
              callback()
            }
          }, 1000)
        }
        return {
          /** Loading... */
          loading: false,

          /** Cycle Settings Form*/
          cycleForm: {
            /** Cycle day setting*/
            cycle: 1,

            /** Whether to open goods cash back*/
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
        /** Gets the withdrawal period*/
        getWithdrawCycl() {
          API_distribution.getWithDrawSettings().then(response => {
            this.cycleForm = { ...response }
          })
        },
        /** Save the withdrawal period*/
        reserveWithdrawCycle() {
          this.loading = true
          this.$refs['cycleForm'].validate((valid) => {
            if (valid) {
              API_distribution.reserveWithDrawSettings(this.cycleForm).then(() => {
                this.$message.success('Save success')
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
