<template>
  <div class="container">
    <el-card>
      <div slot="header" class="chart-header">
        <div class="chart-header-item">
          <span>查询周期：</span>
          <en-year-month-picker @changed="handleYearMonthChanged" :disableddate="cur_tab === 'frequency'" :disabled="cur_tab === 'frequency'"/>
        </div>
        <div v-if="cur_tab === 'price'" class="chart-header-item">
          <span>价格区间：</span>
          <en-price-range :default-range="priceRange" @changed="(range) => { priceRange = range }"/>
        </div>
      </div>
      <el-tabs v-model="cur_tab" type="card">
        <el-tab-pane label="客单价分布" name="price">
          <customer-price-distribution-price :params="params" :cur-tab="cur_tab" :price-range="priceRange"/>
        </el-tab-pane>
        <el-tab-pane label="购买时段分布" name="period">
          <customer-price-distribution-period :params="params" :cur-tab="cur_tab"/>
        </el-tab-pane>
        <el-tab-pane label="购买频次分析表" name="frequency">
          <customer-price-distribution-frequency :params="params" :cur-tab="cur_tab"/>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import CustomerPriceDistributionPrice from './customerPriceDistributionPrice'
  import CustomerPriceDistributionPeriod from './customerPriceDistributionPeriod'
  import CustomerPriceDistributionFrequency from './customerPriceDistributionFrequency'

  export default {
    name: 'customerPriceDistribution',
    components: {
      CustomerPriceDistributionPrice,
      CustomerPriceDistributionPeriod,
      CustomerPriceDistributionFrequency
    },
    data() {
      return {
        cur_tab: 'price',
        params: {
          year: '',
          month: '',
          cycle_type: 'MONTH'
        },
        priceRange: [[0, 100], [100, 1000], [1000, 10000], [10000, 50000]]
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
