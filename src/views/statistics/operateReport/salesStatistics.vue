<template>
  <div class="bg-shop-summary">
    <div class="tools-bar">
      <div class="conditions">
        <span>The date set: </span>
        <en-year-month-picker @changed="changeYearMonth"></en-year-month-picker>
      </div>
      <div class="conditions">
        <span >Amount：{{ order_total | unitPrice('¥')  }}</span>
        <span>The order quantity：{{ total_quantity_order }}</span>
      </div>
    </div>
    <br>
    <br>
    <el-tabs type="border-card" @tab-click="changeHotType">
      <el-tab-pane label="Order quantity">
        <div id="orderNum" :style="[{height:tableHeight + 'px'},{width:tableWidth+'px'}]"></div>
      </el-tab-pane>
      <el-tab-pane label="Place the order amount">
        <div id="orderAmount" :style="[{height:tableHeight + 'px'},{width:tableWidth+'px'}]"></div>
      </el-tab-pane>
    </el-tabs>
    <en-table-layout
      pagination
      :tableData="tableData"
      :loading="loading">
      <template slot="table-columns">
        <el-table-column prop="sn" label="Order no." />
        <el-table-column prop="buyer_name" label="buyers" />
        <el-table-column label="Create time">
          <template slot-scope="scope">
            {{ scope.row.create_time | unixToDate }}
          </template>
        </el-table-column>
        <el-table-column label="Status">
          <template slot-scope="scope">
            {{ scope.row.order_status }}
          </template>
        </el-table-column>
        <el-table-column label="The total order">
          <template slot-scope="scope">
            {{ scope.row.order_price | unitPrice('¥') }}
          </template>
        </el-table-column>
      </template>
      <el-pagination
        slot="pagination"
        v-if="pageData"
        key="orderGoodsNum"
        @size-change="handlePageSizeChange"
        @current-change="handlePageCurrentChange"
        :current-page="pageData.page_no"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageData.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.data_total">
      </el-pagination>
    </en-table-layout>
  </div>
</template>

