<template>
  <div class="bg-shop-summary">
    <!--The toolbar-->
    <div class="btn-tools">
      <div class="conditions">
        <span>The date set:</span>
        <en-year-month-picker size="mini" @changed="changeYearMonth"></en-year-month-picker>
      </div>
      <div class="conditions">
        <span>The current members: {{ memberName }}</span>
      </div>
      <el-button class="btn-opera" size="mini" type="primary" @click="handleSearch">Begin your search</el-button>
      <el-button class="btn-opera" size="mini" type="success" @click="exportExcel">export</el-button>
    </div>
    <!--The chart-->
    <el-tabs v-model="chartName" type="card" @tab-click="handleClick">
      <el-tab-pane label="Turnover statistics" name="turnover"></el-tab-pane>
      <el-tab-pane label="Profit statistics" name="profit"></el-tab-pane>
      <el-tab-pane label="Order count" name="orderNum"></el-tab-pane>
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
        /** Current member name*/
        memberName: this.$route.query.member_name,

        /** Current tag name*/
        chartName: 'turnover',

        /** The list ofloadingStatus*/
        loading: false,

        /** Chart parameters*/
        params: {
          /** membersid */
          member_id: this.$route.query.member_id,

          /** The currently selected date type*/
          circle: 'YEAR',

          /** year*/
          year: '2018',

          /** in*/
          month: '6'
        },

        /** The current data*/
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
      /** Calculated when the window is zoomedtablehighly*/
      countTableHeight() {
        this.tableHeight = document.body.clientHeight / 2
        /** The chart to refresh*/
        setTimeout(this.Chart.resize)
      },

      /** A callback that changes the date*/
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

      /** Perform a search*/
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

      /** exportexcel */
      exportExcel() {
        let json
        if (this.params.circle === 'YEAR') {
          switch (this.chartName) {
            case 'profit':
              json = {
                sheet_name: 'Profit statistics',
                sheet_values: this.currentChart.xAxis.map((item, index) => ({
                  'The date of': item,
                  'Profit margin': this.currentChart.series.data[index]
                }))
              }
              break
            case 'turnover':
              json = {
                sheet_name: 'Turnover statistics',
                sheet_values: this.currentChart.xAxis.map((item, index) => ({
                  'The date of': item,
                  'turnover': this.currentChart.series.data[index]
                }))
              }
              break
            case 'orderNum':
              json = {
                sheet_name: 'Order quantity statistics',
                sheet_values: this.currentChart.xAxis.map((item, index) => ({
                  'The date of': item,
                  'orders': this.currentChart.series.data[index]
                }))
              }
              break
          }
        } else {
          switch (this.chartName) {
            case 'profit':
              json = {
                sheet_name: 'Profit statistics',
                sheet_values: this.currentChart.xAxis.map((item, index) => ({
                  'The date of': item,
                  'Profit margin': this.currentChart.series.data[index]
                }))
              }
              break
            case 'turnover':
              json = {
                sheet_name: 'Turnover statistics',
                sheet_values: this.currentChart.xAxis.map((item, index) => ({
                  'The date of': item,
                  'turnover': this.currentChart.series.data[index]
                }))
              }
              break
            case 'orderNum':
              json = {
                sheet_name: 'Order quantity statistics',
                sheet_values: this.currentChart.xAxis.map((item, index) => ({
                  'The date of': item,
                  'orders': this.currentChart.series.data[index]
                }))
              }
              break
          }
        }
        this.MixinExportJosnToExcel(json, 'Sales statistics')
      },

      /** Switch panel*/
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

      /** Get a profit chart*/
      GET_ProfitChart() {
        API_distribution.getProfitChart(this.params).then(response => {
          this.currentChart = response
          this.RenderChart(response)
        })
      },

      /** Obtain turnover chart*/
      GET_OrderAmountChart() {
        API_distribution.getOrderAmountChart(this.params).then(response => {
          this.currentChart = response
          this.RenderChart(response)
        })
      },

      /** Get an order number chart*/
      GET_OrderCountChart() {
        API_distribution.getOrderCountChart(this.params).then(response => {
          this.currentChart = response
          this.RenderChart(response)
        })
      },

      /** Render the chart*/
      RenderChart(response = {}) {
        this.Chart.setOption({
          title: { text: response.series.name, x: 'center' },
          tooltip: { trigger: 'axis' },
          legend: { show: true, orient: 'vertical', data: [{ name: 'turnover' }], bottom: '10px' },
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
            name: 'turnover',
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
                  { type: 'max', name: 'The maximum' },
                  { type: 'min', name: 'The minimum value' }
                ]
              },
              markLine: {
                data: [
                  { type: 'average', name: 'The average' }
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
  /*The toolbar*/
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


