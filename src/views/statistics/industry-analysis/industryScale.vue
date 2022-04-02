<template>
  <div class="container">
    <el-card>
      <div slot="header" class="chart-header">
        <div class="chart-header-item">
          <span>查询周期：</span>
          <en-year-month-picker @changed="handleYearMonthChanged"/>
        </div>
      </div>
      <el-tabs v-model="cur_tab" type="card">
        <el-tab-pane label="下单量" name="order">
          <industry-scale-order :params="params" :cur-tab="cur_tab"/>
        </el-tab-pane>
        <el-tab-pane label="下单商品数量" name="goods">
          <industry-scale-goods :params="params" :cur-tab="cur_tab"/>
        </el-tab-pane>
        <el-tab-pane label="下单金额" name="price">
          <industry-scale-price :params="params" :cur-tab="cur_tab"/>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import industryScaleOrder from './industryScaleOrder'
  import industryScaleGoods from './industryScaleGoods'
  import industryScalePrice from './industryScalePrice'

  export default {
    name: 'industryScale',
    components: {
      IndustryScaleOrder: industryScaleOrder,
      IndustryScaleGoods: industryScaleGoods,
      IndustryScalePrice: industryScalePrice
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
      /** 年月份发生变化 */
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
