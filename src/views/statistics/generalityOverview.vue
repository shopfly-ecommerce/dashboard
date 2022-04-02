<template>
  <div class="bg-shop-summary">
    <ul>
      <li><span>近30天下单金额 </span>:<span>{{ shopSurvey.order_money }}</span></li>
      <li><span>近30天下单会员数</span>:<span>{{ shopSurvey.order_member }}</span></li>
      <li><span>近30天下单量</span>:<span>{{ shopSurvey.order_num }}</span></li>
      <li><span>近30天下单商品数</span>:<span>{{ shopSurvey.order_goods }}</span></li>
      <li><span>平均客单价</span>:<span>{{ shopSurvey.average_member_money }}</span></li>
    </ul>
    <ul>
      <li><span>平均价格</span>:<span>{{ shopSurvey.average_goods_money }}</span></li>
      <li><span>商品收藏量</span>:<span>{{ shopSurvey.goods_collect }}</span></li>
      <li><span>商品总数</span>:<span>{{ shopSurvey.total_goods }}</span></li>
      <li><span>下单高峰期</span>:<span>{{ shopSurvey.order_fastigium }}</span></li>
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
        /** 列表loading状态 */
        loading: false,

        /** 店铺概况*/
        shopSurvey: {},

        tableHeight: document.body.clientHeight / 3 * 2
      }
    },
    created() {
      // 获取店铺概况信息
      API_shopStatistics.getShopSurvey().then(response => {
        this.loading = false
        /** 店铺概况信息 */
        this.shopSurvey = response
      })
      // 获取图表信息
      API_shopStatistics.getShopSurveyCharts().then(response => {
        this.loading = false
        this.sesalChart.setOption({
          noDataLoadingOption: {
            text: '无数据',
            effect: 'bubble',
            effectOption: {
              effect: {
                n: 0
              }
            }
          },
          title: { text: '最近30天销售统计', x: 'center' },
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
            name: '日期',
            type: 'category',
            boundaryGap: false,
            data: response.xAxis.reverse()
          },
          yAxis: {
            name: '下单金额（元）',
            type: 'value'
          },
          series: [
            {
              name: '下单金额',
              type: 'line',
              data: response.series.data.reverse(),
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
    },
    mounted() {
      window.onresize = this.countTableHeight
      this.$nextTick(() => {
        this.sesalChart = this.$echarts.init(document.getElementById('salesStatistics'))
      })
    },
    methods: {
      /** 窗口缩放时计算table高度 */
      countTableHeight() {
        this.tableHeight = document.body.clientHeight / 3 * 2
        /** 图表刷新 */
        setTimeout(this.sesalChart.resize)
      },

      /** 获取最近30天日期信息 */
      GetDateStr(DayCount) {
        const dd = new Date()
        // 获取DayCount前的日期
        dd.setDate(dd.getDate() - DayCount)
        const y = dd.getFullYear()
        // 获取当前月份的日期
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
