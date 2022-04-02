<template>
  <el-form :model="orderForm" ref="orderForm" label-width="130px" style="width: 500px;min-height: 500px;">
    <el-form-item label="自动取消订单天数">
      <el-input-number size="small" v-model="orderForm.cancel_order_day" :min="1"></el-input-number>
    </el-form-item>
    <el-form-item label="自动确认收货天数">
      <el-input-number size="small" v-model="orderForm.rog_order_day" :min="1"></el-input-number>
    </el-form-item>
    <el-form-item label="自动完成订单天数">
      <el-input-number size="small" v-model="orderForm.complete_order_day" :min="1"></el-input-number>
    </el-form-item>
    <el-form-item label="售后失效天数">
      <el-input-number size="small" v-model="orderForm.service_expired_day" :min="1"></el-input-number>
    </el-form-item>
    <el-form-item label="评价超时天数">
      <el-input-number size="small" v-model="orderForm.comment_order_day" :min="1"></el-input-number>
    </el-form-item>
    <el-form-item label="自动支付天数">
      <el-input-number size="small" v-model="orderForm.complete_order_pay" :min="1"></el-input-number>
      <p style="color: red;font-size: 12px;margin: 0">自动支付天数仅对货到付款的订单有效</p>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" @click="submitEditOrderSetting">保存设置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import * as API_Order from '@/api/order'

  export default {
    name: 'systemSettingsOrder',
    data() {
      return {
        /** 订单设置 */
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
      /** 获取订单设置数据 */
      API_Order.getOrderSettings().then(response => {
        Object.keys(this.orderForm).forEach(key => {
          this.orderForm[key] = response[key]
        })
      })
    },
    methods: {
      /** 提交订单设置表单 */
      submitEditOrderSetting() {
        API_Order.editOrderSettings(this.orderForm).then(() => {
          this.$message.success('修改成功！')
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
</style>
