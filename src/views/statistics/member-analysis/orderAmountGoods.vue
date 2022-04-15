<template>
  <div v-loading="loading">
    <div id="goods-chart" style="height: 300px"></div>
    <en-table-layout
      :toolbar="false"
      :pagination="false"
      :tableData="tableData.data"
    >
      <template slot="table-columns">
        <el-table-column type="index" width="150" label="ranking"/>
        <el-table-column prop="member_name" label="Members nickname"/>
        <el-table-column prop="goods_num" label="Quantity of goods ordered"/>
      </template>
    </en-table-layout>
  </div>
</template>

<script>
  import * as API_Statistics from '@/api/memberAnalysis'
  import echartsOptions from '../echartsOptions'

  export default {
    name: 'orderAmountGoods',
    props: ['params', 'curTab'],
    data() {
      return {
        loading: false,
        /** The list of data*/
        tableData: ''
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.echarts = this.$echarts.init(document.getElementById('goods-chart'))
      })
    },
    watch: {
      curTab: 'GET_MemberAmountGoods',
      params: {
        handler: 'GET_MemberAmountGoods',
        deep: true
      }
    },
    methods: {
      /** Get member orders*/
      GET_MemberAmountGoods() {
        if (this.curTab !== 'goods' || this.loading) return
        this.loading = true
        Promise.all([
          API_Statistics.getMemberGoodsNum(this.params),
          API_Statistics.getMemberGoodsNumPage(this.params)
        ]).then(responses => {
          this.loading = false
          this.tableData = responses[1]
          const { data, name, localName } = responses[0].series
          const { xAxis } = responses[0]
          this.echarts.setOption(echartsOptions({
            titleText: 'Number of items placed by membersTOP' + xAxis.length,
            tooltipFormatter: function(params) {
              params = params[0]
              return `Member name：${localName[params.dataIndex]}<br/>${params.marker}${params.seriesName}：${params.value}`
            },
            seriesName: name,
            seriesData: data,
            xAxisData: xAxis
          }))
          this.echarts.resize()
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>
