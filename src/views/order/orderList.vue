<template>
  <div>
    <en-table-layout
      toolbar
      pagination
      :loading="loading"
      :tableData="tableData">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <span style="font-size: 14px;">Status：</span>
          <el-select v-model="params.order_status" placeholder="Please select the order status" @change="changeOrderStatus">
            <el-option
              v-for="item in orderStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button size="mini" type="primary" icon="el-icon-download" @click="handleExportOrders" style="margin-left: 5px">exportExcel</el-button>
          <span class="exprot-tip">When you export, all the data is exported by filtering criteria in the advanced search on the right. If not, clear the filter first！</span>
        </div>
        <div class="toolbar-search">
          <en-table-search
            @search="searchEvent"
            @advancedSearch="advancedSearchEvent"
            advanced
            advancedWidth="465"
            placeholder="Please enter your order number or commodity name">
            <template slot="advanced-content">
              <el-form ref="advancedForm" :model="advancedForm" label-width="80px">
                <el-form-item label="Order no.">
                  <el-input v-model="advancedForm.order_sn" clearable></el-input>
                </el-form-item>
                <el-form-item label="Name">
                  <el-input v-model="advancedForm.goods_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="Buyers account">
                  <el-input v-model="advancedForm.buyer_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="Date of order">
                  <el-date-picker
                    v-model="advancedForm.order_time_range"
                    type="daterange"
                    align="center"
                    :editable="false"
                    unlink-panels
                    range-separator="-"
                    start-placeholder="Start date"
                    end-placeholder="End date">
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
          <th class="shoplist-header"><span style="width: 100%;">Name</span> <span>Price/Quantity</span></th>
          <th>buyers</th>
          <!--<th>Create time</th>-->
          <th>Status</th>
          <!--<th>source</th>-->
          <th>Amount of real pay</th>
        </tr>
        </thead>
        <tbody v-for="item in tableData">
        <tr style="width: 100%;height: 10px;"></tr>
        <tr class="bg-order">
          <td class="shoplist-content-out" colspan="3">
            Order no.：{{item.sn}}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Create time: {{ item.create_time | unixToDate }}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            source: {{ item.client_type }}
            <svg-icon v-if="item.client_type === 'PC'" iconClass="pc" style="width: 15px;height: 15px;" />
            <svg-icon v-if="item.client_type === 'WAP' || item.client_type === 'APP'" iconClass="mobile" style="width: 15px;height: 15px;"/>
          </td>
          <td>
            <el-button type="text" @click="handleOperateOrder(item)">Check the details</el-button>
          </td>
        </tr>
        <tr>
          <!--product-->
          <td>
            <p v-for="shop in item.sku_list" class="shoplist-content">
              <span class="goods-info">
                <img :src="shop.goods_image" alt="" class="goods-image"/>
                <a :href="`${MixinBuyerDomain}/goods/${shop.goods_id}`" target="_blank" style="color: #00a2d4;">{{ shop.name }}</a>
              </span>
              <span>
                <a class="trade-record" :href="`${MixinBuyerDomain}/goods/snapshot?id=${shop.snapshot_id}&sku_id=${shop.sku_id}&orderData=${item.order_amount}`" target="_blank">
                  <el-button type="text">Trading snapshot</el-button>
                </a>
                <span>{{shop.original_price | unitPrice('￥')}}</span> × <span>{{ shop.num }}</span>
              </span>
            </p>
          </td>
          <!--buyers-->
          <td> {{ item.member_name }}</td>
          <!--Status-->
          <td>{{ item.order_status_text }}</td>
          <!--Amount of real pay-->
          <td>
            <div class="order-money">
              <!--Total order amount-->
              <span class="order-amount">{{ item.order_amount | unitPrice('￥')}}</span>
              <!--freight/The postage-->
              <span>freight({{ item.shipping_amount | unitPrice('￥') }})</span>
              <!--Method of payment-->
              <span>{{ item.payment_name }}</span>
            </div>
          </td>
        </tr>
        </tbody>
        <div v-if="tableData.length === 0 " class="empty-block">
          no data
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
        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10,
          ...this.$route.query
        },

        /** The list of data*/
        tableData: [],

        /** List paging data*/
        pageData: [],

        /** Advanced search data*/
        advancedForm: {},

        /** Order Status list*/
        orderStatusList: [
          { value: 'ALL', label: 'all' },
          { value: 'WAIT_PAY', label: 'For the payment' },
          { value: 'WAIT_SHIP', label: 'To send the goods' },
          { value: 'WAIT_ROG', label: 'For the goods' },
          { value: 'COMPLETE', label: 'Has been completed' },
          { value: 'CANCELLED', label: 'Has been cancelled' }
        ],

        /** Table maximum height*/
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
      /** Calculate height*/
      countTableHeight() {
        this.tableHeight = (document.body.clientHeight - 54 - 35 - 50)
      },

      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_OrderList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_OrderList()
      },

      /** Order status change*/
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

      /** Search Event Trigger*/
      searchEvent(data) {
        this.params = {
          ...this.params,
          keywords: data
        }
        delete this.params.order_status
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        this.GET_OrderList()
      },

      /** Advanced search event triggered*/
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

      /** To view、The operation order*/
      handleOperateOrder(item) {
        this.$router.push({ path: `/order/detail/${item.sn}` })
      },

      /** Export orders*/
      handleExportOrders() {
        API_order.exportOrders(this.params).then(response => {
          const json = {
            sheet_name: 'The order list',
            sheet_values: response.map(item => ({
              'Order no.': item.sn,
              'Create time': Foundation.unixToDate(item.create_time),
              'The total order': Foundation.formatPrice(item.order_amount),
              'The consignee': item.ship_name,
              'Status': item.order_status_text,
              'Payment status': item.pay_status_text,
              'The delivery status': item.ship_status_text,
              'Method of payment': item.payment_type === 'ONLINE' ? 'Online payment' : 'Cash on delivery',
              'Source of the order': item.client_type
            }))
          }
          this.MixinExportJosnToExcel(json, 'The order list')
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
  /* The toolbar*/
  .inner-toolbar {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 0 20px;
  }

  /*A pattern in the absence of data*/
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

  /*Form information*/
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

      /*Product information*/
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
    /* Commodity images*/
    .goods-image {
      width: 50px;
      height: 50px;
    }
    /** Trading snapshot*/
    .trade-record {
      display: inline-block;
      margin-right: 50px;
    }
  }

  /*The paging information*/
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

