<template>
  <div class="bg-shop-summary">
    <div>
      <el-button-group>
<!--        <el-button :type="currentStatistics == 1 ? 'primary' : ''" @click="handleShopSumaryStatistics" autofocus>Total store traffic</el-button>-->
        <el-button :type="currentStatistics == 2 ? 'primary' : ''" @click="handleGoodsStatistics">Product Flow ranking</el-button>
      </el-button-group>
      <en-year-month-picker @changed="changeYearMonth"></en-year-month-picker>
    </div>
    <div id="trafficStatistics" :style="{height: tableHeight + 'px'}"></div>
  </div>
</template>

<script>
  import * as API_trafficStatistics from '@/api/trafficStatistics'
  export default {
    name: 'trafficStatistics',
    data() {
      return {
        /** The list ofloadingStatus*/
        loading: false,

        /** Chart parameters*/
        params: {
          /** The currently selected date type*/
          cycle_type: 'YEAR',

          /** year*/
          year: '',

          /** in*/
          month: ''
        },

        /** The current traffic statistics graph1Total store traffic2Product Flow ranking*/
        currentStatistics: 1,

        /** Total store traffic*/
        shopSummaryStatistics: null,

        /** Page view of goodsTop30 */
        goodsStatistics: null,

        tableHeight: document.body.clientHeight / 2
      }
    },
    created() {
      this.handleGoodsStatistics()
    },
    mounted() {
      window.onresize = this.countTableHeight
      this.$nextTick(() => {
        this.sesalChart = this.$echarts.init(document.getElementById('trafficStatistics'))
      })
    },
    methods: {
      /** Calculated when the window is zoomedtablehighly*/
      countTableHeight() {
        this.tableHeight = document.body.clientHeight / 2
        /** The chart to refresh*/
        setTimeout(this.sesalChart.resize)
      },

      /** The callback that changes the date changes the parameter*/
      changeYearMonth(obj) {
        this.params = {
          cycle_type: obj.type,
          year: obj.year,
          month: obj.month
        }
        this.currentStatistics === 1 ? this.handleShopSumaryStatistics() : this.handleGoodsStatistics()
      },

      /** Total store traffic*/
      // handleShopSumaryStatistics() {
      //   this.currentStatistics = 1
      //   API_trafficStatistics.getShopTraffic(this.params).then(response => {
      //     this.loading = false
      //     this.sesalChart.setOption({
      // X: center, x: center,
      //       tooltip: {
      //         trigger: 'axis',
      //         show: true,
      //         formatter: function(params, ticket, callback) {
      //           if (response.series.localName[params[0].dataIndex] && params[0].value) {
      //             return `${params[0].seriesId.replace(/0/, '')}：${params[0].value}`
      //           }
      //         }
      //       },
      //       legend: { show: true, orient: 'vertical', data: [{ name: response.series.name, textStyle: { borderColor: '#7CB5EC' }}], bottom: '10px' },
      //       color: ['#7CB5EC'],
      //       toolbox: {
      //         show: true,
      //         right: 50,
      //         feature: {
      //           magicType: { type: ['line', 'bar'] },
      //           restore: {},
      //           saveAsImage: {}
      //         }
      //       },
      //       xAxis: {
      //         type: 'category',
      //         data: response.xAxis
      //       },
      //       yAxis: {
      // Name: page view ,
      //         type: 'value',
      //         axisLabel: {
      // The formatter: {value} time
      //         }
      //       },
      //       series: [
      //         {
      // Name: page view ,
      //           type: 'line',
      //           data: response.series.data,
      //           markPoint: {
      //             data: [
      // {type: Max , name: Max },
      // {type: min, name: min}
      //             ]
      //           },
      //           markLine: {
      //             data: [
      // {type: average, name: average}
      //             ]
      //           }
      //         }
      //       ]
      //     })
      //   })
      // },

      /** Product Flow ranking*/
      handleGoodsStatistics() {
        this.currentStatistics = 2
        API_trafficStatistics.getGoodsStatistics(this.params).then(response => {
          this.loading = false
          /** Page view of goodsTop30 */
          this.goodsStatistics = response
          this.sesalChart.setOption({
            title: { text: 'Page view of goodsTop30', x: 'center' },
            tooltip: {
              trigger: 'axis',
              show: true,
              formatter: function(params, ticket, callback) {
                if (response.series.localName[params[0].dataIndex] && params[0].value) {
                  return `Name:${response.series.localName[params[0].dataIndex]}<br>${params[0].seriesId.replace(/0/, '')}：${params[0].value}`
                }
              }
            },
            color: ['#7CB5EC'],
            toolbox: {
              show: true,
              right: 50,
              feature: {
                magicType: { type: ['bar', 'line'] },
                restore: {},
                saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              data: response.xAxis
            },
            yAxis: {
              name: 'traffic（time）',
              type: 'value',
              axisLabel: {
                formatter: '{value} time'
              }
            },
            series: [
              {
                type: 'bar',
                data: response.series.data,
                label: { show: true },
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

</style>

