<template>
  <div class="container">
    <el-card>
      <div slot="header" class="chart-header">
        <div class="chart-header-item">
          <span>Query cycle：</span>
          <en-year-month-picker @changed="handleYearMonthChanged"/>
        </div>
      </div>
      <div id="refund-statistics-chart" style="height: 300px"></div>
    </el-card>
  </div>
</template>

<script>
  import * as API_Statistics from '@/api/refund'
  import { Foundation } from '~/ui-utils'
  import echartsOptions from '../echartsOptions'

  export default {
    name: 'refundStatistics',
    data() {
      return {
        loading: false,
        params: {
          year: '',
          month: '',
          cycle_type: 'MONTH'
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.echarts = this.$echarts.init(document.getElementById('refund-statistics-chart'))
      })
    },
    watch: {
      params: {
        handler: 'GET_RefundStatistics',
        deep: true
      }
    },
    methods: {
      /** The years have changed*/
      handleYearMonthChanged(object) {
        this.params.year = object.year
        this.params.month = object.month
        this.params.cycle_type = object.type
      },
      /** Get refund amount statistics*/
      GET_RefundStatistics() {
        this.loading = true
        const { cycle_type } = this.params
        const date_type = cycle_type === 'MONTH' ? 'month' : 'years'
        API_Statistics.getRefundStatistics(this.params).then(response => {
          this.loading = false
          const { data, name, localName } = response.series
          const { xAxis } = response
          this.echarts.setOption(echartsOptions({
            titleText: `Refund Amount Statistics（${date_type}）`,
            tooltipFormatter: (params) => {
              params = params[0]
              return `The date of：${params.dataIndex + 1}${cycle_type === 'MONTH' ? 'day' : 'month'}<br/>${params.marker}The refund amount：￥${Foundation.formatPrice(params.value)}`
            },
            xAxisData: xAxis,
            seriesName: 'The refund amount',
            seriesData: data
          }))
          this.echarts.resize()
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .container {
    background-color: #fff;
    padding: 10px;
  }
  .chart-header {
    padding: 0 10px;
  }
  .chart-header-item {
    display: inline-block;
    margin-right: 30px;
  }
</style>
