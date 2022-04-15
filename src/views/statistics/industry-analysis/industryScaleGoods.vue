<template>
  <div v-loading="loading" id="industry-scale-goods-chart" style="height: 300px"></div>
</template>

<script>
  import * as API_Statistics from '@/api/industryAnalysis'
  import echartsOptions from '../echartsOptions'

  export default {
    name: 'industryScaleGoods',
    props: ['params', 'curTab'],
    data() {
      return {
        loading: false
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.echarts = this.$echarts.init(document.getElementById('industry-scale-goods-chart'))
      })
    },
    watch: {
      curTab: 'GET_IndustryScaleGoods',
      params: {
        handler: 'GET_IndustryScaleGoods',
        deep: true
      }
    },
    methods: {
      /** Get member orders*/
      GET_IndustryScaleGoods() {
        if (this.curTab !== 'goods' || this.loading) return
        this.loading = true
        API_Statistics.getIndustryScaleGoods(this.params).then(response => {
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
            seriesName: 'Order quantity'
          }))
          this.echarts.resize()
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>
