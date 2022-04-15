<template>
  <div class="bg-shop-summary">
    <div class="toolbar-btns">
      <div class="conditions">
        <span>The date set:</span>
        <en-year-month-picker @changed="changeYearMonth"></en-year-month-picker>
      </div>
      <div class="conditions">
        <span>Platform commodity classification：</span>
        <en-category-picker
          size="mini"
          :api="api"
          :props="props"
          @changed="changeGoodsCateGory"
          :clearable='true'/>
      </div>
      <div class="conditions">
        <span>The price set:</span>
        <en-price-range @changed="changePriceRange"/>
      </div>
      <div class="conditions">
        <el-button type="primary" @click="handleSearch" size="mini">Begin your search</el-button>
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

          /** CategoryID */
          category_id: '',

          /** Price range Default price range*/
          sections: []
        },

        /** Classification requestapi */
        api: 'seller/goods/category/1/children',

        /** Mapping attributes*/
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
      /** Calculated when the window is zoomedtablehighly*/
      countTableHeight() {
        this.tableHeight = document.body.clientHeight / 2
        /** The chart to refresh*/
        setTimeout(this.sesalChart.resize)
      },

      /**  The value of the category selection component has changed*/
      changeGoodsCateGory(data) {
        if (data[data.length - 1]) {
          this.params.category_id = parseInt(data[data.length - 1])
        } else {
          this.params.category_id = 0
        }
      },

      /** A callback that changes the date*/
      changeYearMonth(obj) {
        this.params = {
          /** The currently selected date type*/
          cycle_type: obj.type,

          /** year*/
          year: obj.year,

          /** in*/
          month: obj.month
        }
      },

      /** A price range*/
      changePriceRange(obj) {
        this.params = {
          ...this.params,
          sections: obj
        }
      },

      /** Perform a search*/
      handleSearch() {
        this.GET_PriceStatistics()
      },

      GET_PriceStatistics() {
        API_goodsPriceStatistics.getPriceStatisticsList(this.params).then(response => {
          this.loading = false
          this.sesalChart.setOption({
            title: { text: 'Price and volume analysis', x: 'center' },
            tooltip: {
              trigger: 'axis',
              show: true,
              formatter: function(params, ticket, callback) {
                if (params[0].name && params[0].value) {
                  return `Price:${params[0].name}<br>${params[0].seriesId.replace(/0/, '')}：${params[0].value}`
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
              name: 'Price（USD）',
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
                name: 'Order quantity',
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


