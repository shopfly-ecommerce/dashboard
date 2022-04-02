<template>
  <div class="order-detail-container">
    <!--分销商结算单-->
    <el-row :gutter="0">
      <div class="d-header"> 分销商结算单  结算金额：
        {{ billOriginInfo.final_money }}(最终佣金) = {{ billOriginInfo.push_money }}(本期佣金) - {{ billOriginInfo.return_push_money }}(退还佣金)</div>
      <el-col v-for="col in billInfo" :key="col.key" :span="8">
        <div class="d-content">
          <div v-for="item in col.items" :key="item.key" class="item">
            <span class="item-label" v-html="item.label"></span>
            <span class="item-value">{{ item.value }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--分销商订单-->
    <el-row v-if="disOrderList" :gutter="0">
      <el-col :span="24">
        <div class="d-header">分销商订单</div>
        <en-table-layout
          :tableData="disOrderList"
          pagination
          height="200px"
          :loading="disOrderLoading">
          <template slot="table-columns">
            <el-table-column prop="sn" label="账单号"/>
            <el-table-column label="订单金额">
              <template slot-scope="scope">￥{{ scope.row.order_price | unitPrice }}</template>
            </el-table-column>
            <el-table-column prop="message" label="提成金额">
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
    <!--分销商退货订单-->
    <el-row v-if="disRefundOrderList" :gutter="0">
      <el-col :span="24">
        <div class="d-header">分销商退货订单</div>
        <en-table-layout
          :tableData="disRefundOrderList"
          pagination
          height="200px"
          :loading="disRefundOrderLoading">
          <template slot="table-columns">
            <el-table-column prop="sn" label="账单号"/>
            <el-table-column prop="op_name" label="订单金额">
              <template slot-scope="scope">￥{{ scope.row.order_price | unitPrice }}</template>
            </el-table-column>
            <el-table-column prop="message" label="退换提成金额">
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
    <!--分销商结构图-->
    <el-row :gutter="0">
      <el-col :span="24">
        <div class="d-header">分销商结构图</div>
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
        /** 结算单原始info */
        billOriginInfo: {},

        /** 结算单组合后info */
        billInfo: [],

        /** 分销订单 */
        disOrderList: [],

        /** 分销订单分页数据 */
        disOrderPageData: {},

        /** 分销订单loading */
        disOrderLoading: false,

        /** 分销订单参数 */
        disOrderParams: {
          page_no: 1,
          page_size: 10,
          ...this.$route.query
        },

        /** 分销退款订单 */
        disRefundOrderList: [],

        /** 分销退款订单分页数据 */
        disRefundOrderPageData: {},

        /** 分销退款订单loading */
        disRefundOrderLoading: false,

        /** 分销退款订单参数 */
        disRefundOrderParams: {
          page_no: 1,
          page_size: 10,
          ...this.$route.query
        },

        /** 默认展开 */
        defaultExpandAll: false,

        /** 是否默认树形结构数据 */
        treeStructure: true,

        /** 列信息 */
        columns: [
          {
            width: 50
          },
          {
            text: '分销商',
            dataIndex: 'member_name',
            width: 100
          },
          {
            text: '结算金额',
            dataIndex: 'final_money'
          },
          {
            text: '提成金额',
            dataIndex: 'push_money'
          },
          {
            text: '订单量',
            dataIndex: 'order_count'
          },
          {
            text: '订单金额',
            dataIndex: 'order_money'
          },
          {
            text: '退还提成金额',
            dataIndex: 'return_push_money'
          },
          {
            text: '退还订单金额',
            dataIndex: 'return_order_money'
          },
          {
            text: '退还订单量',
            dataIndex: 'return_order_count'
          }
        ],

        /**  下级分销商列表  */
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
      // 格式化数据源
      dataDown() {
        return Utils.MSDataTransfer.treeToArray(this.dataSource, null, null, this.defaultExpandAll)
      }
    },
    methods: {
      /** 获取分销订单列表 */
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

      /** 分销订单分页大小发生改变 */
      handleDisOrderPageSizeChange(size) {
        this.disOrderParams.page_size = size
        this.GET_DisOrderList()
      },

      /** 分销订单分页页数发生改变 */
      handleDisOrderPageCurrentChange(page) {
        this.disOrderParams.page_no = page
        this.GET_DisOrderList()
      },

      /** 获取分销退款订单列表 */
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

      /** 分销订单退款单分页大小发生改变 */
      handleDisRefundOrderPageSizeChange(size) {
        this.disRefundOrderParams.page_size = size
        this.GET_DisRefundOrderList()
      },

      /** 分销订单退款单分页页数发生改变 */
      handleDisRefundOrderPageCurrentChange(page) {
        this.disRefundOrderParams.page_no = page
        this.GET_DisRefundOrderList()
      },

      /** 获取分销商账单详情 */
      GET_BillDetails() {
        API_distribution.getDisBillDetails(this.$route.query.bill_id).then(response => {
          this.billOriginInfo = response
          this.billInfo = this.countShowData(response)
        })
      },

      /** 组合账单详情信息 */
      countShowData(info) {
        const f = Foundation
        return [
          {
            items: [
              { label: '分销商', value: info.member_name },
              { label: '订单数', value: info.order_count },
              { label: '退货订单数', value: info.return_order_count }
            ]
          },
          {
            items: [
              { label: '结算单号', value: info.sn },
              { label: '订单金额', value: f.formatPrice(info.order_money) },
              { label: '退还订单金额', value: f.formatPrice(info.return_order_money) }
            ]
          },
          {
            items: [
              { label: '周期', value: `${f.unixToDate(info.start_time, 'yyyy-MM-dd')} ~ ${f.unixToDate(info.end_time, 'yyyy-MM-dd')}` },
              { label: '提成金额', value: f.formatPrice(info.push_money) },
              { label: '退还提成金额', value: f.formatPrice(info.return_push_money) }
            ]
          }
        ]
      },

      /** 获取某个分销商下级业绩 */
      GET_DisBillDown() {
        const _params = {
          id: this.$route.query.bill_id,
          member_id: this.$route.query.member_id
        }
        API_distribution.getDisBillDown(_params).then(response => {
          this.dataSource = response
        })
      },

      // 显示行
      showTr({ row, index }) {
        let show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
        row._show = show
        return show ? '' : 'display:none;'
      },

      // 展开下级
      toggle(trIndex) {
        this.dataDown[trIndex]._expanded = !this.dataDown[trIndex]._expanded
      },

      // 显示层级关系的空格和图标
      spaceIconShow(index) {
        return this.treeStructure && index === 0
      },

      // 点击展开和关闭的时候，图标的切换
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

  /*层级展开*/
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


