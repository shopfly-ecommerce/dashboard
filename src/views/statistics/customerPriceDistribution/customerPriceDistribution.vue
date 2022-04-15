<template>
  <div class="container">
    <el-card>
      <div slot="header" class="chart-header">
        <div class="chart-header-item">
          <span>Query cycle：</span>
          <en-year-month-picker @changed="handleYearMonthChanged" :disableddate="cur_tab === 'frequency'" :disabled="cur_tab === 'frequency'"/>
        </div>
        <div v-if="cur_tab === 'price'" class="chart-header-item">
          <span>A price range：</span>
          <en-price-range :default-range="priceRange" @changed="(range) => { priceRange = range }"/>
        </div>
      </div>
      <el-tabs v-model="cur_tab" type="card">
        <el-tab-pane label="Customer unit price distribution" name="price">
          <customer-price-distribution-price :params="params" :cur-tab="cur_tab" :price-range="priceRange"/>
        </el-tab-pane>
        <el-tab-pane label="Purchase time distribution" name="period">
          <customer-price-distribution-period :params="params" :cur-tab="cur_tab"/>
        </el-tab-pane>
        <el-tab-pane label="Purchase frequency analysis table" name="frequency">
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
