<template>
  <div class="container">
    <el-card>
      <div slot="header" class="chart-header">
        <div class="chart-header-item">
          <span>查询周期：</span>
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
      /** 年月发生改变 */
      handleYearMonthChanged(object) {
        this.params.year = object.year
        this.params.month = object.month
        this.params.cycle_type = object.type
      },
      /** 获取退款金额统计 */
      GET_RefundStatistics() {
        this.loading = true
        const { cycle_type } = this.params
        const date_type = cycle_type === 'MONTH' ? '月' : '年'
        API_Statistics.getRefundStatistics(this.params).then(response => {
          this.loading = false
          const { data, name, localName } = response.series
          const { xAxis } = response
          this.echarts.setOption(echartsOptions({
            titleText: `退款金额统计（${date_type}）`,
            tooltipFormatter: (params) => {
              params = params[0]
              return `日期：${params.dataIndex + 1}${cycle_type === 'MONTH' ? '日' : '月'}<br/>${params.marker}退款金额：￥${Foundation.formatPrice(params.value)}`
            },
            xAxisData: xAxis,
            seriesName: '退款金额',
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