<script>
  import * as API_salesStatistics from '@/api/salesStatistics'
  import { CategoryPicker } from '@/components'
  export default {
    name: 'salesStatistics',
    components: {
      [CategoryPicker.name]: CategoryPicker
    },
    data() {
      return {
        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          page_no: 1,

          page_size: 10,

          cycle_type: 'MONTH',

          year: '2018',

          month: '6'
        },

        /** Selling goods*/
        hotType: 0,

        /** The list of data*/
        tableData: [],

        /** List paging data*/
        pageData: [],

        /** Total order amount*/
        order_total: '',

        /** Order quantity*/
        total_quantity_order: '',

        tableHeight: document.body.clientHeight / 2,
        tableWidth: document.body.clientWidth - 250
      }
    },
    mounted() {
      this.GET_OrderTotaltChart()
      this.GET_OrderGoodsData()
      this.getSummary()
      window.onresize = this.countTableHeight
      this.$nextTick(() => {
        this.orderAmountChart = this.$echarts.init(document.getElementById('orderAmount'))
        this.orderGoodsNumChart = this.$echarts.init(document.getElementById('orderNum'))
      })
    },
    methods: {
      /** Get a summary of the data*/
      getSummary() {
        API_salesStatistics.getSalesStatisticsSummary(this.params).then(response => {
          this.order_total = response.order_price
          this.total_quantity_order = response.order_num
        })
      },

      /** A callback that changes the date*/
      changeYearMonth(obj) {
        this.params = {

          cycle_type: obj.type,

          year: obj.year,

          month: obj.month
        }
        this.hotType === 0 ? this.GET_OrderTotaltChart() : this.GET_OrderGoodsNumData()
        this.GET_OrderGoodsData()
        this.getSummary()
      },

      /** Calculated when the window is zoomedtablehighly*/
      countTableHeight() {
        if (navigator.userAgent.indexOf('Firefox') > 0) {
          this.tableHeight = document.documentElement.clientHeight / 2
          this.tableWidth = document.documentElement.clientWidth - 250
        } else {
          this.tableHeight = document.body.clientHeight / 2
          this.tableWidth = document.body.clientWidth - 250
        }
        if (this.orderGoodsNumChart) {
          setTimeout(this.orderGoodsNumChart.resize)
        }
        if (this.orderAmountChart) {
          setTimeout(this.orderAmountChart.resize)
        }
        this.$nextTick(() => {
          this.orderAmountChart = this.$echarts.init(document.getElementById('orderAmount'))
          this.orderGoodsNumChart = this.$echarts.init(document.getElementById('orderNum'))
        })
      },

      /** Triggered when switching panels*/
      changeHotType(target) {
        this.hotType = parseInt(target.paneName)
        if (parseInt(target.paneName) === 0) {
          this.GET_OrderTotaltChart()
        } else {
          this.GET_OrderGoodsNumData()
        }
        this.getSummary()
      },

      /** Order chart data*/
      GET_OrderTotaltChart() {
        this.loading = true
        API_salesStatistics.getSalesStatisticsNum(this.params).then(response => {
          this.loading = false
          if (this.orderGoodsNumChart) {
            this.orderGoodsNumChart.clear()
          }
          this.orderGoodsNumChart.setOption({
            title: { text: 'Order statistics', x: 'center' },
            tooltip: { trigger: 'axis' },
            legend: { data: [
              { name: response.series[0].name },
              { name: response.series[1].name }
            ], bottom: '10px' },
            color: ['#7CB5EC', '#526471'],
            toolbox: {
              show: true,
              right: 50,
              feature: {
                magicType: { type: ['line', 'bar'] },
                restore: {},
                saveAsImage: {}
              }
            },
            xAxis: {
              name: 'The date of',
              type: 'category',
              data: response.xAxis
            },
            yAxis: {
              name: 'Order quantity',
              type: 'value',
              axisLabel: {
                formatter: '{value}'
              }
            },
            series: [
              {
                name: response.series[0].name,
                type: 'line',
                data: response.series[0].data,
                markPoint: {
                  data: [
                    { type: 'max', name: 'The maximum' },
                    { type: 'min', name: 'The minimum value' }
                  ]
                },
                markLine: {
                  data: [
                    { type: 'average', name: 'The average' }
                  ]
                },
                barGap: '0'
              },
              {
                name: response.series[1].name,
                type: 'line',
                data: response.series[1].data,
                markPoint: {
                  data: [
                    { type: 'max', name: 'The maximum' },
                    { type: 'min', name: 'The minimum value' }
                  ]
                },
                markLine: {
                  data: [
                    { type: 'average', name: 'The average' }
                  ]
                },
                barGap: '0'
              }
            ]
          })
        })
        this.countTableHeight()
      },

      /** Chart data of order amount*/
      GET_OrderGoodsNumData() {
        this.loading = true
        API_salesStatistics.getSalesStatisticsMoney(this.params).then(response => {
          this.loading = false
          if (this.orderAmountChart) {
            this.orderAmountChart.clear()
          }
          this.orderAmountChart.setOption({
            title: { text: 'Order amount statistics', x: 'center' },
            tooltip: { trigger: 'axis' },
            legend: { data: [
              { name: response.series[0].name },
              { name: response.series[1].name }
            ], bottom: '10px' },
            color: ['#7CB5EC', '#526471'],
            toolbox: {
              show: true,
              right: 50,
              feature: {
                magicType: { type: ['line', 'bar'] },
                restore: {},
                saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: response.xAxis
            },
            yAxis: {
              name: 'Place the order amount（USD）',
              type: 'value',
              axisLabel: {
                formatter: '{value}'
              }
            },
            series: [
              {
                name: response.series[0].name,
                type: 'line',
                data: response.series[0].data,
                markPoint: {
                  data: [
                    { type: 'max', name: 'The maximum' },
                    { type: 'min', name: 'The minimum value' }
                  ]
                },
                markLine: {
                  data: [
                    { type: 'average', name: 'The average' }
                  ]
                },
                barGap: '0'
              },
              {
                name: response.series[1].name,
                type: 'line',
                data: response.series[1].data,
                markPoint: {
                  data: [
                    { type: 'max', name: 'The maximum' },
                    { type: 'min', name: 'The minimum value' }
                  ]
                },
                markLine: {
                  data: [
                    { type: 'average', name: 'The average' }
                  ]
                },
                barGap: '0'
              }
            ]
          })
        })
        this.countTableHeight()
      },

      /** Tabular data*/
      GET_OrderGoodsData() {
        this.loading = true
        API_salesStatistics.getSalesStatisticsGoodsList(this.params).then(response => {
          this.loading = false
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
          /** A list of information*/
          this.tableData = response.data
        })
        this.countTableHeight()
      },

      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        if (this.hotType === 0) {
          this.GET_OrderTotaltChart()
        } else {
          this.GET_OrderGoodsNumData()
        }
        this.GET_OrderGoodsData()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        if (this.hotType === 0) {
          this.GET_OrderTotaltChart()
        } else {
          this.GET_OrderGoodsNumData()
        }
        this.GET_OrderGoodsData()
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .bg-shop-summary {
    margin: 15px;
    padding: 15px;
    background-color: #fff;
    border: 1px solid #9a9a9a;
    p {
      margin: 15px 0;
      text-align: left;
    }
  }
  /deep/ .el-table td:not(.is-left) {
    text-align: center;
  }

  div.tools-bar {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    div {
      span {
        display: inline-block;
        font-size: 14px;
        color: #606266;
      }
    }
    .conditions {
      margin-right: 30px;
    }
    .search-btn {
      margin-left: 10px;
    }
  }

</style>

