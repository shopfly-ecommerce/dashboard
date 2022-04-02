<template>
  <div class="bg-shop-summary">
    <!--工具条-->
    <div class="btn-tools">
      <div class="conditions">
        <span>日期设置:</span>
        <en-year-month-picker size="mini" @changed="changeYearMonth"></en-year-month-picker>
      </div>
      <div class="conditions">
        <span>当前会员: {{ memberName }}</span>
      </div>
      <el-button class="btn-opera" size="mini" type="primary" @click="handleSearch">开始搜索</el-button>
      <el-button class="btn-opera" size="mini" type="success" @click="exportExcel">导出</el-button>
    </div>
    <!--图表-->
    <el-tabs v-model="chartName" type="card" @tab-click="handleClick">
      <el-tab-pane label="营业额统计" name="turnover"></el-tab-pane>
      <el-tab-pane label="利润额统计" name="profit"></el-tab-pane>
      <el-tab-pane label="订单数统计" name="orderNum"></el-tab-pane>
      <div id="chart" :style="{height: tableHeight + 'px'}"></div>
    </el-tabs>
  </div>
</template>

<script>
  import * as API_distribution from '@/api/distribution'
  export default {
    name: 'distributorStatistics',
    data() {
      return {
        /** 当前会员名 */
        memberName: this.$route.query.member_name,

        /** 当前标签名 */
        chartName: 'turnover',

        /** 列表loading状态 */
        loading: false,

        /** 图表参数*/
        params: {
          /** 会员id */
          member_id: this.$route.query.member_id,

          /** 当前选择的日期类型 */
          circle: 'YEAR',

          /** 年份 */
          year: '2018',

          /** 月份*/
          month: '6'
        },

        /** 当前数据 */
        currentChart: {},

        tableHeight: document.body.clientHeight / 2
      }
    },
    /*  created() {
      console.log(2, this.params)
      this.$route.query.isAmount === 1 ? this.chartName = 'turnover' : this.chartName = 'profit'
      this.$route.query.isAmount === 1 ? this.GET_OrderAmountChart() : this.GET_ProfitChart()
    }, */
    mounted() {
      window.onresize = this.countTableHeight
      this.$nextTick(() => {
        this.Chart = this.$echarts.init(document.getElementById('chart'))
      })
    },
    activated() {
      this.params = {
        ...this.params,
        member_id: this.$route.query.member_id
      }
      this.$route.query.isAmount === 1 ? this.chartName = 'turnover' : this.chartName = 'profit'
      this.$route.query.isAmount === 1 ? this.GET_OrderAmountChart() : this.GET_ProfitChart()
    },
    beforeRouteUpdate(to, from, next) {
      this.params = {
        ...this.params,
        member_id: this.$route.query.member_id
      }
      this.$route.query.isAmount === 1 ? this.chartName = 'turnover' : this.chartName = 'profit'
      this.$route.query.isAmount === 1 ? this.GET_OrderAmountChart() : this.GET_ProfitChart()
      next()
    },
    methods: {
      /** 窗口缩放时计算table高度 */
      countTableHeight() {
        this.tableHeight = document.body.clientHeight / 2
        /** 图表刷新 */
        setTimeout(this.Chart.resize)
      },

      /** 改变日期的回调*/
      changeYearMonth(obj) {
        this.params = {
          member_id: this.$route.query.member_id,

          circle: obj.type,

          year: obj.year
        }
        if (obj.type === 'MONTH') {
          this.params = {
            member_id: this.$route.query.member_id,

            circle: obj.type,

            year: obj.year,

            month: parseInt(obj.month)
          }
        }
      },

      /** 执行搜索 */
      handleSearch() {
        switch (this.chartName) {
          case 'profit':
            this.GET_ProfitChart()
            break
          case 'turnover':
            this.GET_OrderAmountChart()
            break
          case 'orderNum':
            this.GET_OrderCountChart()
            break
        }
      },

      /** 导出excel */
      exportExcel() {
        let json
        if (this.params.circle === 'YEAR') {
          switch (this.chartName) {
            case 'profit':
              json = {
                sheet_name: '利润额统计',
                sheet_values: this.currentChart.xAxis.map((item, index) => ({
                  '日期': item,
                  '利润额': this.currentChart.series.data[index]
                }))
              }
              break
            case 'turnover':
              json = {
                sheet_name: '营业额统计',
                sheet_values: this.currentChart.xAxis.map((item, index) => ({
                  '日期': item,
                  '营业额': this.currentChart.series.data[index]
                }))
              }
              break
            case 'orderNum':
              json = {
                sheet_name: '订单数量统计',
                sheet_values: this.currentChart.xAxis.map((item, index) => ({
                  '日期': item,
                  '订单数': this.currentChart.series.data[index]
                }))
              }
              break
          }
        } else {
          switch (this.chartName) {
            case 'profit':
              json = {
                sheet_name: '利润额统计',
                sheet_values: this.currentChart.xAxis.map((item, index) => ({
                  '日期': item,
                  '利润额': this.currentChart.series.data[index]
                }))
              }
              break
            case 'turnover':
              json = {
                sheet_name: '营业额统计',
                sheet_values: this.currentChart.xAxis.map((item, index) => ({
                  '日期': item,
                  '营业额': this.currentChart.series.data[index]
                }))
              }
              break
            case 'orderNum':
              json = {
                sheet_name: '订单数量统计',
                sheet_values: this.currentChart.xAxis.map((item, index) => ({
                  '日期': item,
                  '订单数': this.currentChart.series.data[index]
                }))
              }
              break
          }
        }
        this.MixinExportJosnToExcel(json, '销售统计')
      },

      /** 切换面板 */
      handleClick(tab, event) {
        this.chartName = tab.name
        switch (this.chartName) {
          case 'profit':
            this.GET_ProfitChart()
            break
          case 'turnover':
            this.GET_OrderAmountChart()
            break
          case 'orderNum':
            this.GET_OrderCountChart()
            break
        }
      },

      /** 获取利润额图表 */
      GET_ProfitChart() {
        API_distribution.getProfitChart(this.params).then(response => {
          this.currentChart = response
          this.RenderChart(response)
        })
      },

      /** 获取营业额图表 */
      GET_OrderAmountChart() {
        API_distribution.getOrderAmountChart(this.params).then(response => {
          this.currentChart = response
          this.RenderChart(response)
        })
      },

      /** 获取订单数图表 */
      GET_OrderCountChart() {
        API_distribution.getOrderCountChart(this.params).then(response => {
          this.currentChart = response
          this.RenderChart(response)
        })
      },

      /** 渲染图表 */
      RenderChart(response = {}) {
        this.Chart.setOption({
          title: { text: response.series.name, x: 'center' },
          tooltip: { trigger: 'axis' },
          legend: { show: true, orient: 'vertical', data: [{ name: '营业额' }], bottom: '10px' },
          color: ['#7CB5EC'],
          toolbox: {
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
            name: '营业额',
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          },
          series: [
            {
              type: 'line',
              data: response.series.data,
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
              }
            }
          ]
        })
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
  /*工具条*/
  div.btn-tools {
    margin: 0 30px 10px 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    .conditions {
      margin-right: 30px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      span {
        display: inline-block;
        margin-right: 10px;
        font-size: 14px;
        color: #606266;
      }
    }
    .btn-opera {
      margin-left: 10px;
    }
  }

</style>


