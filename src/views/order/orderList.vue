<template>
  <div>
    <en-table-layout
      toolbar
      pagination
      :loading="loading"
      :tableData="tableData">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <span style="font-size: 14px;">订单状态：</span>
          <el-select v-model="params.order_status" placeholder="请选择订单状态" @change="changeOrderStatus">
            <el-option
              v-for="item in orderStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button size="mini" type="primary" icon="el-icon-download" @click="handleExportOrders" style="margin-left: 5px">导出Excel</el-button>
          <span class="exprot-tip">导出时，会按右侧高级搜索中的筛选条件导出全部数据。如果不需要，请先清空筛选条件！</span>
        </div>
        <div class="toolbar-search">
          <en-table-search
            @search="searchEvent"
            @advancedSearch="advancedSearchEvent"
            advanced
            advancedWidth="465"
            placeholder="请输入订单编号或者商品名称">
            <template slot="advanced-content">
              <el-form ref="advancedForm" :model="advancedForm" label-width="80px">
                <el-form-item label="订单编号">
                  <el-input v-model="advancedForm.order_sn" clearable></el-input>
                </el-form-item>
                <el-form-item label="商品名称">
                  <el-input v-model="advancedForm.goods_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="买家账号">
                  <el-input v-model="advancedForm.buyer_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="下单日期">
                  <el-date-picker
                    v-model="advancedForm.order_time_range"
                    type="daterange"
                    align="center"
                    :editable="false"
                    unlink-panels
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-form>
            </template>
          </en-table-search>
        </div>
      </div>
    </en-table-layout>
    <div class="my-table-out" :style="{maxHeight: tableMaxHeight + 'px'}">
      <table class="my-table">
        <thead>
        <tr class="bg-order">
          <th class="shoplist-header"><span style="width: 100%;">商品名称</span> <span>单价/数量</span></th>
          <th>买家</th>
          <!--<th>下单时间</th>-->
          <th>订单状态</th>
          <!--<th>来源</th>-->
          <th>实付金额</th>
        </tr>
        </thead>
        <tbody v-for="item in tableData">
        <tr style="width: 100%;height: 10px;"></tr>
        <tr class="bg-order">
          <td class="shoplist-content-out" colspan="3">
            订单编号：{{item.sn}}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            下单时间: {{ item.create_time | unixToDate }}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            来源: {{ item.client_type }}
            <svg-icon v-if="item.client_type === 'PC'" iconClass="pc" style="width: 15px;height: 15px;" />
            <svg-icon v-if="item.client_type === 'WAP' || item.client_type === 'APP'" iconClass="mobile" style="width: 15px;height: 15px;"/>
          </td>
          <td>
            <el-button type="text" @click="handleOperateOrder(item)">查看详情</el-button>
          </td>
        </tr>
        <tr>
          <!--商品-->
          <td>
            <p v-for="shop in item.sku_list" class="shoplist-content">
              <span class="goods-info">
                <img :src="shop.goods_image" alt="" class="goods-image"/>
                <a :href="`${MixinBuyerDomain}/goods/${shop.goods_id}`" target="_blank" style="color: #00a2d4;">{{ shop.name }}</a>
              </span>
              <span>
                <a class="trade-record" :href="`${MixinBuyerDomain}/goods/snapshot?id=${shop.snapshot_id}&sku_id=${shop.sku_id}&orderData=${item.order_amount}`" target="_blank">
                  <el-button type="text">交易快照</el-button>
                </a>
                <span>{{shop.original_price | unitPrice('￥')}}</span> × <span>{{ shop.num }}</span>
              </span>
            </p>
          </td>
          <!--买家-->
          <td> {{ item.member_name }}</td>
          <!--订单状态-->
          <td>{{ item.order_status_text }}</td>
          <!--实付金额-->
          <td>
            <div class="order-money">
              <!--订单总金额-->
              <span class="order-amount">{{ item.order_amount | unitPrice('￥')}}</span>
              <!--运费/邮费-->
              <span>运费({{ item.shipping_amount | unitPrice('￥') }})</span>
              <!--支付方式-->
              <span>{{ item.payment_name }}</span>
            </div>
          </td>
        </tr>
        </tbody>
        <div v-if="tableData.length === 0 " class="empty-block">
          暂无数据
        </div>
      </table>
    </div>
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
  </div>
</template>

