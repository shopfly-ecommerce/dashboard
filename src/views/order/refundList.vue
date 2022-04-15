<template>
  <div>
    <en-table-layout
      toolbar
      pagination
      :tableData="tableData"
      :loading="loading">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-date-picker
            v-model="exportDateRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="Start date"
            end-placeholder="End date"
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="{ disabledDate(time) { return time.getTime() >= new Date(Math.ceil(Date.now() / 86400000 ) * 86400000 - 28800001).getTime() }, shortcuts: MixinPickerShortcuts }">
          </el-date-picker>
          <!-- disabledDate(time) { return time.getTime() > Date.now() } -->
          <el-button size="mini" type="primary" icon="el-icon-download" @click="handleExportRefund" style="margin-left: 5px">exportExcel</el-button>
        </div>
        <div class="toolbar-search">
          <en-table-search
            @search="searchEvent"
            @advancedSearch="advancedSearchEvent"
            advanced
            advancedWidth="465"
            placeholder="Please enter the order number">
            <template slot="advanced-content">
              <el-form ref="advancedForm" :model="advancedForm" label-width="100px">
                <el-form-item label="Order no.">
                  <el-input v-model="advancedForm.order_sn" clearable></el-input>
                </el-form-item>
                <el-form-item label="Return of the goods(paragraph)Order no.">
                  <el-input v-model="advancedForm.sn" clearable></el-input>
                </el-form-item>
                <el-form-item label="type">
                  <el-select v-model="advancedForm.refuse_type" placeholder="Please select" clearable>
                    <el-option label="A refund" value="RETURN_MONEY"/>
                    <el-option label="Return of the goods" value="RETURN_GOODS"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="To apply for time">
                  <el-date-picker
                    v-model="advancedForm.refund_time_range"
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
      <template slot="table-columns">
        <!--A refund、Invoice no.-->
        <el-table-column prop="sn" label="A refund、Invoice no."/>
        <!--The order number-->
        <el-table-column prop="order_sn" label="The order number"/>
        <!--Member name-->
        <el-table-column prop="member_name" label="Member name"/>
        <!--Last update-->
        <el-table-column label="To apply for time">
          <template slot-scope="scope">{{ scope.row.create_time | unixToDate }}</template>
        </el-table-column>
        <!--type-->
        <el-table-column prop="refuse_type_text" label="type"/>
        <!--Status-->
        <el-table-column prop="refund_status_text" label="Status">
          <template slot-scope="scope">
            <span>{{ scope.row.refund_status_text }}</span>
            <div class="refund-fail-reason" v-if="scope.row.refund_status === 'REFUNDFAIL'" @click="showRefundFailReason(scope.row)">(Reasons for refund Failure)</div>
          </template>
        </el-table-column>
        <!--Operation-->
        <el-table-column label="Operation" width="150">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.after_sale_operate_allowable.allow_cancel"
              type="primary"
              @click="handleOperateRefund(scope.row)">audit</el-button>
            <el-button
              v-if="scope.row.after_sale_operate_allowable.allow_admin_refund"
              type="primary"
              @click="handleOperateRefund(scope.row)">A refund</el-button>
            <el-button
              v-if="scope.row.after_sale_operate_allowable.allow_stock_in"
              type="primary"
              @click="handleOperateRefund(scope.row)">Put in storage</el-button>
            <el-button
              v-if="!scope.row.after_sale_operate_allowable.allow_stock_in &&
              !scope.row.after_sale_operate_allowable.allow_cancel &&
              !scope.row.after_sale_operate_allowable.allow_admin_refund"
              type="primary"
              @click="handleOperateRefund(scope.row)">To view</el-button>
          </template>
        </el-table-column>
      </template>
      <!--paging-->
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
    <!--A refund、Return of the audit-->
    <el-dialog title="A refund、Return of the audit" :visible.sync="goodsRefundshow" width="50%" align="center">
      <div align="center">
        <div class="refund-info">
          <!--The order information-->
          <div class="order-info">
            <h4 style="margin: 0;">The order information</h4>
            <div class="order-info-item">
              <span>{{currentType}}Order no.: </span><span>{{ refundInfo.sn }}</span>
            </div>
            <div class="order-info-item">
              <span>Associated with the order: </span><span>{{ refundInfo.order_sn }}</span>
            </div>
            <div class="order-info-item">
              <span>Amount of refund application: </span><span>{{ refundInfo.refund_price | unitPrice('¥')}}</span>
            </div>
            <div class="order-info-item">
              <span>{{currentType}}people: </span><span>{{  refundInfo.member_name}}</span>
            </div>
            <div class="order-info-item">
              <span>{{currentType}}Status: </span><span>{{ refundInfo.refund_status_text }}</span>
            </div>
            <div class="order-info-item">
              <span>To apply for time:  </span><span>{{ refundInfo.create_time | unixToDate }}</span>
            </div>
          </div>
          <!--A refund/Cargo information-->
          <div class="refund-info-relations">
            <div class="order-info-item">
              <span>{{currentType}}why: </span><span>{{ refundInfo.refund_reason }}</span>
            </div>
            <div class="order-info-item">
              <span>A detailed description:  </span><span>{{ refundInfo.customer_remark || 'There is no'}}</span>
            </div>
            <div class="order-info-item">
              <span>Refund channels:  </span><span>{{ refundInfo.account_type_text || 'There is no'}}</span>
            </div>
            <div class="order-info-item" v-if="accountShow && !bankShow && refundInfo.account_type !== 'BALANCE'">
              <span>Refund account:  </span><span>{{ refundInfo.return_account || 'There is no'}}</span>
            </div>
            <div class="order-info-item" v-if="bankShow">
              <span>Bank name:  </span><span>{{ refundInfo.bank_name || 'There is no'}}</span>
            </div>
            <div class="order-info-item" v-if="bankShow">
              <span>The bank account:  </span><span>{{ refundInfo.bank_account_number || 'There is no'}}</span>
            </div>
            <div class="order-info-item" v-if="bankShow">
              <span>Bank account name:  </span><span>{{ refundInfo.bank_account_name || 'There is no'}}</span>
            </div>
            <div class="order-info-item" v-if="bankShow">
              <span>Bank opening bank:  </span><span>{{ refundInfo.bank_deposit_name || 'There is no'}}</span>
            </div>
            <div class="order-info-item">
              <span>The refund amount:  </span>
              <el-input v-if="authOpera.allow_cancel || authOpera.allow_admin_refund" v-model="refundMoney">
                <template slot="prepend">¥</template>
              </el-input>
              <span v-if="!authOpera.allow_cancel && !authOpera.allow_admin_refund">
                {{ refundInfo.refund_price | unitPrice('¥') }}
              </span>
            </div>
            <div class="order-info-item order-info-remark">
              <span>Review the note:  </span>
              <el-input v-if="authOpera.allow_cancel" placeholder="most200word" :maxlength="200" type="textarea" v-model="remark"></el-input>
              <span v-if="!authOpera.allow_cancel">{{ refundInfo.seller_remark || 'There is no' }}</span>
            </div>
            <div class="order-info-item order-info-remark" v-if="!authOpera.allow_cancel && !authOpera.allow_admin_refund">
              <span style="width:70px;">The refund note:  </span>
              <span>{{ refundInfo.finance_remark || 'There is no' }}</span>
            </div>
            <!--audit-->
            <div class="order-info-item" v-if="authOpera.allow_cancel">
              <span>audit:  </span>
              <el-button type="primary" size="mini"  @click="handleRefundAuth(1)">through</el-button>
              <el-button type="danger" size="mini"  @click="handleRefundAuth(0)">Not through</el-button>
            </div>
            <!--A refund-->
            <div class="order-info-item" v-if="authOpera.allow_admin_refund">
              <span>A refund:  </span>
              <el-button type="primary" size="mini"  @click="handleRefund">A refund</el-button>
            </div>
            <!--Put in storage-->
            <div class="order-info-item" v-if="authOpera.allow_stock_in">
              <span>Put in storage: </span>
              <el-button type="primary" size="mini"  @click="handleWareHousing">Confirm the inventory</el-button>
            </div>
          </div>
        </div>
        <!--Returned Product Information-->
        <en-table-layout :tableData="refundGoodsData" class="pop-table">
          <template slot="table-columns">
            <el-table-column label="Commodity images">
              <template slot-scope="scope">
                <img :src="scope.row.goods_image" class="goods-image">
              </template>
            </el-table-column>
            <el-table-column label="Name">
              <template slot-scope="scope">
                <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank" style="color: #00a2d4;">{{ scope.row.goods_name }}</a>
              </template>
            </el-table-column>
            <el-table-column  prop="price" label="Price">
              <template slot-scope="scope">
                {{ scope.row.price | unitPrice('￥') }}
              </template>
            </el-table-column>
            <el-table-column  prop="ship_num" label="Purchase quantity"/>
            <el-table-column  prop="return_num" label="Returns the number of"/>
          </template>
        </en-table-layout>
      </div>
    </el-dialog>
    <!--Reasons for refund Failure-->
    <el-dialog title="Reasons for refund Failure" :visible.sync="isShowRefundFailReason" width="17%" >
      <div align="center">{{ refund_fail_reason }}</div>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_refund from '@/api/refund'
  import { CategoryPicker } from '@/components'
  import { RegExp, Foundation } from '~/ui-utils'

  export default {
    name: 'refundList',
    components: {
      [CategoryPicker.name]: CategoryPicker
    },
    mounted() {
      this.GET_RefundOrder()
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

        /** Advanced search data*/
        advancedForm: {

          order_sn: '',

          sn: '',

          refuse_type: '',

          refund_time_range: []
        },

        /** The refund/Invoice no.*/
        currentSn: '',

        /** The refund/Cargo type text*/
        currentType: '',

        /** Current operation permissions*/
        authOpera: {},

        /** Whether to show the reason for the refund failure*/
        isShowRefundFailReason: false,

        /** Reasons for refund Failure*/
        refund_fail_reason: '',

        /** The refund/Cargo information*/
        refundInfo: {},

        /** The refund amount*/
        refundMoney: '',

        /** Refunded item list data*/
        refundGoodsData: [],

        /** Whether the pop-up is displayed*/
        goodsRefundshow: false,

        /** exportExcelThe date of*/
        exportDateRange: [],

        /** Review the note*/
        remark: '',
        /** Whether to display the refund account information*/
        accountShow: false,
        /** Whether to present bank card information*/
        bankShow: false
      }
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_RefundOrder()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_RefundOrder()
      },

      /** Search Event Trigger*/
      searchEvent(data) {
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        this.params = {
          ...this.params,
          order_sn: data
        }
        this.GET_RefundOrder()
      },

      /** Advanced search event triggered*/
      advancedSearchEvent() {
        this.params = {
          ...this.params,
          ...this.advancedForm
        }
        delete this.params.start_time
        delete this.params.end_time
        if (this.advancedForm.refund_time_range && this.advancedForm.refund_time_range.length > 0) {
          this.params.start_time = this.advancedForm.refund_time_range[0].getTime() / 1000
          this.params.end_time = this.advancedForm.refund_time_range[1].getTime() / 1000
        }
        delete this.params.refund_time_range
        this.GET_RefundOrder()
      },

      /** The four operations display different pop-up contents*/
      handleOperateRefund(row) {
        this.getRefundDetails(row)
      },

      /** Gets the refund single column table data*/
      GET_RefundOrder() {
        this.loading = true
        API_refund.getRefundList(this.params).then(response => {
          this.loading = false
          this.tableData = response.data
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
        })
      },

      /** Show the reason for the refund failure*/
      showRefundFailReason(row) {
        this.isShowRefundFailReason = false
        this.isShowRefundFailReason = true
        this.refund_fail_reason = row.refund_fail_reason
      },

      /** To see a refund/List in detail*/
      getRefundDetails(row) {
        this.currentType = row.refuse_type_text
        this.currentSn = row.sn
        this.authOpera = row.after_sale_operate_allowable
        this.refundMoney = row.refund_price
        API_refund.getRefundDetails(row.sn).then(response => {
          this.goodsRefundshow = true
          this.refundInfo = response.refund
          this.remark = ''
          if (Array.isArray(response.refund_goods)) {
            this.refundGoodsData = response.refund_goods
          }
          console.log(this.refundInfo)
          this.accountShow = this.refundInfo.refund_way === 'OFFLINE'
          this.bankShow = this.refundInfo.refund_way === 'OFFLINE' && this.refundInfo.account_type === 'BANKTRANSFER'
        })
      },

      /** Seller review and refund/cargo*/
      handleRefundAuth(agree) {
        if (!RegExp.money.test(this.refundMoney)) {
          this.$message.error('Please enter the correct refund amount')
          return
        }
        const _tip = agree === 1 ? 'through' : '不through'
        this.$confirm(`confirm${_tip}Audit??`, 'confirm信息', { type: 'warning' })
          .then(() => {
            const _params = {
              agree: agree,
              refund_price: this.refundMoney,
              remark: this.remark
            }
            API_refund.refundAuth(this.currentSn, _params).then(() => {
              this.goodsRefundshow = false
              this.GET_RefundOrder()
            })
          })
      },

      /** Seller executes refund*/
      handleRefund() {
        this.$prompt('Please enter refund remarks！', 'prompt', {
          confirmButtonText: 'save',
          cancelButtonText: 'cancel',
          inputPattern: /.+/,
          maxlength: 200,
          inputErrorMessage: 'Please fill in the refund remark！'
        }).then(({ value }) => {
          if (value.length > 200) {
            this.$message.error('Most input200A character！')
          } else {
            API_refund.toRefund(this.currentSn, {
              refund_price: this.refundMoney,
              remark: value
            }).then(response => {
              this.$message.success('Operation is successful！')
              this.goodsRefundshow = false
              this.GET_RefundOrder()
            })
          }
        }).catch(() => {})
      },

      /** Export refund form*/
      handleExportRefund() {
        const range = this.MixinClone(this.exportDateRange)
        if (!range || range.length === 0) {
          this.$message.error('Please select the time period to export！')
          return false
        }
        const start_time = parseInt(range[0] / 1000)
        const end_time = parseInt(range[1] / 1000)
        API_refund.exportRefundExcel({ start_time, end_time }).then(response => {
          const json = {
            sheet_name: 'Rights of the order',
            sheet_values: response.map(item => ({
              'after-salesID': item.id,
              'After a single number': item.sn,
              'Refund related order number': item.order_sn,
              'Method of payment': item.refund_way,
              'The payee': item.member_name,
              'After state': item.refund_status,
              'Last update': item.create_time ? Foundation.unixToDate(item.create_time) : '',
              'The refund amount': Foundation.formatPrice(item.refund_price),
              'A refund of time': item.refund_time ? Foundation.unixToDate(item.refund_time) : ''
            }))
          }
          this.MixinExportJosnToExcel(json, 'Rights of the order')
        })
      },

      /** The seller performs the warehousing operation*/
      handleWareHousing() {
        this.$confirm(`Are you sure you want to perform the inbound operation?`, 'Confirm the information', { type: 'warning' })
          .then(() => {
            const _params = {
              remark: ''
            }
            API_refund.wareHousing(this.currentSn, _params).then(() => {
              this.goodsRefundshow = false
              this.GET_RefundOrder()
            })
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

  /deep/ .el-table td:not(.is-left) {
    text-align: center;
  }

  .inner-toolbar {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 0 20px;
  }

  /* Reasons for refund Failure*/
  .refund-fail-reason {
    color: red;
    cursor: pointer;
  }

  /** A refund/Cargo information*/
  .refund-info {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
    border: 1px solid #f2f2f2;
    border-collapse: collapse;
    div {
      flex-grow: 1;
      width: 50%;
    }
    /* The order information*/
    div.order-info {
      padding-bottom: 5px;
      border-right: 1px solid #f2f2f2;
      border-collapse: collapse;
      h4 {
       text-align: left;
       font-size: 13px;
       color: #333;
       padding: 10px;
       background-color: #f2f2f2 ;
      }
      .order-info-item {
       text-align: left;
       width: 100%;
       margin: 0;
       padding: 8px;
       span {
         font-size: 13px;
       }
      }
    }
  }

  /*Bounced form*/
  /deep/ .pop-table {
    margin-top: 10px;
    border: 1px solid #f2f2f2;
    .toolbar {
      display: none;
    }
    /*Commodity images*/
    .goods-image {
      width: 50px;
      height: 50px;
    }
  }

  /** Return information related*/
  .refund-info-relations {
    border-collapse: collapse;
    .order-info-item {
      text-align: left;
      width: 100%;
      margin: 0;
      padding: 8px;
      span {
        font-size: 13px;
        overflow: hidden;
        word-break: break-word;
      }
    }
    .order-info-remark {
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }

    /*textarea*/
    /deep/ .el-textarea__inner {
      width: 80%;
      margin-left: 2px;
    }
  }
</style>
