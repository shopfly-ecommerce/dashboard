<template>
  <div v-loading="loading" id="customer-price-distribution-price-chart" style="height: 300px"></div>
</template>

<script>
  import * as API_Statistics from '@/api/customerPriceDistribution'
  import echartsOptions from '../echartsOptions'

  export default {
    name: 'customerPriceDistributionPrice',
    props: ['params', 'curTab', 'priceRange'],
    data() {
      return {
        loading: false
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.echarts = this.$echarts.init(document.getElementById('customer-price-distribution-price-chart'))
      })
    },
    watch: {
      curTab: 'GET_CustomerPriceDistributionPrice',
      priceRange: 'GET_CustomerPriceDistributionPrice',
      params: {
        handler: 'GET_CustomerPriceDistributionPrice',
        deep: true
      }
    },
    methods: {
      GET_CustomerPriceDistributionPrice() {
        if (this.curTab !== 'price' || this.loading) return
        this.loading = true
        const params = JSON.parse(JSON.stringify(this.params))
        params.prices = []
        this.priceRange.forEach((item, index) => {
          params.prices.push(item[0])
          if (index === this.priceRange.length - 1) {
            params.prices.push(item[1])
          }
        })
        API_Statistics.getOrderPriceDistribution(params).then(response => {
          this.loading = false
          const { data, name, localName } = response.series
          const { xAxis } = response
          this.echarts.setOption(echartsOptions({
            titleText: 'Customer unit price distribution',
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
