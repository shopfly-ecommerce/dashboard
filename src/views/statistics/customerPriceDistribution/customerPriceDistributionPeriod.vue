<template>
  <div v-loading="loading" id="customer-price-distribution-period-chart" style="height: 300px"></div>
</template>

<script>
  import * as API_Statistics from '@/api/customerPriceDistribution'
  import echartsOptions from '../echartsOptions'

  export default {
    name: 'customerPriceDistributionPeriod',
    props: ['params', 'curTab'],
    data() {
      return {
        loading: false
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.echarts = this.$echarts.init(document.getElementById('customer-price-distribution-period-chart'))
      })
    },
    watch: {
      curTab: 'GET_CustomerPriceDistributionPeriod',
      params: {
        handler: 'GET_CustomerPriceDistributionPeriod',
        deep: true
      }
    },
    methods: {
      GET_CustomerPriceDistributionPeriod() {
        if (this.curTab !== 'period' || this.loading) return
        this.loading = true
        API_Statistics.getBuyTimeDistribution(this.params).then(response => {
          this.loading = false
          const { data, name, localName } = response.series
          const { xAxis } = response
          this.echarts.setOption(echartsOptions({
            titleText: 'Purchase time distribution',
            tooltipFormatter: function(params) {
              params = params[0]
              return `Period of time：${xAxis[params.dataIndex]}point<br/>${params.marker}${name}：${params.value}`
            },
            xAxisData: xAxis,
            seriesName: name,
            seriesData: data
          }))
          this.echarts.resize()
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>
