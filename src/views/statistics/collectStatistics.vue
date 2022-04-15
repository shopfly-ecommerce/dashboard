<template>
  <div class="bg-shop-summary">
    <p>This page is about collection statisticsTOP50,By high what</p>
    <div id="collectionStatistics" :style="{height: tableHeight + 'px'}"></div>
    <en-table-layout
      pagination
      :tableData="tableData"
      :loading="loading">
      <template slot="table-columns">
        <el-table-column label="Name">
          <template slot-scope="scope">
            <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank" style="color: #00a2d4;">{{ scope.row.goods_name }}</a>
          </template>
        </el-table-column>
        <el-table-column label="Price">
          <template slot-scope="scope">{{ scope.row.price | unitPrice('￥') }}</template>
        </el-table-column>
        <el-table-column prop="favorite_num" label="collection"></el-table-column>
      </template>
      <el-pagination
        slot="pagination"
        v-if="pageData"
        @size-change="handlePageSizeChange"
        @current-change="handlePageCurrentChange"
        :current-page="pageData.page_no"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageData.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.data_total">
      </el-pagination>
    </en-table-layout>
  </div>
</template>

<script>
  import * as API_collectionStatistics from '@/api/collectionStatistics'
  import { CategoryPicker } from '@/components'
  export default {
    name: 'collectStatistics',
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
          page_size: 10
        },

        /** The list of data*/
        tableData: null,

        /** List paging data*/
        pageData: null,

        tableHeight: document.body.clientHeight / 2
      }
    },
    created() {
      this.GET_CollectionData()
    },
    mounted() {
      window.onresize = this.countTableHeight
      this.$nextTick(() => {
        this.sesalChart = this.$echarts.init(document.getElementById('collectionStatistics'))
      })
    },
    methods: {
      /** Calculated when the window is zoomedtablehighly*/
      countTableHeight() {
        this.tableHeight = document.body.clientHeight / 2
        /** The chart to refresh*/
        setTimeout(this.sesalChart.resize)
      },

      /** Collect the data*/
      GET_CollectionData() {
        /** Collect statistics*/
        API_collectionStatistics.getCollectionStatistics().then(response => {
          this.sesalChart.setOption({
            title: { text: 'Collection ListTop50', x: 'center' },
            tooltip: {
              trigger: 'axis',
              show: true,
              formatter: function(params, ticket, callback) {
                const res = response.series.localName[params[0].dataIndex] + '<br>' + params[0].seriesId.replace(/0/, '') + '：' + params[0].value
                return res
              }
            },
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
              type: 'value',
              minInterval: 1,
              axisLabel: {
                formatter: '{value} time'
              }
            },
            series: [
              {
                name: 'Collection product',
                type: 'bar',
                label: { show: true },
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

        API_collectionStatistics.getCollectionGoods(this.params).then(response => {
          this.loading = false
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
          this.tableData = response.data
        })
      },

      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_CollectionData()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_CollectionData()
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
