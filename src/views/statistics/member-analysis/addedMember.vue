<template>
  <div v-loading="loading" class="container">
    <el-card>
      <div slot="header" class="chart-header">
        <div class="chart-header-item">
          <span>Query cycle：</span>
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
          <el-table-column prop="membertime" label="The date of/in">
            <template slot-scope="scope">{{ scope.row.time + (params.cycle_type === 'MONTH' ? 'day' : 'month') }}</template>
          </el-table-column>
          <el-table-column prop="num" label="This month,/This year,（a）"/>
          <el-table-column prop="last_num" label="Last month,/From the previous year（a）"/>
          <el-table-column label="Compared with the same">
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
      /** The months of the year change*/
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
            titleText: `Number of new members（${this.params.cycle_type === 'MONTH' ? 'month' : 'years'}）`,
            tooltipFormatter: (params) => {
              params = params[0]
              return `The date of：${xAxis[params.dataIndex]}${this.params.cycle_type === 'MONTH' ? 'day' : 'month'}<br/>${params.marker}${params.seriesName}：${params.value}`
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
