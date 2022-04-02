<template>
  <div v-loading="loading">
    <div id="order-chart" style="height: 300px"></div>
    <en-table-layout
      :toolbar="false"
      :pagination="false"
      :tableData="tableData.data"
    >
      <template slot="table-columns">
        <el-table-column type="index" width="150" label="排名"/>
        <el-table-column prop="member_name" label="会员昵称"/>
        <el-table-column prop="order_num" label="下单量"/>
      </template>
    </en-table-layout>
  </div>
</template>

<script>
  import * as API_Statistics from '@/api/memberAnalysis'
  import echartsOptions from '../echartsOptions'

  export default {
    name: 'orderAmountOrder',
    props: ['params', 'curTab'],
    data() {
      return {
        loading: false,
        /** 列表数据 */
        tableData: ''
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.echarts = this.$echarts.init(document.getElementById('order-chart'))
      })
    },
    watch: {
      curTab: 'GET_MemberAmountOrder',
      params: {
        handler: 'GET_MemberAmountOrder',
        deep: true
      }
    },
    methods: {
      /** 获取会员下单量 */
      GET_MemberAmountOrder() {
        if (this.curTab !== 'order' || this.loading) return
        this.loading = true
        Promise.all([
          API_Statistics.getMemberOrderNum(this.params),
          API_Statistics.getMemberOrderNumPage(this.params)
        ]).then(responses => {
          this.loading = false
          this.tableData = responses[1]
          const { data, name, localName } = responses[0].series
          const { xAxis } = responses[0]
          this.echarts.setOption(echartsOptions({
            titleText: '会员下单量TOP' + xAxis.length,
            tooltipFormatter: function(params) {
              params = params[0]
              return `会员名称：${localName[params.dataIndex]}<br/>${params.marker}${params.seriesName}：${params.value}`
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
