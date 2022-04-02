<template>
  <div class="bg-shop-summary">
    <div class="toolbar-btns">
      <div class="conditions">
        <span>日期设置:</span>
        <en-year-month-picker @changed="changeYearMonth"></en-year-month-picker>
      </div>
      <div class="conditions">
        <span>平台商品分类：</span>
        <en-category-picker
          size="mini"
          :api="api"
          :props="props"
          @changed="changeGoodsCateGory"
          :clearable='true'/>
      </div>
      <div class="conditions">
        <span>价格设置:</span>
        <en-price-range @changed="changePriceRange"/>
      </div>
      <div class="conditions">
        <el-button type="primary" @click="handleSearch" size="mini">开始搜索</el-button>
      </div>
    </div>
    <div id="trafficStatistics" :style="{height: tableHeight + 'px'}"></div>
  </div>
</template>

<script>
  import * as API_goodsPriceStatistics from '@/api/goodsPriceStatistics'
  import { CategoryPicker } from '@/components'
  export default {
    name: 'goodsPriceSales',
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

          /** 商品分类ID */
          category_id: '',

          /** 价格区间 默认区间*/
          sections: []
        },

        /** 分类请求api */
        api: 'seller/goods/category/1/children',

        /** 映射属性 */
        props: {
          value: 'category_id',
          label: 'name',
          children: 'children',
          disabled: 'disabled'
        },

        tableHeight: document.body.clientHeight / 2
      }
    },
    mounted() {
      this.GET_PriceStatistics()
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

      /**  分类选择组件值发生改变 */
      changeGoodsCateGory(data) {
        if (data[data.length - 1]) {
          this.params.category_id = parseInt(data[data.length - 1])
        } else {
          this.params.category_id = 0
        }
      },

      /** 改变日期的回调*/
      changeYearMonth(obj) {
        this.params = {
          /** 当前选择的日期类型 */
          cycle_type: obj.type,

          /** 年份 */
          year: obj.year,

          /** 月份*/
          month: obj.month
        }
      },

      /** 价格区间 */
      changePriceRange(obj) {
        this.params = {
          ...this.params,
          sections: obj
        }
      },

      /** 执行搜索 */
      handleSearch() {
        this.GET_PriceStatistics()
      },

      GET_PriceStatistics() {
        API_goodsPriceStatistics.getPriceStatisticsList(this.params).then(response => {
          this.loading = false
          this.sesalChart.setOption({
            title: { text: '价格销量分析', x: 'center' },
            tooltip: {
              trigger: 'axis',
              show: true,
              formatter: function(params, ticket, callback) {
                if (params[0].name && params[0].value) {
                  return `价格:${params[0].name}<br>${params[0].seriesId.replace(/0/, '')}：${params[0].value}`
                }
              }
            },
            legend: { show: true, orient: 'vertical', data: [{ name: response.series.name, textStyle: { borderColor: '#7CB5EC' }}], bottom: '10px' },
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
              name: '价格（元）',
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
                name: '下单量',
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

  div.toolbar-btns {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
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
  }

</style>


