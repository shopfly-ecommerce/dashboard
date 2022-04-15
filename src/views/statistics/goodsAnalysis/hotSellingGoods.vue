<template>
  <div class="bg-shop-summary">
    <en-year-month-picker @changed="changeYearMonth"></en-year-month-picker>
    <br>
    <br>
    <el-tabs type="border-card" @tab-click="changeHotType">
      <el-tab-pane label="Place the order amount">
        <div id="orderAmount" :style="{height: tableHeight + 'px'}"></div>
        <en-table-layout
          pagination
          :tableData="tableData"
          :loading="loading">
          <template slot="table-columns">
            <el-table-column prop="goods_name" label="Name" />
            <el-table-column label="Total order amount" >
              <template slot-scope="scope">{{ scope.row.sum | unitPrice('￥') }}</template>
            </el-table-column>
          </template>
          <!--<el-pagination-->
            <!--slot="pagination"-->
            <!--v-if="pageData"-->
            <!--key="orderAmount"-->
            <!--@size-change="handlePageSizeChange"-->
            <!--@current-change="handlePageCurrentChange"-->
            <!--:current-page="pageData.page_no"-->
            <!--:page-sizes="[10, 20, 50, 100]"-->
            <!--:page-size="pageData.page_size"-->
            <!--layout="total, sizes, prev, pager, next, jumper"-->
            <!--:total="pageData.data_total">-->
          <!--</el-pagination>-->
        </en-table-layout>
      </el-tab-pane>
      <el-tab-pane label="Number of items ordered">
        <div id="orderGoodsNum" :style="{height: tableHeight + 'px'}"></div>
        <en-table-layout
          pagination
          :tableData="tableData"
          :loading="loading">
          <template slot="table-columns">
            <el-table-column prop="goods_name" label="Name" />
            <el-table-column prop="all_num" label="Quantity of goods ordered" />
          </template>
          <!--<el-pagination-->
            <!--slot="pagination"-->
            <!--v-if="pageData"-->
            <!--key="orderGoodsNum"-->
            <!--@size-change="handlePageSizeChange"-->
            <!--@current-change="handlePageCurrentChange"-->
            <!--:current-page="pageData.page_no"-->
            <!--:page-sizes="[10, 20, 50, 100]"-->
            <!--:page-size="pageData.page_size"-->
            <!--layout="total, sizes, prev, pager, next, jumper"-->
            <!--:total="pageData.data_total">-->
          <!--</el-pagination>-->
        </en-table-layout>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import * as API_HotGoods from '@/api/hotGoods'
  import { CategoryPicker } from '@/components'
  export default {
    name: 'hotSellingGoods',
    components: {
      [CategoryPicker.name]: CategoryPicker
    },
    data() {
      return {
        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          page_no: 1,

          page_size: 10,

          cycle_type: 'MONTH',

          year: '2018',

          month: '6'
        },

        /** Selling goods*/
        hotType: 0,

        /** The list of data*/
        tableData: [],

        /** List paging data*/
        pageData: [],

        tableHeight: document.body.clientHeight / 2
      }
    },
    mounted() {
      this.GET_OrderAmountData()
      window.onresize = this.countTableHeight
      this.$nextTick(() => {
        this.orderAmountChart = this.$echarts.init(document.getElementById('orderAmount'))
        this.orderGoodsNumChart = this.$echarts.init(document.getElementById('orderGoodsNum'))
      })
    },
    methods: {
      /** Calculated when the window is zoomedtablehighly*/
      countTableHeight() {
        this.tableHeight = document.body.clientHeight / 2
        /** The chart to refresh*/
        if (this.orderAmountChart) {
          setTimeout(this.orderAmountChart.resize)
        }
        if (this.orderGoodsNumChart) {
          setTimeout(this.orderGoodsNumChart.resize)
        }
      },

      /** A callback that changes the date*/
      changeYearMonth(obj) {
        this.params = {
          cycle_type: obj.type,

          year: obj.year,

          month: obj.month
        }
        this.hotType === 0 ? this.GET_OrderAmountData() : this.GET_OrderGoodsNumData()
      },

      /** Triggered when changing hot sell focus*/
      changeHotType(target) {
        this.hotType = parseInt(target.paneName)
        parseInt(target.paneName) === 0 ? this.GET_OrderAmountData() : this.GET_OrderGoodsNumData()
      },

      /** Order amount and quantity*/
      GET_OrderAmountData() {
        /** Place the order amountTop30charts */
        API_HotGoods.getHotGoodsPrice(this.params).then(response => {
          this.loading = false
          this.orderAmountChart.setOption({
            title: { text: 'Selling goodsTop30', x: 'center' },
            tooltip: {
              trigger: 'axis',
              show: true,
              formatter: function(params, ticket, callback) {
                if (params[0].name && params[0].value) {
                  return `ranking:${params[0].name}<br>${params[0].seriesId.replace(/0/, '')}：${params[0].value}`
                }
              }
            },
            legend: { orient: 'vertical', data: [{ name: response.series.name, textStyle: { borderColor: '#7CB5EC' }}], bottom: '10px' },
            color: ['#7CB5EC'],
            toolbox: {
              show: true,
              right: 50,
              feature: {
                magicType: { type: ['bar', 'line'] },
                restore: {},
                saveAsImage: {}
              }
            },
            xAxis: {
              name: 'ranking',
              type: 'category',
              data: response.xAxis
            },
            yAxis: {
              name: 'Place the order amount（USD）',
              type: 'value',
              axisLabel: {
                formatter: '{value}'
              }
            },
            series: [
              {
                name: 'The total amount',
                type: 'bar',
                barWidth: 50,
                data: response.series.data,
                markPoint: {
                  data: [
                    { type: 'max', name: 'The maximum' },
                    { type: 'min', name: 'The minimum value' }
                  ]
                },
                markLine: {
                  data: [
                    { type: 'average', name: 'The average' }
                  ]
                }
              }
            ]
          })
        })
        /** Place the order amountTop30table */
        API_HotGoods.getHotGoodsPricePage(this.params).then(response => {
          this.loading = false
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
          /** A list of information*/
          this.tableData = response.data
        })
        this.countTableHeight()
      },

      /** Quantity of goods ordered*/
      GET_OrderGoodsNumData() {
        /** Top order quantity30The chart data*/
        API_HotGoods.getHotGoodsNum(this.params).then(response => {
          this.loading = false
          this.orderGoodsNumChart.setOption({
            title: { text: 'Selling goodsTop30', x: 'center' },
            tooltip: {
              trigger: 'axis',
              show: true,
              formatter: function(params, ticket, callback) {
                if (params[0].name && params[0].value) {
                  return `ranking:${params[0].name}<br>${params[0].seriesId.replace(/0/, '')}：${params[0].value}`
                }
              }
            },
            legend: { orient: 'vertical', data: [{ name: 'Number of items ordered', textStyle: { borderColor: '#7CB5EC' }}], bottom: '10px' },
            color: ['#7CB5EC'],
            toolbox: {
              show: true,
              right: 50,
              feature: {
                magicType: { type: ['bar', 'line'] },
                restore: {},
                saveAsImage: {}
              }
            },
            xAxis: {
              name: 'ranking',
              type: 'category',
              data: response.xAxis
            },
            yAxis: {
              name: 'Quantity of goods ordered（a）',
              type: 'value',
              axisLabel: {
                formatter: '{value}'
              }
            },
            series: [
              {
                name: 'Number of items ordered',
                type: 'bar',
                data: response.series.data,
                barWidth: 50,
                markPoint: {
                  data: [
                    { type: 'max', name: 'The maximum' },
                    { type: 'min', name: 'The minimum value' }
                  ]
                },
                markLine: {
                  data: [
                    { type: 'average', name: 'The average' }
                  ]
                }
              }
            ]
          })
        })
        /** Top order quantity30Tabular data*/
        API_HotGoods.getHotGoodsNumPage(this.params).then(response => {
          this.loading = false
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
          /** A list of information*/
          this.tableData = response.data
        })
        this.countTableHeight()
      },

      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        if (this.hotType === 0) {
          this.GET_OrderAmountData()
        } else {
          this.GET_OrderGoodsNumData()
        }
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        if (this.hotType === 0) {
          this.GET_OrderAmountData()
        } else {
          this.GET_OrderGoodsNumData()
        }
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .bg-shop-summary {
    margin: 15px;
    padding: 15px;
    background-color: #fff;
    border: 1px solid #9a9a9a;
    p {
      margin: 15px 0;
      text-align: left;
    }
  }
  /deep/ .el-table td:not(.is-left) {
    text-align: center;
  }

</style>

