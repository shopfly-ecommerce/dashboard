<template>
  <div class="container">
    <el-card>
      <div slot="header" class="chart-header">
        <div class="chart-header-item">
          <span>Category</span>
          <en-category-picker clearable @changed="(category) => { params.category_id = category.category_id || 0 }"/>
        </div>
        <div class="chart-header-item">
          <span>Query cycle：</span>
          <en-year-month-picker disableddate @changed="handleYearMonthChanged"/>
        </div>
      </div>
      <en-table-layout
        :toolbar="false"
        :tableData="tableData.data"
        :loading="loading"
      >
        <template slot="table-columns">
          <el-table-column prop="category_name" label="name"/>
          <el-table-column prop="avg_price" :formatter="MixinFormatPrice" label="The average price"/>
          <el-table-column prop="sold_goods_num" label="The number of goods sold"/>
          <el-table-column prop="sold_num" label="sales"/>
          <el-table-column prop="sales_money" label="sales"/>
          <el-table-column prop="goods_total_num" label="The total number of goods"/>
          <el-table-column prop="nosales_goods_num" label="Number of items not sold"/>
        </template>
      </en-table-layout>
    </el-card>
  </div>
</template>

<script>
  import * as API_Statistics from '@/api/industryAnalysis'

  export default {
    name: 'generalityOverview',
    data() {
      return {
        /** The list ofloadingStatus*/
        loading: false,
        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10,
          year: '',
          month: '',
          cycle_type: 'MONTH',
          category_id: 0
        },
        /** The list of data*/
        tableData: []
      }
    },
    watch: {
      params: {
        immediate: true,
        deep: true,
        handler: 'GET_GeneralityOverview'
      }
    },
    methods: {
      /** The months of the year change*/
      handleYearMonthChanged(object) {
        this.params.year = object.year
        this.params.month = object.month
        this.params.cycle_type = object.type
      },
      /** Get the summary overview data*/
      GET_GeneralityOverview() {
        this.loading = true
        API_Statistics.getGeneralityOverviewData(this.params).then(response => {
          this.loading = false
          this.tableData = response
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .container {
    background-color: #fff;
    padding: 10px;
    /deep/ .el-card__body {
      padding-top: 0;
    }
    /deep/ .container {
      padding: 0;
    }
  }
  .chart-header {
    padding: 0 10px;
  }
  .chart-header-item {
    display: inline-block;
    margin-right: 30px;
  }
</style>
