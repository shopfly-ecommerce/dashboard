<template>
  <el-form :model="orderForm" ref="orderForm" label-width="130px" style="width: 500px;min-height: 500px;">
    <el-form-item label="Number of days of automatic cancellation">
      <el-input-number size="small" v-model="orderForm.cancel_order_day" :min="1"></el-input-number>
    </el-form-item>
    <el-form-item label="Automatic confirmation of receiving days">
      <el-input-number size="small" v-model="orderForm.rog_order_day" :min="1"></el-input-number>
    </el-form-item>
    <el-form-item label="Automatic order completion days">
      <el-input-number size="small" v-model="orderForm.complete_order_day" :min="1"></el-input-number>
    </el-form-item>
    <el-form-item label="Number of days after sale">
      <el-input-number size="small" v-model="orderForm.service_expired_day" :min="1"></el-input-number>
    </el-form-item>
    <el-form-item label="Evaluate timeout days">
      <el-input-number size="small" v-model="orderForm.comment_order_day" :min="1"></el-input-number>
    </el-form-item>
    <el-form-item label="Automatic payment days">
      <el-input-number size="small" v-model="orderForm.complete_order_pay" :min="1"></el-input-number>
      <p style="color: red;font-size: 12px;margin: 0">Automatic payment days are only valid for orders with cash on delivery</p>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" @click="submitEditOrderSetting">Save Settings</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import * as API_Order from '@/api/order'

  export default {
    name: 'systemSettingsOrder',
    data() {
      return {
        /** Order*/
        orderForm: {
          cancel_order_day: 1,
          rog_order_day: 10,
          comment_order_day: 15,
          service_expired_day: 30,
          complete_order_day: 7,
          complete_order_pay: 3
        }
      }
    },
    mounted() {
      /** Gets the order setting data*/
      API_Order.getOrderSettings().then(response => {
        Object.keys(this.orderForm).forEach(key => {
          this.orderForm[key] = response[key]
        })
      })
    },
    methods: {
      /** Submit the order setting form*/
      submitEditOrderSetting() {
        API_Order.editOrderSettings(this.orderForm).then(() => {
          this.$message.success('Modify the success！')
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
</style>
