<template>
  <div class="bg-shop-summary">
    <div>
      <el-button-group>
<!--        <el-button :type="currentStatistics == 1 ? 'primary' : ''" @click="handleShopSumaryStatistics" autofocus>店铺总流量</el-button>-->
        <el-button :type="currentStatistics == 2 ? 'primary' : ''" @click="handleGoodsStatistics">商品流量排行</el-button>
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
        /** 列表loading状态 */
        loading: false,

        /** 图表参数*/
        params: {
          /** 当前选择的日期类型 */
          cycle_type: 'YEAR',

          /** 年份 */
          year: '',

          /** 月份*/
          month: ''
        },

        /** 当前访问的流量统计图 1店铺总流量 2商品流量排行*/
        currentStatistics: 1,

        /** 店铺总流量 */
        shopSummaryStatistics: null,

        /** 商品访问量Top30 */
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
      /** 窗口缩放时计算table高度 */
      countTableHeight() {
        this.tableHeight = document.body.clientHeight / 2
        /** 图表刷新 */
        setTimeout(this.sesalChart.resize)
      },

      /** 改变日期的回调 更改参数*/
      changeYearMonth(obj) {
        this.params = {
          cycle_type: obj.type,
          year: obj.year,
          month: obj.month
        }
        this.currentStatistics === 1 ? this.handleShopSumaryStatistics() : this.handleGoodsStatistics()
      },

      /** 店铺总流量*/
      // handleShopSumaryStatistics() {
      //   this.currentStatistics = 1
      //   API_trafficStatistics.getShopTraffic(this.params).then(response => {
      //     this.loading = false
      //     this.sesalChart.setOption({
      //       title: { text: '访问量统计', x: 'center' },
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
      //         name: '访问量（次）',
      //         type: 'value',
      //         axisLabel: {
      //           formatter: '{value} 次'
      //         }
      //       },
      //       series: [
      //         {
      //           name: '访问量',
      //           type: 'line',
      //           data: response.series.data,
      //           markPoint: {
      //             data: [
      //               { type: 'max', name: '最大值' },
      //               { type: 'min', name: '最小值' }
      //             ]
      //           },
      //           markLine: {
      //             data: [
      //               { type: 'average', name: '平均值' }
      //             ]
      //           }
      //         }
      //       ]
      //     })
      //   })
      // },

      /** 商品流量排行*/
      handleGoodsStatistics() {
        this.currentStatistics = 2
        API_trafficStatistics.getGoodsStatistics(this.params).then(response => {
          this.loading = false
          /** 商品访问量Top30 */
          this.goodsStatistics = response
          this.sesalChart.setOption({
            title: { text: '商品访问量Top30', x: 'center' },
            tooltip: {
              trigger: 'axis',
              show: true,
              formatter: function(params, ticket, callback) {
                if (response.series.localName[params[0].dataIndex] && params[0].value) {
                  return `商品名称:${response.series.localName[params[0].dataIndex]}<br>${params[0].seriesId.replace(/0/, '')}：${params[0].value}`
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
              name: '访问量（次）',
              type: 'value',
              axisLabel: {
                formatter: '{value} 次'
              }
            },
            series: [
              {
                type: 'bar',
                data: response.series.data,
                label: { show: true },
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

</style>

