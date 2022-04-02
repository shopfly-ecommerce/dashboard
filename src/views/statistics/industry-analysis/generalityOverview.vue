<template>
  <div class="container">
    <el-card>
      <div slot="header" class="chart-header">
        <div class="chart-header-item">
          <span>商品分类</span>
          <en-category-picker clearable @changed="(category) => { params.category_id = category.category_id || 0 }"/>
        </div>
        <div class="chart-header-item">
          <span>查询周期：</span>
          <en-year-month-picker disableddate @changed="handleYearMonthChanged"/>
        </div>
      </div>
      <en-table-layout
        :toolbar="false"
        :tableData="tableData.data"
        :loading="loading"
      >
        <template slot="table-columns">
          <el-table-column prop="category_name" label="分类名称"/>
          <el-table-column prop="avg_price" :formatter="MixinFormatPrice" label="平均价格"/>
          <el-table-column prop="sold_goods_num" label="有销量商品数"/>
          <el-table-column prop="sold_num" label="销量"/>
          <el-table-column prop="sales_money" label="销售额"/>
          <el-table-column prop="goods_total_num" label="商品总数"/>
          <el-table-column prop="nosales_goods_num" label="无销量商品数"/>
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
        /** 列表loading状态 */
        loading: false,
        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10,
          year: '',
          month: '',
          cycle_type: 'MONTH',
          category_id: 0
        },
        /** 列表数据 */
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
      /** 年月份发生变化 */
      handleYearMonthChanged(object) {
        this.params.year = object.year
        this.params.month = object.month
        this.params.cycle_type = object.type
      },
      /** 获取概括总览数据 */
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
