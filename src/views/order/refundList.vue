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
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="{ disabledDate(time) { return time.getTime() >= new Date(Math.ceil(Date.now() / 86400000 ) * 86400000 - 28800001).getTime() }, shortcuts: MixinPickerShortcuts }">
          </el-date-picker>
          <!-- disabledDate(time) { return time.getTime() > Date.now() } -->
          <el-button size="mini" type="primary" icon="el-icon-download" @click="handleExportRefund" style="margin-left: 5px">导出Excel</el-button>
        </div>
        <div class="toolbar-search">
          <en-table-search
            @search="searchEvent"
            @advancedSearch="advancedSearchEvent"
            advanced
            advancedWidth="465"
            placeholder="请输入订单编号">
            <template slot="advanced-content">
              <el-form ref="advancedForm" :model="advancedForm" label-width="100px">
                <el-form-item label="订单编号">
                  <el-input v-model="advancedForm.order_sn" clearable></el-input>
                </el-form-item>
                <el-form-item label="退货(款)单号">
                  <el-input v-model="advancedForm.sn" clearable></el-input>
                </el-form-item>
                <el-form-item label="类型">
                  <el-select v-model="advancedForm.refuse_type" placeholder="请选择" clearable>
                    <el-option label="退款" value="RETURN_MONEY"/>
                    <el-option label="退货" value="RETURN_GOODS"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="申请时间">
                  <el-date-picker
                    v-model="advancedForm.refund_time_range"
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
      <template slot="table-columns">
        <!--退款、货单号-->
        <el-table-column prop="sn" label="退款、货单号"/>
        <!--订单号-->
        <el-table-column prop="order_sn" label="订单号"/>
        <!--会员名称-->
        <el-table-column prop="member_name" label="会员名称"/>
        <!--创建时间-->
        <el-table-column label="申请时间">
          <template slot-scope="scope">{{ scope.row.create_time | unixToDate }}</template>
        </el-table-column>
        <!--类型-->
        <el-table-column prop="refuse_type_text" label="类型"/>
        <!--状态-->
        <el-table-column prop="refund_status_text" label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.refund_status_text }}</span>
            <div class="refund-fail-reason" v-if="scope.row.refund_status === 'REFUNDFAIL'" @click="showRefundFailReason(scope.row)">(退款失败原因)</div>
          </template>
        </el-table-column>
        <!--操作-->
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.after_sale_operate_allowable.allow_cancel"
              type="primary"
              @click="handleOperateRefund(scope.row)">审核</el-button>
            <el-button
              v-if="scope.row.after_sale_operate_allowable.allow_admin_refund"
              type="primary"
              @click="handleOperateRefund(scope.row)">退款</el-button>
            <el-button
              v-if="scope.row.after_sale_operate_allowable.allow_stock_in"
              type="primary"
              @click="handleOperateRefund(scope.row)">入库</el-button>
            <el-button
              v-if="!scope.row.after_sale_operate_allowable.allow_stock_in &&
              !scope.row.after_sale_operate_allowable.allow_cancel &&
              !scope.row.after_sale_operate_allowable.allow_admin_refund"
              type="primary"
              @click="handleOperateRefund(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </template>
      <!--分页-->
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
    <!--退款、退货审核-->
    <el-dialog title="退款、退货审核" :visible.sync="goodsRefundshow" width="50%" align="center">
      <div align="center">
        <div class="refund-info">
          <!--订单信息-->
          <div class="order-info">
            <h4 style="margin: 0;">订单信息</h4>
            <div class="order-info-item">
              <span>{{currentType}}单号: </span><span>{{ refundInfo.sn }}</span>
            </div>
            <div class="order-info-item">
              <span>关联订单: </span><span>{{ refundInfo.order_sn }}</span>
            </div>
            <div class="order-info-item">
              <span>申请退款金额: </span><span>{{ refundInfo.refund_price | unitPrice('¥')}}</span>
            </div>
            <div class="order-info-item">
              <span>{{currentType}}人: </span><span>{{  refundInfo.member_name}}</span>
            </div>
            <div class="order-info-item">
              <span>{{currentType}}状态: </span><span>{{ refundInfo.refund_status_text }}</span>
            </div>
            <div class="order-info-item">
              <span>申请时间:  </span><span>{{ refundInfo.create_time | unixToDate }}</span>
            </div>
          </div>
          <!--退款/货信息-->
          <div class="refund-info-relations">
            <div class="order-info-item">
              <span>{{currentType}}原因: </span><span>{{ refundInfo.refund_reason }}</span>
            </div>
            <div class="order-info-item">
              <span>详细描述:  </span><span>{{ refundInfo.customer_remark || '无'}}</span>
            </div>
            <div class="order-info-item">
              <span>退款渠道:  </span><span>{{ refundInfo.account_type_text || '无'}}</span>
            </div>
            <div class="order-info-item" v-if="accountShow && !bankShow && refundInfo.account_type !== 'BALANCE'">
              <span>退款账号:  </span><span>{{ refundInfo.return_account || '无'}}</span>
            </div>
            <div class="order-info-item" v-if="bankShow">
              <span>银行名称:  </span><span>{{ refundInfo.bank_name || '无'}}</span>
            </div>
            <div class="order-info-item" v-if="bankShow">
              <span>银行账号:  </span><span>{{ refundInfo.bank_account_number || '无'}}</span>
            </div>
            <div class="order-info-item" v-if="bankShow">
              <span>银行开户名:  </span><span>{{ refundInfo.bank_account_name || '无'}}</span>
            </div>
            <div class="order-info-item" v-if="bankShow">
              <span>银行开户行:  </span><span>{{ refundInfo.bank_deposit_name || '无'}}</span>
            </div>
            <div class="order-info-item">
              <span>退款金额:  </span>
              <el-input v-if="authOpera.allow_cancel || authOpera.allow_admin_refund" v-model="refundMoney">
                <template slot="prepend">¥</template>
              </el-input>
              <span v-if="!authOpera.allow_cancel && !authOpera.allow_admin_refund">
                {{ refundInfo.refund_price | unitPrice('¥') }}
              </span>
            </div>
            <div class="order-info-item order-info-remark">
              <span>审核备注:  </span>
              <el-input v-if="authOpera.allow_cancel" placeholder="最多200字" :maxlength="200" type="textarea" v-model="remark"></el-input>
              <span v-if="!authOpera.allow_cancel">{{ refundInfo.seller_remark || '无' }}</span>
            </div>
            <div class="order-info-item order-info-remark" v-if="!authOpera.allow_cancel && !authOpera.allow_admin_refund">
              <span style="width:70px;">退款备注:  </span>
              <span>{{ refundInfo.finance_remark || '无' }}</span>
            </div>
            <!--审核-->
            <div class="order-info-item" v-if="authOpera.allow_cancel">
              <span>审 核:  </span>
              <el-button type="primary" size="mini"  @click="handleRefundAuth(1)">通过</el-button>
              <el-button type="danger" size="mini"  @click="handleRefundAuth(0)">不通过</el-button>
            </div>
            <!--退款-->
            <div class="order-info-item" v-if="authOpera.allow_admin_refund">
              <span>退 款:  </span>
              <el-button type="primary" size="mini"  @click="handleRefund">退款</el-button>
            </div>
            <!--入库-->
            <div class="order-info-item" v-if="authOpera.allow_stock_in">
              <span>入 库: </span>
              <el-button type="primary" size="mini"  @click="handleWareHousing">确认入库</el-button>
            </div>
          </div>
        </div>
        <!--退货商品信息-->
        <en-table-layout :tableData="refundGoodsData" class="pop-table">
          <template slot="table-columns">
            <el-table-column label="商品图片">
              <template slot-scope="scope">
                <img :src="scope.row.goods_image" class="goods-image">
              </template>
            </el-table-column>
            <el-table-column label="商品名称">
              <template slot-scope="scope">
                <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank" style="color: #00a2d4;">{{ scope.row.goods_name }}</a>
              </template>
            </el-table-column>
            <el-table-column  prop="price" label="单价">
              <template slot-scope="scope">
                {{ scope.row.price | unitPrice('￥') }}
              </template>
            </el-table-column>
            <el-table-column  prop="ship_num" label="购买数量"/>
            <el-table-column  prop="return_num" label="退货数量"/>
          </template>
        </en-table-layout>
      </div>
    </el-dialog>
    <!--退款失败原因-->
    <el-dialog title="退款失败原因" :visible.sync="isShowRefundFailReason" width="17%" >
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
        /** 列表loading状态 */
        loading: false,

        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10
        },

        /** 列表数据 */
        tableData: null,

        /** 列表分页数据 */
        pageData: null,

        /** 高级搜索数据 */
        advancedForm: {

          order_sn: '',

          sn: '',

          refuse_type: '',

          refund_time_range: []
        },

        /** 当前退款/货 单号 */
        currentSn: '',

        /** 当前退款/货类型 文本*/
        currentType: '',

        /** 当前操作权限 */
        authOpera: {},

        /** 是否显示退款失败原因 */
        isShowRefundFailReason: false,

        /** 退款失败原因 */
        refund_fail_reason: '',

        /** 当前退款/货 信息 */
        refundInfo: {},

        /** 退款金额 */
        refundMoney: '',

        /** 退款商品列表数据 */
        refundGoodsData: [],

        /** 弹框是否显示 */
        goodsRefundshow: false,

        /** 导出Excel日期 */
        exportDateRange: [],

        /** 审核备注 */
        remark: '',
        /** 是否展示退款账号相关信息*/
        accountShow: false,
        /** 是否展示银行卡相关信息*/
        bankShow: false
      }
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_RefundOrder()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_RefundOrder()
      },

      /** 搜索事件触发 */
      searchEvent(data) {
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        this.params = {
          ...this.params,
          order_sn: data
        }
        this.GET_RefundOrder()
      },

      /** 高级搜索事件触发 */
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

      /** 四种对应操作 显示不同的弹框内容 */
      handleOperateRefund(row) {
        this.getRefundDetails(row)
      },

      /** 获取退款单列表数据 */
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

      /** 显示退款失败原因 */
      showRefundFailReason(row) {
        this.isShowRefundFailReason = false
        this.isShowRefundFailReason = true
        this.refund_fail_reason = row.refund_fail_reason
      },

      /** 查看退款/货单详细 */
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

      /** 卖家审核退款/货 */
      handleRefundAuth(agree) {
        if (!RegExp.money.test(this.refundMoney)) {
          this.$message.error('请输入正确的退款金额')
          return
        }
        const _tip = agree === 1 ? '通过' : '不通过'
        this.$confirm(`确认${_tip}审核么?`, '确认信息', { type: 'warning' })
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

      /** 卖家执行退款 */
      handleRefund() {
        this.$prompt('请输入退款备注！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.+/,
          maxlength: 200,
          inputErrorMessage: '请填写退款备注！'
        }).then(({ value }) => {
          if (value.length > 200) {
            this.$message.error('最多输入200个字符！')
          } else {
            API_refund.toRefund(this.currentSn, {
              refund_price: this.refundMoney,
              remark: value
            }).then(response => {
              this.$message.success('操作成功！')
              this.goodsRefundshow = false
              this.GET_RefundOrder()
            })
          }
        }).catch(() => {})
      },

      /** 导出退款单 */
      handleExportRefund() {
        const range = this.MixinClone(this.exportDateRange)
        if (!range || range.length === 0) {
          this.$message.error('请选择要导出的时间段！')
          return false
        }
        const start_time = parseInt(range[0] / 1000)
        const end_time = parseInt(range[1] / 1000)
        API_refund.exportRefundExcel({ start_time, end_time }).then(response => {
          const json = {
            sheet_name: '维权订单',
            sheet_values: response.map(item => ({
              '售后ID': item.id,
              '售后单号': item.sn,
              '退款相关订单号': item.order_sn,
              '支付方式': item.refund_way,
              '收款人': item.member_name,
              '售后状态': item.refund_status,
              '创建时间': item.create_time ? Foundation.unixToDate(item.create_time) : '',
              '退款金额': Foundation.formatPrice(item.refund_price),
              '退款时间': item.refund_time ? Foundation.unixToDate(item.refund_time) : ''
            }))
          }
          this.MixinExportJosnToExcel(json, '维权订单')
        })
      },

      /** 卖家执行入库操作 */
      handleWareHousing() {
        this.$confirm(`确定要执行入库操作么?`, '确认信息', { type: 'warning' })
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

  /* 退款失败原因*/
  .refund-fail-reason {
    color: red;
    cursor: pointer;
  }

  /** 退款/货信息 */
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
    /* 订单信息 */
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

  /*弹框表格*/
  /deep/ .pop-table {
    margin-top: 10px;
    border: 1px solid #f2f2f2;
    .toolbar {
      display: none;
    }
    /*商品图片*/
    .goods-image {
      width: 50px;
      height: 50px;
    }
  }

  /** 退货信息相关 */
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
