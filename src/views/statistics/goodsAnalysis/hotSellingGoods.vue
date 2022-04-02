<template>
  <div class="bg-shop-summary">
    <en-year-month-picker @changed="changeYearMonth"></en-year-month-picker>
    <br>
    <br>
    <el-tabs type="border-card" @tab-click="changeHotType">
      <el-tab-pane label="下单金额">
        <div id="orderAmount" :style="{height: tableHeight + 'px'}"></div>
        <en-table-layout
          pagination
          :tableData="tableData"
          :loading="loading">
          <template slot="table-columns">
            <el-table-column prop="goods_name" label="商品名称" />
            <el-table-column label="下单总金额" >
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
      <el-tab-pane label="下单商品数">
        <div id="orderGoodsNum" :style="{height: tableHeight + 'px'}"></div>
        <en-table-layout
          pagination
          :tableData="tableData"
          :loading="loading">
          <template slot="table-columns">
            <el-table-column prop="goods_name" label="商品名称" />
            <el-table-column prop="all_num" label="下单商品数量" />
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
        /** 列表loading状态 */
        loading: false,

        /** 列表参数 */
        params: {
          page_no: 1,

          page_size: 10,

          cycle_type: 'MONTH',

          year: '2018',

          month: '6'
        },

        /** 热卖商品*/
        hotType: 0,

        /** 列表数据 */
        tableData: [],

        /** 列表分页数据 */
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
      /** 窗口缩放时计算table高度 */
      countTableHeight() {
        this.tableHeight = document.body.clientHeight / 2
        /** 图表刷新 */
        if (this.orderAmountChart) {
          setTimeout(this.orderAmountChart.resize)
        }
        if (this.orderGoodsNumChart) {
          setTimeout(this.orderGoodsNumChart.resize)
        }
      },

      /** 改变日期的回调*/
      changeYearMonth(obj) {
        this.params = {
          cycle_type: obj.type,

          year: obj.year,

          month: obj.month
        }
        this.hotType === 0 ? this.GET_OrderAmountData() : this.GET_OrderGoodsNumData()
      },

      /** 改变热卖焦点时触发 */
      changeHotType(target) {
        this.hotType = parseInt(target.paneName)
        parseInt(target.paneName) === 0 ? this.GET_OrderAmountData() : this.GET_OrderGoodsNumData()
      },

      /** 下单金额数量 */
      GET_OrderAmountData() {
        /** 下单金额Top30charts */
        API_HotGoods.getHotGoodsPrice(this.params).then(response => {
          this.loading = false
          this.orderAmountChart.setOption({
            title: { text: '热卖商品Top30', x: 'center' },
            tooltip: {
              trigger: 'axis',
              show: true,
              formatter: function(params, ticket, callback) {
                if (params[0].name && params[0].value) {
                  return `排名:${params[0].name}<br>${params[0].seriesId.replace(/0/, '')}：${params[0].value}`
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
              name: '排名',
              type: 'category',
              data: response.xAxis
            },
            yAxis: {
              name: '下单金额（元）',
              type: 'value',
              axisLabel: {
                formatter: '{value}'
              }
            },
            series: [
              {
                name: '总金额',
                type: 'bar',
                barWidth: 50,
                data: response.series.data,
                markPoint: {
                  data: [
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' }
                  ]
                },
                markLine: {
                  data: [
                    { type: 'average', name: '平均值' }
                  ]
                }
              }
            ]
          })
        })
        /** 下单金额Top30table */
        API_HotGoods.getHotGoodsPricePage(this.params).then(response => {
          this.loading = false
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
          /** 列表信息 */
          this.tableData = response.data
        })
        this.countTableHeight()
      },

      /** 下单商品数量 */
      GET_OrderGoodsNumData() {
        /** 下单商品数量排行前30图表数据 */
        API_HotGoods.getHotGoodsNum(this.params).then(response => {
          this.loading = false
          this.orderGoodsNumChart.setOption({
            title: { text: '热卖商品Top30', x: 'center' },
            tooltip: {
              trigger: 'axis',
              show: true,
              formatter: function(params, ticket, callback) {
                if (params[0].name && params[0].value) {
                  return `排名:${params[0].name}<br>${params[0].seriesId.replace(/0/, '')}：${params[0].value}`
                }
              }
            },
            legend: { orient: 'vertical', data: [{ name: '下单商品数', textStyle: { borderColor: '#7CB5EC' }}], bottom: '10px' },
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
              name: '排名',
              type: 'category',
              data: response.xAxis
            },
            yAxis: {
              name: '下单商品数量（个）',
              type: 'value',
              axisLabel: {
                formatter: '{value}'
              }
            },
            series: [
              {
                name: '下单商品数',
                type: 'bar',
                data: response.series.data,
                barWidth: 50,
                markPoint: {
                  data: [
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' }
                  ]
                },
                markLine: {
                  data: [
                    { type: 'average', name: '平均值' }
                  ]
                }
              }
            ]
          })
        })
        /** 下单商品数量排行前30表格数据 */
        API_HotGoods.getHotGoodsNumPage(this.params).then(response => {
          this.loading = false
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
          /** 列表信息 */
          this.tableData = response.data
        })
        this.countTableHeight()
      },

      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        if (this.hotType === 0) {
          this.GET_OrderAmountData()
        } else {
          this.GET_OrderGoodsNumData()
        }
      },

      /** 分页页数发生改变 */
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

