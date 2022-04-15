<template>
  <div class="bg-shop-summary">
    <div class="btn-tools">
      <div class="conditions">
        <span>The date set:</span>
        <en-year-month-picker size="mini" @changed="changeYearMonth"></en-year-month-picker>
      </div>
      <div class="conditions">
        <span>Set a price range:</span>
        <en-price-range @changed="changePriceRange"></en-price-range>
      </div>
      <el-button class="btn-opera" size="mini" type="primary" @click="handleSearch">Begin your search</el-button>
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
        /** The list ofloadingStatus*/
        loading: false,

        /** Chart parameters*/
        params: {
          /** The currently selected date type*/
          cycle_type: 'MONTH',

          /** year*/
          year: '2018',

          /** in*/
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
      /** Calculated when the window is zoomedtablehighly*/
      countTableHeight() {
        this.tableHeight = document.body.clientHeight / 2
        /** The chart to refresh*/
        setTimeout(this.priceListChart.resize)
        setTimeout(this.purchaseTimeChart.resize)
      },

      /** A callback that changes the date*/
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

      /** A price range*/
      changePriceRange(obj) {
        this.params = {
          ...this.params,
          ranges: obj
        }
      },

      /** Perform a search*/
      handleSearch() {
        this.GET_PriceStatistics()
      },

      GET_PriceStatistics() {
        API_buyAnyalysis.getbuyAnyalysisPeriodList(this.params).then(response => {
          this.purchaseTimeChart.setOption({
            title: { text: 'Purchase time distribution', x: 'center', subtext: 'Current period24Hourly total purchase distribution' },
            tooltip: { trigger: 'axis' },
            legend: { show: true, orient: 'vertical', data: [{ name: 'Order quantity' }], bottom: '10px' },
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
              name: 'hours',
              type: 'category',
              boundaryGap: false,
              data: response.xAxis
            },
            yAxis: {
              name: 'Order quantity（time）',
              type: 'value',
              axisLabel: {
                formatter: '{value} time'
              }
            },
            series: [
              {
                type: 'line',
                data: response.series.data,
                barWidth: 50,
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
        })
        API_buyAnyalysis.getbuyAnyalysisRangesList(this.params).then(response => {
          this.priceListChart.setOption({
            title: { text: 'Price list distribution', x: 'center' },
            tooltip: { trigger: 'axis' },
            legend: { show: true, orient: 'vertical', data: [{ name: 'Order quantity' }], bottom: '10px' },
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
              name: 'Price(USD)',
              type: 'category',
              boundaryGap: false,
              data: response.xAxis
            },
            yAxis: {
              name: 'Order quantity（time）',
              type: 'value',
              axisLabel: {
                formatter: '{value} time'
              }
            },
            series: [
              {
                type: 'line',
                data: response.series.data,
                barWidth: 50,
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