<script>
  import * as API_order from '@/api/order'
  import { CategoryPicker } from '@/components'
  import { Foundation } from '~/ui-utils'

  export default {
    name: 'orderList',
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
          ...this.$route.query
        },

        /** 列表数据 */
        tableData: [],

        /** 列表分页数据 */
        pageData: [],

        /** 高级搜索数据 */
        advancedForm: {},

        /** 订单状态 列表*/
        orderStatusList: [
          { value: 'ALL', label: '全部' },
          { value: 'WAIT_PAY', label: '待付款' },
          { value: 'WAIT_SHIP', label: '待发货' },
          { value: 'WAIT_ROG', label: '待收货' },
          { value: 'COMPLETE', label: '已完成' },
          { value: 'CANCELLED', label: '已取消' }
        ],

        /** 表格最大高度 */
        tableMaxHeight: (document.body.clientHeight - 54 - 34 - 50 - 15)
      }
    },
    mounted() {
      this.GET_OrderList()
    },
    activated() {
      delete this.params.market_enable
      this.params = {
        ...this.params,
        ...this.$route.query
      }
      this.GET_OrderList()
      window.onresize = this.countTableHeight
    },
    beforeRouteUpdate(to, from, next) {
      delete this.params.market_enable
      this.params = {
        ...this.params,
        ...this.$route.query
      }
      this.GET_OrderList()
      next()
    },
    methods: {
      /** 计算高度 */
      countTableHeight() {
        this.tableHeight = (document.body.clientHeight - 54 - 35 - 50)
      },

      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_OrderList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_OrderList()
      },

      /** 订单状态改变 */
      changeOrderStatus(data) {
        delete this.params.keywords
        delete this.params.order_status
        if (data) {
          this.params = {
            ...this.params,
            order_status: data
          }
          this.params.page_no = 1
          this.params.page_size = 10
        }
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        this.GET_OrderList()
      },

      /** 搜索事件触发 */
      searchEvent(data) {
        this.params = {
          ...this.params,
          keywords: data
        }
        delete this.params.order_status
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        this.GET_OrderList()
      },

      /** 高级搜索事件触发 */
      advancedSearchEvent() {
        this.params = {
          ...this.params,
          ...this.advancedForm
        }
        delete this.params.start_time
        delete this.params.end_time
        if (this.advancedForm.order_time_range) {
          this.params.start_time = this.advancedForm.order_time_range[0].getTime() / 1000
          this.params.end_time = this.advancedForm.order_time_range[1].getTime() / 1000
        }
        delete this.params.keywords
        delete this.params.order_time_range
        this.GET_OrderList()
      },

      /** 查看、操作订单 */
      handleOperateOrder(item) {
        this.$router.push({ path: `/order/detail/${item.sn}` })
      },

      /** 导出订单 */
      handleExportOrders() {
        API_order.exportOrders(this.params).then(response => {
          const json = {
            sheet_name: '订单列表',
            sheet_values: response.map(item => ({
              '订单编号': item.sn,
              '下单时间': Foundation.unixToDate(item.create_time),
              '订单总额': Foundation.formatPrice(item.order_amount),
              '收货人': item.ship_name,
              '订单状态': item.order_status_text,
              '付款状态': item.pay_status_text,
              '发货状态': item.ship_status_text,
              '支付方式': item.payment_type === 'ONLINE' ? '在线支付' : '货到付款',
              '订单来源': item.client_type
            }))
          }
          this.MixinExportJosnToExcel(json, '订单列表')
        })
      },

      GET_OrderList() {
        this.loading = true
        API_order.getOrderList(this.params).then(response => {
          this.loading = false
          this.tableData = response.data
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ div.toolbar {
    height: 70px;
    padding: 20px 0;
  }
  /* 工具条*/
  .inner-toolbar {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 0 20px;
  }

  /*暂无数据时的样式*/
  /deep/ .el-table__empty-block {
    display: none;
  }

  .empty-block {
    position: relative;
    min-height: 60px;
    line-height: 60px;
    text-align: center;
    width: 190%;
    height: 100%;
    font-size: 14px;
    color: #606266;
  }

  /*表格信息*/
  .my-table-out{
    white-space: nowrap;
    overflow-y: scroll;
    overflow-x: scroll;
    text-overflow: ellipsis;
    width: 100%;
    max-height: 800px;
  }
  .my-table {
    width: 100%;
    margin-bottom: 40px;
    background: #fff;
    border-collapse: collapse;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    font-size: 14px;
    font-bold: 700;
    .bg-order {
      background: #FAFAFA;
    }
    thead {
      th {
        padding: 10px 0;
        border: 1px solid #ebeef5;
        border-collapse: collapse;
        color: #909399;
      }
      th.shoplist-header {
        padding: 10px 20px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
      }
    }
    tbody {
      margin-top: 10px;
      td {
        border: 1px solid #ebeef5;
        border-collapse: collapse;
        text-align: center;
        padding: 0;
      }
      td:first-child {
        text-align: left;
      }
      td:not(:first-child) {
        padding: 3px;
      }
      td.shoplist-content-out {
        padding-left: 20px;
      }

      /*商品信息*/
      p.shoplist-content:not(:last-child) {
        border-bottom: 1px solid #ebeef5;
        border-collapse: collapse;
      }
      p.shoplist-content {
        margin: 0;
        padding: 0 20px;
        box-sizing: padding-box;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
        .goods-info {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: flex-start;
          align-items: center;
          padding: 10px 0;
          img {
            display: block;
            margin-right: 10px;
          }
          a {
            display: block;
            color: #409EFF;
          }
        }
      }
      div.order-money {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
        span {
          display: inline-block;
          padding: 5px;
        }
        span.order-amount {
          color: red;
        }
      }
    }
    /* 商品图片 */
    .goods-image {
      width: 50px;
      height: 50px;
    }
    /** 交易快照 */
    .trade-record {
      display: inline-block;
      margin-right: 50px;
    }
  }

  /*分页信息*/
  section>div {
    position: relative;
  }
  .el-pagination {
    text-align: right;
    width: 100%;
    background: #ffffff;
    height: 40px;
    position: absolute;
    bottom: 0;
    right: 0;
    border-top: 1px solid #e5e5e5;
    padding: 5px 20px;
  }
  .exprot-tip {
    margin-left: 5px;
    color: red;
    font-size: 12px;
  }
</style>

