<template>
  <div class="bg-shop-summary">
    <el-select v-model="type" placeholder="Please select" @change="changeHotType">
      <el-option
        v-for="item in orderOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <en-year-month-picker @changed="changeYearMonth"></en-year-month-picker>
    <el-button type="primary" @click="handleSearchHot">Begin your search</el-button>
    <br>
    <br>
    <div class="charts-info">
      <div id="regionalAnalysisMap" :style="{height: tableHeight + 'px'}"></div>
      <div id="regionalAnalysisChart" :style="{height: tableHeight + 'px' }"></div>
    </div>
  </div>
</template>

<script>
  import * as API_regionalAnalysis from '@/api/regionalAnalysis'
  export default {
    name: 'regionalAnalysis',
    data() {
      return {
        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          /** The currently selected date type*/
          cycle_type: 'MONTH',

          /** year*/
          year: '2018',

          /** in*/
          month: '6',

          /** The data type*/
          type: 'ORDER_MEMBER_NUM'
        },

        type: 'ORDER_MEMBER_NUM',

        /** The selected data item*/
        orderOptions: [
          { label: 'Number of single members', value: 'ORDER_MEMBER_NUM' },
          { label: 'Place the order amount', value: 'ORDER_PRICE' },
          { label: 'Order quantity', value: 'ORDER_NUM' }
        ],

        tableHeight: document.body.clientHeight * 0.82
      }
    },
    mounted() {
      this.GET_RegionalAnalysis()
      window.onresize = this.countTableHeight
      this.$nextTick(() => {
        this.regionalAnalysisMap = this.$echarts.init(document.getElementById('regionalAnalysisMap'))
        this.regionalAnalysisChart = this.$echarts.init(document.getElementById('regionalAnalysisChart'))
      })
    },
    methods: {
      /** Calculated when the window is zoomedtablehighly*/
      countTableHeight() {
        this.tableHeight = document.body.clientHeight * 0.82
        /** The chart to refresh*/
        if (this.regionalAnalysisMap) {
          setTimeout(this.regionalAnalysisMap.resize)
        }
        if (this.regionalAnalysisChart) {
          setTimeout(this.regionalAnalysisChart.resize)
        }
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

      /** Triggered when changing focus*/
      changeHotType(target) {
        this.params = {
          ...this.params,
          type: target
        }
        this.type = target
      },

      /** Search the trigger*/
      handleSearchHot() {
        this.GET_RegionalAnalysis()
      },

      /** The chart data*/
      GET_RegionalAnalysis() {
        API_regionalAnalysis.getRegionalAnalysisList(this.params).then(response => {
          this.loading = false
          /** xAxis information here should be China34The names of administrative divisions*/
          const xData = response.map((item) => { return item.name })
          const xName = this.orderOptions.filter(key => { return this.params.type === key.value })[0].label

          /** tooltipPrompt information*/
          let seriesName = ''
          this.orderOptions.forEach(key => {
            if (key.value === this.type) {
              seriesName = key.label
            }
          })
          /** The map*/
          this.regionalAnalysisMap.setOption({
            title: { text: 'Regional analysis statistics', x: 'center' },
            tooltip: {
              trigger: 'item',
              show: true,
              formatter: function(params, ticket, callback) {
                const res = params.data.name + '<br>' + params.seriesName + '：' + params.data.value
                return res
              }
            },
            visualMap: {
              min: 0,
              max: 2500,
              left: 'left',
              top: 'bottom',
              text: ['high', 'low'],
              calculable: true
            },
            toolbox: {
              show: true,
              right: 50,
              orient: 'vertical',
              left: 'right',
              top: 'center',
              feature: {
                restore: {},
                saveAsImage: {}
              }
            },
            series: [
              {
                name: seriesName,
                type: 'map',
                mapType: 'china',
                roam: false,
                label: {
                  normal: {
                    show: true
                  },
                  emphasis: {
                    show: true
                  }
                },
                data: response
              }
            ]
          })
          /** The line chart*/
          this.regionalAnalysisChart.setOption({
            title: { text: 'Regional ranking', x: 'center' },
            tooltip: {
              trigger: 'axis',
              show: true,
              formatter: function(params, ticket, callback) {
                const res = params[0].name + '<br>' + params[0].seriesName + '：' + params[0].value
                return res
              }
            },
            legend: { show: true, orient: 'vertical', data: [{ name: seriesName }], bottom: '10px' },
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
              name: xName,
              type: 'value',
              // Set to 1 to ensure that the coordinate axis partition scale is displayed as an integer.
              minInterval: 1
            },
            yAxis: {
              name: 'Provincial administrative division',
              type: 'category',
              axisTick: { show: false },
              data: xData
            },
            series: [
              {
                name: seriesName,
                type: 'bar',
                data: response,
                label: {
                  normal: {
                    show: true
                  }
                },
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
        this.countTableHeight()
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .charts-info {
    div {
      display: inline-block;
      width: 48%;
    }
  }

</style>

