<template>
  <div v-loading="loading" id="industry-scale-price-chart" style="height: 300px"></div>
</template>

<script>
  import * as API_Statistics from '@/api/industryAnalysis'
  import echartsOptions from '../echartsOptions'

  export default {
    name: 'industryScalePrice',
    props: ['params', 'curTab'],
    data() {
      return {
        loading: false
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.echarts = this.$echarts.init(document.getElementById('industry-scale-price-chart'))
      })
    },
    watch: {
      curTab: 'GET_IndustryScalePrice',
      params: {
        handler: 'GET_IndustryScalePrice',
        deep: true
      }
    },
    methods: {
      /** Get member orders*/
      GET_IndustryScalePrice() {
        if (this.curTab !== 'price' || this.loading) return
        this.loading = true
        API_Statistics.getIndustryScalePrice(this.params).then(response => {
          this.loading = false
          const { data, localName, name } = response.series
          const { yAxis } = response
          this.echarts.setOption(echartsOptions({
            titleText: name,
            seriesData: data,
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01]
            },
            yAxisType: 'category',
            yAxisData: yAxis,
            seriesName: 'Place the order amount'
          }))
          this.echarts.resize()
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>
