<template>
  <div class="container">
    <el-card>
      <div slot="header" class="chart-header">
        <div class="chart-header-item">
          <span>Query cycle：</span>
          <en-year-month-picker @changed="handleYearMonthChanged"/>
        </div>
      </div>
      <el-tabs v-model="cur_tab" type="card">
        <el-tab-pane label="The order quantity" name="order">
          <order-amount-order :params="params" :cur-tab="cur_tab"/>
        </el-tab-pane>
        <el-tab-pane label="Order quantity" name="goods">
          <order-amount-goods :params="params" :cur-tab="cur_tab"/>
        </el-tab-pane>
        <el-tab-pane label="Amount" name="price">
          <order-amount-price :params="params" :cur-tab="cur_tab"/>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import orderAmountOrder from './orderAmountOrder'
  import orderAmountGoods from './orderAmountGoods'
  import orderAmountPrice from './orderAmountPrice'

  export default {
    name: 'orderAmount',
    components: {
      OrderAmountOrder: orderAmountOrder,
      OrderAmountGoods: orderAmountGoods,
      OrderAmountPrice: orderAmountPrice
    },
    data() {
      return {
        cur_tab: 'order',
        params: {
          year: '',
          month: '',
          cycle_type: 'MONTH'
        }
      }
    },
    methods: {
      /** The months of the year change*/
      handleYearMonthChanged(object) {
        this.params.year = object.year
        this.params.month = object.month
        this.params.cycle_type = object.type
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .container {
    background-color: #fff;
    padding: 10px;
  }
  .chart-header {
    padding: 0 10px;
  }
  .chart-header-item {
    display: inline-block;
    margin-right: 30px;
  }
  .tab-chart {
    height: 300px;
  }
</style>
