<template>
  <div class="bg-shop-summary">
    <ul>
      <li><span>nearly30World order amount</span>:<span>{{ shopSurvey.order_money }}</span></li>
      <li><span>nearly30Number of single members worldwide</span>:<span>{{ shopSurvey.order_member }}</span></li>
      <li><span>nearly30All the orders</span>:<span>{{ shopSurvey.order_num }}</span></li>
      <li><span>nearly30Number of single goods in the world</span>:<span>{{ shopSurvey.order_goods }}</span></li>
      <li><span>Average customer unit price</span>:<span>{{ shopSurvey.average_member_money }}</span></li>
    </ul>
    <ul>
      <li><span>The average price</span>:<span>{{ shopSurvey.average_goods_money }}</span></li>
      <li><span>Merchandise collection</span>:<span>{{ shopSurvey.goods_collect }}</span></li>
      <li><span>The total number of goods</span>:<span>{{ shopSurvey.total_goods }}</span></li>
      <li><span>Rush hour</span>:<span>{{ shopSurvey.order_fastigium }}</span></li>
    </ul>
    <div>
      <div ref="salesStatistics" id="salesStatistics" :style="{height: tableHeight + 'px'}"></div>
    </div>
  </div>
</template>

<script>
  import * as API_shopStatistics from '@/api/shopStatistics'
  export default {
    name: 'generalityOverview',
    data() {
      return {
        /** The list ofloadingStatus*/
        loading: false,

        /** Store profile*/
        shopSurvey: {},

        tableHeight: document.body.clientHeight / 3 * 2
      }
    },
    created() {
      // Get store profile information
      API_shopStatistics.getShopSurvey().then(response => {
        this.loading = false
        /** Store Profile Information*/
        this.shopSurvey = response
      })
      // Get chart information
      API_shopStatistics.getShopSurveyCharts().then(response => {
        this.loading = false
        this.sesalChart.setOption({
          noDataLoadingOption: {
            text: 'No data',
            effect: 'bubble',
            effectOption: {
              effect: {
                n: 0
              }
            }
          },
          title: { text: 'Recently,30Daily sales statistics', x: 'center' },
          tooltip: { trigger: 'axis' },
          legend: { orient: 'vertical', data: [{ name: response.series.name, textStyle: { borderColor: '#7CB5EC' }}], bottom: '10px' },
          color: ['#7CB5EC'],
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
            boundaryGap: false,
            data: response.xAxis.reverse()
          },
          yAxis: {
            name: 'Place the order amount（USD）',
            type: 'value'
          },
          series: [
            {
              name: 'Place the order amount',
              type: 'line',
              data: response.series.data.reverse(),
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
    },
    mounted() {
      window.onresize = this.countTableHeight
      this.$nextTick(() => {
        this.sesalChart = this.$echarts.init(document.getElementById('salesStatistics'))
      })
    },
    methods: {
      /** Calculated when the window is zoomedtablehighly*/
      countTableHeight() {
        this.tableHeight = document.body.clientHeight / 3 * 2
        /** The chart to refresh*/
        setTimeout(this.sesalChart.resize)
      },

      /** For the recent30Day date information*/
      GetDateStr(DayCount) {
        const dd = new Date()
        // Gets the date before DayCount
        dd.setDate(dd.getDate() - DayCount)
        const y = dd.getFullYear()
        // Gets the date of the current month
        const m = dd.getMonth() + 1
        var d = dd.getDate()
        return y + '-' + m + '-' + d
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
    ul {
      padding: 0 10px;
      width: 100%;
      overflow: hidden;
      li {
        margin: 0;
        padding: 0;
        width: 20%;
        float: left;
        line-height: 30px;
        list-style: none;
        span {
          word-break:break-all;
          font-size: 14px;
        }
      }
    }
  }

</style>
