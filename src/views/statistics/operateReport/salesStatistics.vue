<template>
  <div class="bg-shop-summary">
    <div class="tools-bar">
      <div class="conditions">
        <span>日期设置: </span>
        <en-year-month-picker @changed="changeYearMonth"></en-year-month-picker>
      </div>
      <div class="conditions">
        <span >订单金额：{{ order_total | unitPrice('¥')  }}</span>
        <span>订单量：{{ total_quantity_order }}</span>
      </div>
    </div>
    <br>
    <br>
    <el-tabs type="border-card" @tab-click="changeHotType">
      <el-tab-pane label="下单量">
        <div id="orderNum" :style="[{height:tableHeight + 'px'},{width:tableWidth+'px'}]"></div>
      </el-tab-pane>
      <el-tab-pane label="下单金额">
        <div id="orderAmount" :style="[{height:tableHeight + 'px'},{width:tableWidth+'px'}]"></div>
      </el-tab-pane>
    </el-tabs>
    <en-table-layout
      pagination
      :tableData="tableData"
      :loading="loading">
      <template slot="table-columns">
        <el-table-column prop="sn" label="订单编号" />
        <el-table-column prop="buyer_name" label="买家" />
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | unixToDate }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态">
          <template slot-scope="scope">
            {{ scope.row.order_status }}
          </template>
        </el-table-column>
        <el-table-column label="订单总额">
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
        /** 列表loading状态 */
        loading: false,

        /** 列表参数 */
        params: {
          page_no: 1,

          page_size: 10,

          cycle_type: 'MONTH',

          year: '2018',

          month: '6'
        },

        /** 热卖商品*/
        hotType: 0,

        /** 列表数据 */
        tableData: [],

        /** 列表分页数据 */
        pageData: [],

        /** 订单总金额*/
        order_total: '',

        /** 下单量*/
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
      /** 获取数据小结 */
      getSummary() {
        API_salesStatistics.getSalesStatisticsSummary(this.params).then(response => {
          this.order_total = response.order_price
          this.total_quantity_order = response.order_num
        })
      },

      /** 改变日期的回调*/
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

      /** 窗口缩放时计算table高度 */
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

      /** 切换面板时触发 */
      changeHotType(target) {
        this.hotType = parseInt(target.paneName)
        if (parseInt(target.paneName) === 0) {
          this.GET_OrderTotaltChart()
        } else {
          this.GET_OrderGoodsNumData()
        }
        this.getSummary()
      },

      /** 下单量图表数据*/
      GET_OrderTotaltChart() {
        this.loading = true
        API_salesStatistics.getSalesStatisticsNum(this.params).then(response => {
          this.loading = false
          if (this.orderGoodsNumChart) {
            this.orderGoodsNumChart.clear()
          }
          this.orderGoodsNumChart.setOption({
            title: { text: '下单量统计', x: 'center' },
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
              name: '日期',
              type: 'category',
              data: response.xAxis
            },
            yAxis: {
              name: '下单量',
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
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' }
                  ]
                },
                markLine: {
                  data: [
                    { type: 'average', name: '平均值' }
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
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' }
                  ]
                },
                markLine: {
                  data: [
                    { type: 'average', name: '平均值' }
                  ]
                },
                barGap: '0'
              }
            ]
          })
        })
        this.countTableHeight()
      },

      /** 下单金额图表数据*/
      GET_OrderGoodsNumData() {
        this.loading = true
        API_salesStatistics.getSalesStatisticsMoney(this.params).then(response => {
          this.loading = false
          if (this.orderAmountChart) {
            this.orderAmountChart.clear()
          }
          this.orderAmountChart.setOption({
            title: { text: '下单金额统计', x: 'center' },
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
              name: '下单金额（元）',
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
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' }
                  ]
                },
                markLine: {
                  data: [
                    { type: 'average', name: '平均值' }
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
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' }
                  ]
                },
                markLine: {
                  data: [
                    { type: 'average', name: '平均值' }
                  ]
                },
                barGap: '0'
              }
            ]
          })
        })
        this.countTableHeight()
      },

      /** 表格数据*/
      GET_OrderGoodsData() {
        this.loading = true
        API_salesStatistics.getSalesStatisticsGoodsList(this.params).then(response => {
          this.loading = false
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
          /** 列表信息 */
          this.tableData = response.data
        })
        this.countTableHeight()
      },

      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        if (this.hotType === 0) {
          this.GET_OrderTotaltChart()
        } else {
          this.GET_OrderGoodsNumData()
        }
        this.GET_OrderGoodsData()
      },

      /** 分页页数发生改变 */
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

