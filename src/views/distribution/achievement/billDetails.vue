<template>
  <div class="order-detail-container">
    <!--Distributor statement-->
    <el-row :gutter="0">
      <div class="d-header"> Distributor settlement amount：
        {{ billOriginInfo.final_money }}(The final commission) = {{ billOriginInfo.push_money }}(This commission) - {{ billOriginInfo.return_push_money }}(Return the commission)</div>
      <el-col v-for="col in billInfo" :key="col.key" :span="8">
        <div class="d-content">
          <div v-for="item in col.items" :key="item.key" class="item">
            <span class="item-label" v-html="item.label"></span>
            <span class="item-value">{{ item.value }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--Distributor order-->
    <el-row v-if="disOrderList" :gutter="0">
      <el-col :span="24">
        <div class="d-header">Distributor order</div>
        <en-table-layout
          :tableData="disOrderList"
          pagination
          height="200px"
          :loading="disOrderLoading">
          <template slot="table-columns">
            <el-table-column prop="sn" label="Bill no."/>
            <el-table-column label="Amount">
              <template slot-scope="scope">￥{{ scope.row.order_price | unitPrice }}</template>
            </el-table-column>
            <el-table-column prop="message" label="Commission amount">
              <template slot-scope="scope">￥{{ scope.row.price | unitPrice }}</template>
            </el-table-column>
          </template>
          <el-pagination
            v-if="disOrderList"
            slot="pagination"
            @size-change="handleDisOrderPageSizeChange"
            @current-change="handleDisOrderPageCurrentChange"
            :current-page="disOrderPageData.page_no"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="disOrderPageData.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="disOrderPageData.data_total">
          </el-pagination>
        </en-table-layout>
      </el-col>
    </el-row>
    <!--Distributor Return order-->
    <el-row v-if="disRefundOrderList" :gutter="0">
      <el-col :span="24">
        <div class="d-header">Distributor Return order</div>
        <en-table-layout
          :tableData="disRefundOrderList"
          pagination
          height="200px"
          :loading="disRefundOrderLoading">
          <template slot="table-columns">
            <el-table-column prop="sn" label="Bill no."/>
            <el-table-column prop="op_name" label="Amount">
              <template slot-scope="scope">￥{{ scope.row.order_price | unitPrice }}</template>
            </el-table-column>
            <el-table-column prop="message" label="Refund or exchange of commission amount">
              <template slot-scope="scope">￥{{ scope.row.price | unitPrice }}</template>
            </el-table-column>
          </template>
          <el-pagination
            v-if="disRefundOrderList"
            slot="pagination"
            @size-change="handleDisRefundOrderPageSizeChange"
            @current-change="handleDisRefundOrderPageCurrentChange"
            :current-page="disRefundOrderPageData.page_no"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="disRefundOrderPageData.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="disRefundOrderPageData.data_total">
          </el-pagination>
        </en-table-layout>
      </el-col>
    </el-row>
    <!--Distributor structure Chart-->
    <el-row :gutter="0">
      <el-col :span="24">
        <div class="d-header">Distributor structure Chart</div>
        <en-table-layout
          :tableData="dataDown"
          pagination
          style="width: 100%"
          :row-style="showTr">
          <template slot="table-columns">
            <el-table-column
              v-for="(column, index) in columns"
              :key="column.dataIndex"
              :label="column.text"
              :width="column.width"
              align="center">
              <template slot-scope="scope">
                <span
                  v-if="spaceIconShow(index)"
                  v-for="(space, levelIndex) in scope.row._level"
                  :key="levelIndex"
                  class="ms-tree-space"></span>
                  <button
                    style="border:0;background:transparent;outline:none;"
                    class="button is-outlined is-primary is-small"
                    v-if="toggleIconShow(index,scope.row)"
                    @click="toggle(scope.$index)">
                    <i v-if="!scope.row._expanded" class="el-icon el-icon-arrow-right" aria-hidden="true"></i>
                    <i v-if="scope.row._expanded" class="el-icon el-icon-arrow-down" aria-hidden="true"></i>
                  </button>
                  <span v-else-if="index===0" class="ms-tree-space">
                  <i class="el-icon el-icon-arrow-down"></i>
                </span>
                <span v-else>{{scope.row[column.dataIndex]}}</span>
              </template>
            </el-table-column>
          </template>
        </en-table-layout>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as API_distribution from '@/api/distribution'
  import { Foundation } from '~/ui-utils'
  import Utils from './utils/index.js'
  export default {
    name: 'billDetails',
    data() {
      return {
        /** The statement of settlement is originalinfo */
        billOriginInfo: {},

        /** After the statement is combinedinfo */
        billInfo: [],

        /** Distribution of orders*/
        disOrderList: [],

        /** Distribution order paging data*/
        disOrderPageData: {},

        /** Distribution of ordersloading */
        disOrderLoading: false,

        /** Distribution order parameters*/
        disOrderParams: {
          page_no: 1,
          page_size: 10,
          ...this.$route.query
        },

        /** Distribution of Refund Order*/
        disRefundOrderList: [],

        /** Distribution of refund order paging data*/
        disRefundOrderPageData: {},

        /** Distribution of Refund Orderloading */
        disRefundOrderLoading: false,

        /** Distribution refund order parameters*/
        disRefundOrderParams: {
          page_no: 1,
          page_size: 10,
          ...this.$route.query
        },

        /** Open by default*/
        defaultExpandAll: false,

        /** Whether to default to tree structured data*/
        treeStructure: true,

        /** Column information*/
        columns: [
          {
            width: 50
          },
          {
            text: 'distributors',
            dataIndex: 'member_name',
            width: 100
          },
          {
            text: 'The settlement amount',
            dataIndex: 'final_money'
          },
          {
            text: 'Commission amount',
            dataIndex: 'push_money'
          },
          {
            text: 'The order quantity',
            dataIndex: 'order_count'
          },
          {
            text: 'Amount',
            dataIndex: 'order_money'
          },
          {
            text: 'Refund the commission amount',
            dataIndex: 'return_push_money'
          },
          {
            text: 'Refund of order amount',
            dataIndex: 'return_order_money'
          },
          {
            text: 'Order return quantity',
            dataIndex: 'return_order_count'
          }
        ],

        /**  Subordinate Distributor List*/
        dataSource: []
      }
    },
    activated() {
      this.disOrderParams = {
        ...this.disOrderParams,
        ...this.$route.query
      }
      this.disRefundOrderParams = {
        ...this.disRefundOrderParams,
        ...this.$route.query
      }
      this.GET_BillDetails()
      this.GET_DisOrderList()
      this.GET_DisRefundOrderList()
      this.GET_DisBillDown()
    },
    beforeRouteUpdate(to, from, next) {
      this.disOrderParams = {
        ...this.disOrderParams,
        ...this.$route.query
      }
      this.disRefundOrderParams = {
        ...this.disRefundOrderParams,
        ...this.$route.query
      }
      this.GET_BillDetails()
      this.GET_DisOrderList()
      this.GET_DisRefundOrderList()
      this.GET_DisBillDown()
      next()
    },
    mounted() {
      this.GET_BillDetails()
      this.GET_DisOrderList()
      this.GET_DisRefundOrderList()
      this.GET_DisBillDown()
    },
    computed: {
      // Formatted data source
      dataDown() {
        return Utils.MSDataTransfer.treeToArray(this.dataSource, null, null, this.defaultExpandAll)
      }
    },
    methods: {
      /** Gets a list of distribution orders*/
      GET_DisOrderList() {
        this.disOrderLoading = true
        API_distribution.getDisOrderList(this.disOrderParams).then(response => {
          this.disOrderLoading = false
          this.disOrderList = response.data
          this.disOrderPageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
        })
      },

      /** The distribution order page size has changed*/
      handleDisOrderPageSizeChange(size) {
        this.disOrderParams.page_size = size
        this.GET_DisOrderList()
      },

      /** The number of distribution order pages has changed*/
      handleDisOrderPageCurrentChange(page) {
        this.disOrderParams.page_no = page
        this.GET_DisOrderList()
      },

      /** Gets a list of distribution refund orders*/
      GET_DisRefundOrderList() {
        this.disRefundOrderLoading = true
        API_distribution.getDisRefundOrderList(this.disRefundOrderParams).then(response => {
          this.disRefundOrderLoading = false
          this.disRefundOrderList = response.data
          this.disRefundOrderPageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
        })
      },

      /** The distribution order refund sheet page size has changed*/
      handleDisRefundOrderPageSizeChange(size) {
        this.disRefundOrderParams.page_size = size
        this.GET_DisRefundOrderList()
      },

      /** The number of refunds for distribution orders has changed*/
      handleDisRefundOrderPageCurrentChange(page) {
        this.disRefundOrderParams.page_no = page
        this.GET_DisRefundOrderList()
      },

      /** Obtain reseller billing details*/
      GET_BillDetails() {
        API_distribution.getDisBillDetails(this.$route.query.bill_id).then(response => {
          this.billOriginInfo = response
          this.billInfo = this.countShowData(response)
        })
      },

      /** Combine billing details*/
      countShowData(info) {
        const f = Foundation
        return [
          {
            items: [
              { label: 'distributors', value: info.member_name },
              { label: 'orders', value: info.order_count },
              { label: 'Return order number', value: info.return_order_count }
            ]
          },
          {
            items: [
              { label: 'Statement no.', value: info.sn },
              { label: 'Amount', value: f.formatPrice(info.order_money) },
              { label: 'Refund of order amount', value: f.formatPrice(info.return_order_money) }
            ]
          },
          {
            items: [
              { label: 'cycle', value: `${f.unixToDate(info.start_time, 'yyyy-MM-dd')} ~ ${f.unixToDate(info.end_time, 'yyyy-MM-dd')}` },
              { label: 'Commission amount', value: f.formatPrice(info.push_money) },
              { label: 'Refund the commission amount', value: f.formatPrice(info.return_push_money) }
            ]
          }
        ]
      },

      /** Obtain the performance of a sub-distributor*/
      GET_DisBillDown() {
        const _params = {
          id: this.$route.query.bill_id,
          member_id: this.$route.query.member_id
        }
        API_distribution.getDisBillDown(_params).then(response => {
          this.dataSource = response
        })
      },

      // The lines
      showTr({ row, index }) {
        let show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
        row._show = show
        return show ? '' : 'display:none;'
      },

      // On the lower
      toggle(trIndex) {
        this.dataDown[trIndex]._expanded = !this.dataDown[trIndex]._expanded
      },

      // Displays Spaces and ICONS for hierarchical relationships
      spaceIconShow(index) {
        return this.treeStructure && index === 0
      },

      // Click expand and close when the icon toggles
      toggleIconShow(index, record) {
        return this.treeStructure && index === 0 && record.item && record.item.length
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ div.toolbar {
    display: none;
  }

  .order-detail-container {
    background-color: #fff;
  }

  .d-header {
    padding: 10px 0 10px 20px;
    font-size: 14px;
    color: #333;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e1e8ed;

    &h2 {
      font-size: 14px;
      font-weight: 400;
    }
  }

  .item {
    width: 100%;
    position: relative;
    display: inline-block;
    vertical-align: top;
    box-sizing: border-box;
    padding: 16px 0 16px 20px;
    line-height: 24px;
    white-space: nowrap;

    & .item-label {
      min-width: 80px;
      float: left;
      margin-right: 20px;
      font-size: 14px;
      color: #999;
      text-align: right;
    }
    & .item-value {
      overflow: hidden;
      white-space: normal;
      word-break: break-all;
      font-size: 14px;
      color: #666;
    }
  }

  /deep/ .el-table td:not(.is-left) {
    text-align: center;
  }

  .goods-image {
    width: 50px;
    height: 50px;
  }
  .goods-name {
    color: #4183c4;
    &:hover { color: #f42424 }
  }
  .sku-spec {
    color: #ff9800;
    margin: 0;
  }

  /*A hierarchy*/
  .ms-tree-space{
    position: relative;
    top: 1px;
    display: inline-block;
    font-family: "Glyphicons Halflings";
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 14px;
    height: 14px;
  }
  .ms-tree-space::before{
    content: ""
  }
  /deep/ .el-icon-arrow-right {
    cursor: pointer;
  }
</style>


