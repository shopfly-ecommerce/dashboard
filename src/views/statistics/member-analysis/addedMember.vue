<template>
  <div v-loading="loading" class="container">
    <el-card>
      <div slot="header" class="chart-header">
        <div class="chart-header-item">
          <span>查询周期：</span>
          <en-year-month-picker @changed="handleYearMonthChanged"/>
        </div>
      </div>
      <div id="added-member-chart" style="height: 300px"></div>
      <en-table-layout
        :toolbar="false"
        :pagination="false"
        :tableData="tableData.data"
      >
        <template slot="table-columns">
          <el-table-column prop="membertime" label="日期/月份">
            <template slot-scope="scope">{{ scope.row.time + (params.cycle_type === 'MONTH' ? '日' : '月') }}</template>
          </el-table-column>
          <el-table-column prop="num" label="本月/本年（个）"/>
          <el-table-column prop="last_num" label="上月/上年（个）"/>
          <el-table-column label="同比">
            <template slot-scope="scope">{{ parseFloat(scope.row.growth).toFixed(2) }}% </template>
          </el-table-column>
        </template>
      </en-table-layout>
    </el-card>
  </div>
</template>

<script>
  import * as API_Statistics from '@/api/memberAnalysis'
  import echartsOptions from '../echartsOptions'

  export default {
    name: 'addedMember',
    data() {
      return {
        loading: false,
        tableData: '',
        params: {
          year: '',
          month: '',
          cycle_type: 'MONTH'
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.echarts = this.$echarts.init(document.getElementById('added-member-chart'))
      })
    },
    methods: {
      /** 年月份发生变化 */
      handleYearMonthChanged(object) {
        this.params.year = object.year
        this.params.month = object.month
        this.params.cycle_type = object.type
        this.GET_AddedMemberData()
      },
      GET_AddedMemberData() {
        this.loading = true
        Promise.all([
          API_Statistics.addedMember(this.params),
          API_Statistics.addedMemberPage(this.params)
        ]).then(responses => {
          this.loading = false
          this.tableData = responses[1]
          const { data, name, localName } = responses[0].series
          const { xAxis } = responses[0]
          this.echarts.setOption(echartsOptions({
            titleText: `新增会员数量（${this.params.cycle_type === 'MONTH' ? '月' : '年'}）`,
            tooltipFormatter: (params) => {
              params = params[0]
              return `日期：${xAxis[params.dataIndex]}${this.params.cycle_type === 'MONTH' ? '日' : '月'}<br/>${params.marker}${params.seriesName}：${params.value}`
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
