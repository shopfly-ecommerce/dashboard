<template>
  <div class="bg-shop-summary">
    <div class="btn-tools">
      <div class="conditions">
        <span>日期设置:</span>
        <en-year-month-picker size="mini" @changed="changeYearMonth"></en-year-month-picker>
      </div>
      <div class="conditions">
        <span>设置价格区间:</span>
        <en-price-range @changed="changePriceRange"></en-price-range>
      </div>
      <el-button class="btn-opera" size="mini" type="primary" @click="handleSearch">开始搜索</el-button>
    </div>
    <div id="priceList" :style="{height: tableHeight + 'px'}"></div>
    <div id="purchaseTime" :style="{height: tableHeight + 'px'}"></div>
  </div>
</template>

<script>
  import * as API_buyAnyalysis from '@/api/buyAnyalysis'
  import { CategoryPicker } from '@/components'
  export default {
    name: 'buyAnalysis',
    components: {
      [CategoryPicker.name]: CategoryPicker
    },
    data() {
      return {
        /** 列表loading状态 */
        loading: false,

        /** 图表参数*/
        params: {
          /** 当前选择的日期类型 */
          cycle_type: 'MONTH',

          /** 年份 */
          year: '2018',

          /** 月份*/
          month: '6',

          ranges: []
        },

        tableHeight: document.body.clientHeight / 2
      }
    },
    mounted() {
      this.GET_PriceStatistics()
      window.onresize = this.countTableHeight
      this.$nextTick(() => {
        this.priceListChart = this.$echarts.init(document.getElementById('priceList'))
        this.purchaseTimeChart = this.$echarts.init(document.getElementById('purchaseTime'))
      })
    },
    methods: {
      /** 窗口缩放时计算table高度 */
      countTableHeight() {
        this.tableHeight = document.body.clientHeight / 2
        /** 图表刷新 */
        setTimeout(this.priceListChart.resize)
        setTimeout(this.purchaseTimeChart.resize)
      },

      /** 改变日期的回调*/
      changeYearMonth(obj) {
        this.params = {
          ...this.params,

          cycle_type: obj.type,

          year: obj.year
        }
        if (obj.type === 'MONTH') {
          this.params = {
            ...this.params,

            cycle_type: obj.type,

            year: obj.year,

            month: parseInt(obj.month)
          }
        }
      },

      /** 价格区间 */
      changePriceRange(obj) {
        this.params = {
          ...this.params,
          ranges: obj
        }
      },

      /** 执行搜索 */
      handleSearch() {
        this.GET_PriceStatistics()
      },

      GET_PriceStatistics() {
        API_buyAnyalysis.getbuyAnyalysisPeriodList(this.params).then(response => {
          this.purchaseTimeChart.setOption({
            title: { text: '购买时段分布', x: 'center', subtext: '当前时间段24小时购买总量分布' },
            tooltip: { trigger: 'axis' },
            legend: { show: true, orient: 'vertical', data: [{ name: '下单量' }], bottom: '10px' },
            color: ['#7CB5EC'],
            toolbox: {
              right: 50,
              feature: {
                magicType: { type: ['line', 'bar'] },
                restore: {},
                saveAsImage: {}
              }
            },
            xAxis: {
              name: '小时',
              type: 'category',
              boundaryGap: false,
              data: response.xAxis
            },
            yAxis: {
              name: '下单量（次）',
              type: 'value',
              axisLabel: {
                formatter: '{value} 次'
              }
            },
            series: [
              {
                type: 'line',
                data: response.series.data,
                barWidth: 50,
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
        })
        API_buyAnyalysis.getbuyAnyalysisRangesList(this.params).then(response => {
          this.priceListChart.setOption({
            title: { text: '客价单分布', x: 'center' },
            tooltip: { trigger: 'axis' },
            legend: { show: true, orient: 'vertical', data: [{ name: '下单量' }], bottom: '10px' },
            color: ['#7CB5EC'],
            toolbox: {
              right: 50,
              feature: {
                magicType: { type: ['line', 'bar'] },
                restore: {},
                saveAsImage: {}
              }
            },
            xAxis: {
              name: '价格(元)',
              type: 'category',
              boundaryGap: false,
              data: response.xAxis
            },
            yAxis: {
              name: '下单量（次）',
              type: 'value',
              axisLabel: {
                formatter: '{value} 次'
              }
            },
            series: [
              {
                type: 'line',
                data: response.series.data,
                barWidth: 50,
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

  div.btn-tools {
    margin-right: 30px;
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


