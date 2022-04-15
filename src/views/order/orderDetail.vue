<template>
  <div v-loading="loading" class="order-detail-container">
    <div class="order-info" v-if="orderDetail">
      <!--accordion-->
      <el-collapse  class="order-collapse" :value="['order', 'promotions', 'other']">
        <!--The order information-->
        <el-collapse-item title="The order information" name="order">
          <div class="order-item">
            <span class="item-name">Shipping address：</span>
            <span class="item-value">
              {{ orderDetail.ship_province }}
              {{ orderDetail.ship_city }}
              {{ orderDetail.ship_county }}
              {{ orderDetail.ship_town }}
              {{ orderDetail.ship_addr }}
            </span>
          </div>
          <div class="order-item">
            <span class="item-name">The consignee：</span>
            <span class="item-value">{{ orderDetail.ship_name }}</span>
          </div>
          <div class="order-item">
            <span class="item-name">Contact phone number：</span>
            <span class="item-value">{{ orderDetail.ship_mobile }}</span>
          </div>
          <hr>
          <!--Order No. Payment Terms Order time-->
          <div class="order-item">
            <span class="item-name">Order no.：</span>
            <span class="item-value">{{ orderDetail.sn }}</span>
          </div>
          <div class="order-item">
            <span class="item-name">Payment method：</span>
            <span class="item-value">{{ orderDetail.payment_type | paymentTypeFilter }}</span>
          </div>
          <div class="order-item">
            <span class="item-name">Payment channel：</span>
            <span class="item-value">{{ orderDetail.payment_method_name || 'There is no' }}</span>
          </div>
          <div class="order-item">
            <span class="item-name">Create time：</span>
            <span class="item-value">{{ orderDetail.create_time | unixToDate }}</span>
          </div>
          <hr>
          <!--Related fees-->
          <div class="order-item">
            <span class="item-name">Price：</span>
            <span class="item-value">{{ orderDetail.goods_price | unitPrice('¥') }}</span>
          </div>
          <div class="order-item">
            <span class="item-name">freight：</span>
            <span class="item-value">{{ orderDetail.shipping_price | unitPrice('¥') }}</span>
          </div>
          <div class="order-item">
            <span class="item-name">Total：</span>
            <span class="item-value">{{ orderDetail.order_price | unitPrice('¥') }}</span>
          </div>
        </el-collapse-item>
        <!--Promotional information-->
        <el-collapse-item title="Promotional information" name="promotions" v-if="orderDetail.cash_back || orderDetail.gift_point || orderDetail.coupon_price">
          <div class="order-item" v-if="orderDetail.cash_back">
            <span class="item-name">Cashback amount：</span>
            <span class="item-value">-{{ orderDetail.cash_back | unitPrice('¥') }}</span>
          </div>
          <div class="order-item" v-if="orderDetail.coupon_price">
            <span class="item-name">Coupon deduction：</span>
            <span class="item-value">-{{ orderDetail.coupon_price | unitPrice('¥') }}</span>
          </div>
          <div class="order-item" v-if="orderDetail.use_point">
            <span class="item-name">Points deduction：</span>
            <span class="item-value">-{{ orderDetail.use_point }}point</span>
          </div>
          <div class="order-item" v-if="orderDetail.gift_point">
            <span class="item-name">Present integral：</span>
            <span class="item-value">{{ orderDetail.gift_point }}</span>
          </div>
        </el-collapse-item>
        <!--Other information（invoice、note）-->
        <el-collapse-item title="Other information（invoice、note）" name="other">
          <div class="order-item">
            <span class="item-name">The order note：</span>
            <span class="item-value" style="overflow: hidden;word-break: break-word;">{{ orderDetail.remark || 'There is no' }}</span>
          </div>
          <div class="order-item" v-if="orderDetail.cancel_reason">
            <span class="item-name">Cancel the reason：</span>
            <span class="item-value" style="overflow: hidden;word-break: break-word;">{{ orderDetail.cancel_reason }}</span>
          </div>
          <div class="order-item">
            <span class="item-name">Delivery time：</span>
            <span class="item-value">{{ orderDetail.receive_time }}</span>
          </div>
          <template v-if="orderDetail.receipt_history">
            <div class="order-item">
              <span class="item-name">Invoice type：</span>
              <span class="item-value">{{ orderDetail.receipt_history.receipt_type }}</span>
            </div>
            <div class="order-item">
              <span class="item-name">The invoice looked up：</span>
              <span class="item-value">{{ orderDetail.receipt_history.receipt_title }}</span>
            </div>
            <div v-if="orderDetail.receipt_history.tax_no" class="order-item">
              <span class="item-name">ein：</span>
              <span class="item-value">{{ orderDetail.receipt_history.tax_no }}</span>
            </div>
            <div class="order-item">
              <span class="item-name">The invoice content：</span>
              <span class="item-value">{{ orderDetail.receipt_history.receipt_content }}</span>
            </div>
          </template>
        </el-collapse-item>
      </el-collapse>
      <!--Status/ Logistics information-->
      <div class="order-status-info">
        <!--Status-->
        <div v-if="logisticsStatus">
          <div class="order-status">
            <i class="el-icon-check"></i>  Status：{{ orderDetail.order_status_text }}
          </div>
          <div class="order-item">
            <span class="item-name"> The order note：</span>
            <span class="item-value" style="overflow: hidden;word-break: break-word;">{{ orderDetail.remark || 'There is no' }}</span>
          </div>
          <div class="order-item">
            <span class="item-name">Delivery time：</span>
            <span class="item-value">{{ orderDetail.receive_time }}</span>
          </div>
          <template v-if="orderDetail.receipt_history">
            <div class="order-item">
              <span class="item-name">Invoice type：</span>
              <span class="item-value">{{ orderDetail.receipt_history.receipt_type }}</span>
            </div>
            <div class="order-item">
              <span class="item-name">The invoice looked up：</span>
              <span class="item-value">{{ orderDetail.receipt_history.receipt_title }}</span>
            </div>
            <div v-if="orderDetail.receipt_history.tax_no" class="order-item">
              <span class="item-name"> tax&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; No.：</span>
              <span class="item-value">{{ orderDetail.receipt_history.tax_no }}</span>
            </div>
            <div class="order-item">
              <span class="item-name">The invoice content：</span>
              <span class="item-value">{{ orderDetail.receipt_history.receipt_content }}</span>
            </div>
          </template>
          <div class="order-item" v-if="isLooklogistics">
            <span class="item-name">Logistics information：</span>
            <span class="item-value">
            <el-button type="text" @click="looklogistics">Click to view</el-button>
          </span>
          </div>
        </div>
        <!--Logistics information-->
        <div v-if="!logisticsStatus">
          <en-table-layout
            :tableData="logisticsData"
            :loading="loading">
            <div slot="toolbar" class="inner-toolbar">
              <span style="line-height: 35px;">Logistics information</span>
            </div>
            <template slot="table-columns">
              <!--The name of the company-->
              <el-table-column prop="name" label="The name of the company"/>
              <!--Logistics single number-->
              <el-table-column label="Logistics single number">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.ship_no" @change="() => { scope.row.ship_no = scope.row.ship_no.trim() }" :maxlength="20"></el-input>
                </template>
              </el-table-column>
              <!--Whether electronic planes are supported-->
              <el-table-column label="Whether electronic planes are supported">
                <template slot-scope="scope">
                  <span v-if="scope.row.is_waybill === 0">Electronic planes are not supported</span>
                  <el-button
                    type="text"
                    v-if="scope.row.is_waybill === 1"
                    @click="produceElectronicSurface(scope.row)">Generate an electron plane</el-button>
                </template>
              </el-table-column>
              <!--Operation-->
              <el-table-column label="Operation" width="150">
                <template slot-scope="scope">
                  <el-button
                    plain type="primary"
                    @click="deliverGoods(scope.row)">The delivery
                  </el-button>
                </template>
              </el-table-column>
            </template>
          </en-table-layout>
        </div>
        <div class="opera-btn">
          <el-button v-if="isShowEditShipName" plain type="info" @click="adjustConsignee" >Modify consignee information</el-button>
          <el-button v-if="isShowEditOrderPrice" plain type="info" @click="adjustPrice" >Adjust the price</el-button>
          <el-button
            plain
            type="info"
            size="mini"
            v-if="orderDetail.order_operate_allowable_vo.allow_pay"
            @click="confirmPay"
          >Confirm receipt</el-button>
          <el-button
            plain
            type="info"
            size="mini"
            v-if="orderDetail.order_operate_allowable_vo.allow_cancel"
            @click="cancelOrder"
          >Cancel the order</el-button>
        </div>
      </div>
    </div>
    <!--Order status step bar-->
    <el-steps  align-center style="margin-top: 20px;" simple>
      <el-step v-for="item in stepList" :title="item.text" :key="item.text" :status="item.show_status"></el-step>
    </el-steps>
    <!--Products-->
    <div>
      <el-table :data="productList" :header-cell-style="{textAlign: 'center'}">
        <el-table-column label="Products" width="180">
          <template slot-scope="scope">
            <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank">
              <img :src="scope.row.goods_image" class="goods-image"/>
            </a>
          </template>
        </el-table-column>
        <el-table-column label="Name">
          <template slot-scope="scope">
            <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank" style="color: #00a2d4;">{{ scope.row.name }}</a>
            <p class="sku-spec">{{ scope.row | formatterSkuSpec }}</p>
            <p class="sku-act-tags" v-if="scope.row.promotion_tags && scope.row.promotion_tags.length">
              <span class="sku-act-tag" v-for="(tag, index) in scope.row.promotion_tags" :key="index">{{ tag }}</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="Price（USD）" width="150">
          <template slot-scope="scope">{{ scope.row.original_price | unitPrice('￥') }}</template>
        </el-table-column>
        <el-table-column prop="num" label="Quantity" width="120"/>
        <el-table-column label="subtotal" width="120">
          <template slot-scope="scope">{{ (scope.row.original_price * scope.row.num) | unitPrice('￥') }}</template>
        </el-table-column>
      </el-table>
    </div>
    <!--Gift list-->
    <div v-if="orderDetail && orderDetail.gift_list && orderDetail.gift_list.length">
      <el-table :data="orderDetail.gift_list" :header-cell-style="{textAlign: 'center'}">
        <el-table-column label="Gift list" width="180">
          <template slot-scope="scope">
            <a :href="scope.row.gift_img" target="_blank">
              <img :src="scope.row.gift_img" class="goods-image"/>
            </a>
          </template>
        </el-table-column>
        <el-table-column label="Name of gift" >
          <template slot-scope="scope">
            <a :href="scope.row.gift_img" target="_blank">{{ scope.row.gift_name }}</a>
          </template>
        </el-table-column>
        <el-table-column label="Present price" width="150">
          <template slot-scope="scope">{{ scope.row.gift_price | unitPrice('￥') }}</template>
        </el-table-column>
        <el-table-column label="" width="120"/>
        <el-table-column label="" width="120"/>
      </el-table>
    </div>
    <!--Adjust the price/ Modify consignee information-->
    <el-dialog :title="dialogTitle" :visible.sync="orderDetailShow" :width="dialogWidth">
      <div align="center">
        <!--Adjust the total price of order-->
        <el-form
          v-show="triggerStatus === 1"
          status-icon
          ref="adjustPriceForm"
          :rules="orderRules"
          label-position="right">
          <el-form-item prop="adjustedPrice">
            <el-input placeholder="Please enter the total price of the order" v-model="adjustedPrice" @change="() => { adjustedPrice = adjustedPrice.trim() }">
              <template slot="prepend">¥</template>
            </el-input>
          </el-form-item>
        </el-form>
        <!--Modify consignee information-->
        <el-form
          :model="ConsigneeForm"
          ref="ConsigneeForm"
          :rules="orderRules"
          status-icon
          v-show="triggerStatus === 2"
          label-position="right"
          label-width="120px">
          <el-form-item label="The consignee：" prop="ship_name" >
            <el-input  v-model="ConsigneeForm.ship_name" @change="() => { ConsigneeForm.ship_name = ConsigneeForm.ship_name.trim() }" maxlength="20" placeholder="limit20word"></el-input>
          </el-form-item>
          <el-form-item label="Mobile phone：" prop="ship_mobile" >
            <el-input  v-model.number="ConsigneeForm.ship_mobile" maxlength="11" ></el-input>
          </el-form-item>
          <el-form-item label=" ：" prop="region" class="area-select">
            <en-region-picker :api="MixinRegionApi" :default="areas" @changed="handleChangeArea"></en-region-picker>
          </el-form-item>
          <el-form-item label="Detailed address：" prop="ship_addr" >
            <el-input  v-model="ConsigneeForm.ship_addr" @change="() => { ConsigneeForm.ship_addr = ConsigneeForm.ship_addr.trim() }" placeholder="limit20word" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="Delivery time：" prop="receive_time" style="text-align: left;">
            <el-select v-model="ConsigneeForm.receive_time" placeholder="Please select">
              <el-option label="At any time" value="At any time"></el-option>
              <el-option label="Only working days" value="Only working days"></el-option>
              <el-option label="Only holiday" value="Only holiday"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="The order note：" prop="remark">
            <el-input  type="textarea" rows="4" v-model="ConsigneeForm.remark" placeholder="limit200word" maxlength="200"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelOrderDetail">cancel</el-button>
        <el-button type="primary" @click="reserveOrderDetail">save</el-button>
      </div>
    </el-dialog>
    <!--View logistics information-->
    <el-dialog :visible.sync="logisticsShow" width="400px" align="center">
      <div slot="title">
        <h3 style="margin: 10px 0;">Logistics information</h3>
        <div class="logistics-base">
          <span>Logistics company：{{ logisticsName }}</span>
          <span>Courier number：{{ logisticsNo }}</span>
        </div>
      </div>
      <div class="logistics-info">
        <div v-if="logisticsInfoList">
          <el-steps direction="vertical" :active="1" align-center space="100px">
            <el-step
              v-for="(row, index) in logisticsInfoList"
              :title="row.time"
              :key="index"
              :status="index === 0 ? 'success' : 'wait'"
              :description="row.context"/>
          </el-steps>
        </div>
        <div v-else>There is no logistics information, please wait patiently！</div>
      </div>
    </el-dialog>
    <!--Electronic surface single-->
    <el-dialog title="Electronic surface single" :visible.sync="electronicSurfaceShow" width="30%" align="center">
      <!--The main body-->
      <div class="electronic-surface" ref="electronicSurface" id="electronicSurface"></div>
      <div slot="footer" align="right">
        <el-button type="primary" @click="handlePrint">print</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as API_order from '@/api/order'
import * as API_logistics from '@/api/expressCompany'
import { CategoryPicker } from '@/components'
import { LogisticsCompany } from './components'
import { RegExp } from '~/ui-utils'
import Print from 'print-js'
export default {
  name: 'orderDetail',
  components: {
    [LogisticsCompany.name]: LogisticsCompany,
    [CategoryPicker.name]: CategoryPicker
  },
  data() {
    /** The amount of*/
    const checkMoney = (rule, value, callback) => {
      if (!this.adjustedPrice && this.adjustedPrice !== 0) {
        return callback(new Error('The total price of the order cannot be empty'))
      }
      setTimeout(() => {
        if (!RegExp.money.test(this.adjustedPrice)) {
          callback(new Error('Please fill in the correct amount'))
        } else {
          callback()
        }
      }, 1000)
    }
    /** Mobile phone no.*/
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('The cell phone number cannot be empty'))
      }
      setTimeout(() => {
        if (!RegExp.mobile.test(value)) {
          callback(new Error('Please fill in the correct cell phone number'))
        } else {
          callback()
        }
      }, 1000)
    }
    return {
      /** The list ofloadingStatus*/
      loading: false,

      /** Order details data*/
      orderDetail: null,

      /** The ordersn */
      sn: '',

      /** Product list*/
      productList: [],

      /** Check whether the logistics information can be viewed. By default, no*/
      isLooklogistics: false,

      /** Display The button for modifying consignee information is not displayed by default*/
      isShowEditShipName: false,

      /** Display price adjustment button Is not displayed by default*/
      isShowEditOrderPrice: false,

      /** The confirm payment button is not displayed by default*/
      isShowConfirmReceive: false,

      /** Status/Logistics information status display*/
      logisticsStatus: true,

      /** Logistics information*/
      logisticsData: [],

      /** Whether the logistics information pop-up box is displayed*/
      logisticsShow: false,

      /** Whether to display adjustment prices/Modify the consignee information display*/
      orderDetailShow: false,

      /** Delivery logistics information*/
      logisticsInfoList: [],

      /** Name of Logistics Express*/
      logisticsName: '',

      /** Logistics express tracking number*/
      logisticsNo: '',

      /** Bounced title*/
      dialogTitle: 'Adjust the total price of order',

      /** Bounced width*/
      dialogWidth: '25%',

      /** State trigger1Adjust the total price of order2Modify consignee information*/
      triggerStatus: -1,

      /** The adjusted price*/
      adjustedPrice: 0,

      /** Consignee information*/
      ConsigneeForm: {
        /** The consignee*/
        ship_name: '',

        /** Mobile phone number*/
        ship_mobile: '',

        /** region*/
        region: '',

        /** Detailed address*/
        ship_addr: '',

        /** Delivery time*/
        receive_time: '',

        /** note*/
        remark: ''
      },

      /** Regional information*/
      areas: [],

      /** stepslist*/
      stepList: [],

      /** Whether to display an electronic sheet*/
      electronicSurfaceShow: false,

      /** Validation rules*/
      orderRules: {
        /** Adjust the price*/
        adjustedPrice: [
          { validator: checkMoney, trigger: 'blur' }
        ],

        /** The consignee*/
        ship_name: [
          { required: true, message: 'Please fill in the name of the consignee', trigger: 'blur' }
        ],

        /** Mobile phone no.*/
        ship_mobile: [
          { required: true, message: 'Please fill in your cell phone number', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],

        /** Detailed address*/
        ship_addr: [
          { required: true, message: 'Please fill in the detailed address', trigger: 'blur' },
          { mix: 5, max: 100, message: 'The detailed address is5～100A character', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
    paymentTypeFilter(val) {
      return val === 'ONLINE' ? 'Online payment' : 'Cash on delivery'
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.sn = to.params.sn
    this.GET_OrderDetail()
    next()
  },
  mounted() {
    this.sn = this.$route.params.sn
    this.GET_OrderDetail()
  },
  activated() {
    this.sn = this.$route.params.sn
    this.GET_OrderDetail()
  },
  methods: {
    /** Get order details*/
    GET_OrderDetail() {
      this.loading = true
      API_order.getOrderDetail(this.sn).then(response => {
        this.loading = false
        // The order information
        this.orderDetail = response
        // Commodity information
        this.productList = this.orderDetail.order_sku_list
        // Logistics information express tracking No. Express company
        this.logisticsNo = this.orderDetail.ship_no
        this.logisticsName = this.orderDetail.logi_name
        // Modify consignee information area selector information
        this.areas = [this.orderDetail.ship_province_id, this.orderDetail.ship_city_id,
          this.orderDetail.ship_county_id || -1, this.orderDetail.ship_town_id || -1]
        // Step bar information
        this.getStepList()
        // Can you deliver the goods?
        if (this.orderDetail.order_operate_allowable_vo.allow_ship) {
          this.getLogisticsCompanies()
        } else {
          this.logisticsStatus = true
        }

        // Can the consignees information be modified
        this.isShowEditShipName = !!this.orderDetail.order_operate_allowable_vo.allow_edit_consignee

        // Can you adjust the price
        this.isShowEditOrderPrice = !!this.orderDetail.order_operate_allowable_vo.allow_edit_price

        // Can we confirm the receipt
        this.isShowConfirmReceive = !!this.orderDetail.order_operate_allowable_vo.allow_pay

        // Can you check the logistics information
        this.isLooklogistics = !!this.orderDetail.order_operate_allowable_vo.allow_check_express
      })
    },

    /** Gets the order step bar information*/
    getStepList() {
      API_order.getStepList(this.sn).then(response => {
        this.stepList = response
        this.stepList = this.stepList.map(key => {
          switch (key.show_status) {
            case 0: key.show_status = 'wait'
              break
            case 1: key.show_status = 'success'
              break
            case 2: key.show_status = 'success'
              break
            case 3: key.show_status = 'error'
              break
          }
          return key
        })
      })
    },

    /** Get a list of logistics company information*/
    getLogisticsCompanies() {
      API_logistics.getExpressCompanyList({ page_size: 998 }).then(response => {
        this.logisticsData = response.data
        this.logisticsData = this.logisticsData.filter(key => {
          return key.id
        })
        this.logisticsData.forEach(key => {
          this.$set(key, 'ship_no', '')
        })
        this.logisticsStatus = false
      })
    },

    /** View logistics information*/
    looklogistics() {
      this.logisticsShow = false
      const _params = {
        id: this.orderDetail.logi_id,
        num: this.orderDetail.ship_no
      }
      this.loading = true
      API_order.getLogisticsInfo(_params).then(response => {
        this.logisticsShow = true
        this.loading = false
        this.logisticsInfoList = response.data
      })
    },

    /** Adjust the price*/
    adjustPrice() {
      this.dialogTitle = 'Adjust the total price of order'
      this.dialogWidth = '15%'
      this.orderDetailShow = true
      this.triggerStatus = 1
      this.adjustedPrice = this.orderDetail.order_price
    },

    /** Generate an electron plane*/
    produceElectronicSurface(row) {
      const _params = {
        order_sn: this.sn,
        logistics_id: row.id,
        logistics_name: row.name
      }
      this.$confirm('Verify that the electronic plane sheet is generated?', 'prompt', { type: 'warning' }).then(() => {
        API_order.generateElectronicSurface(_params).then((response) => {
          this.electronicSurfaceShow = true
          // this.logisticsData.forEach(key => {
          //   if (row.logi_id === key.logi_id) {
          //     key.ship_no = response.code
          //   }
          // })
          setTimeout(() => {
            this.$refs['electronicSurface'].innerHTML = response.template || response
          }, 200)
          this.GET_OrderDetail()
        })
      })
    },

    /** Print the electronic sheet*/
    handlePrint() {
      Print({
        printable: 'electronicSurface',
        type: 'html',
        // Inherit all the original styles
        targetStyles: ['*']
      })
    },

    /** The delivery*/
    deliverGoods(row) {
      if (!row.ship_no) {
        this.$message.error('Please fill in the tracking number')
        return
      } else if (!/^[A-Za-z0-9]+$/.test(row.ship_no)) {
        this.$message.error('The tracking number does not conform to the rules, please enter letters or Numbers')
        return
      }
      const _params = {
        /** Invoice no.*/
        ship_no: row.ship_no,
        /** Logistics companyid */
        logi_id: row.id,
        /** Name of logistics Company*/
        logi_name: row.name
      }
      this.$confirm('Confirm the delivery?', 'prompt', { type: 'warning' }).then(() => {
        API_order.deliveryGoods(this.sn, _params).then(() => {
          this.$message.success('Successful delivery')
          this.GET_OrderDetail()
        })
      })
    },

    /** Triggered when the operation locale selector changes*/
    handleChangeArea(val) {
      this.ConsigneeForm.region = val.last_id
    },

    /** Modify consignee information*/
    adjustConsignee() {
      this.dialogTitle = 'Modify consignee information'
      this.dialogWidth = '25%'
      this.orderDetailShow = true
      this.triggerStatus = 2
      /** Assign data information to consignee information*/
      this.ConsigneeForm = {
        /** The consignee*/
        ship_name: this.orderDetail.ship_name,

        /** Mobile phone number*/
        ship_mobile: this.orderDetail.ship_mobile,

        /** Detailed address*/
        ship_addr: this.orderDetail.ship_addr,

        /** Delivery time*/
        receive_time: this.orderDetail.receive_time,

        /** note*/
        remark: this.orderDetail.remark
      }
    },

    /** Cancel the save*/
    cancelOrderDetail() {
      this.orderDetailShow = false
      this.triggerStatus = -1
    },

    /** Confirm receipt*/
    confirmPay() {
      this.$confirm('Are you sure you want to confirm the receipt？', 'prompt', { type: 'warning' }).then(() => {
        API_order.confirmPay(this.sn, this.orderDetail.order_price).then(response => {
          this.$message.success('Order confirmation and payment received successfully！')
          this.GET_OrderDetail()
        })
      }).catch(() => {})
    },

    /** Cancel the order*/
    cancelOrder() {
      this.$confirm('Are you sure to cancel this order？', 'prompt', { type: 'warning' }).then(() => {
        API_order.cancleOrder(this.sn).then(() => {
          this.$message.success('Order cancelled successfully！')
          this.GET_OrderDetail()
        })
      }).catch(() => {})
    },

    /** Save button*/
    reserveOrderDetail() {
      this.orderDetailShow = false
      if (this.triggerStatus === 2) { // Modify consignee information
        API_order.updateConsigneeInfo(this.sn, this.ConsigneeForm).then(() => {
          this.$message.success('The consignees information has been modified successfully')
          this.GET_OrderDetail()
        })
      } else if (this.triggerStatus === 1) { // Adjust the price
        const _params = {
          order_price: this.adjustedPrice
        }
        API_order.updateOrderPrice(this.sn, _params).then(() => {
          this.$message.success('Price modification successful')
          this.GET_OrderDetail()
        })
      }
      this.triggerStatus = -1
    },

    /** Confirm receipt*/
    confirmReceive() {
      this.$confirm('Verify that you do this?', 'prompt', { type: 'warning' }).then(() => {
        API_order.confirmGetAmount(this.sn, { pay_price: this.orderDetail.order_price }).then(() => {
          this.$message.success('Payment success！')
          this.GET_OrderDetail()
        })
      })
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
/*The background color*/
.order-detail-container {
  background-color: #fff;
}

/*The order information*/
.order-info {
  width:100%;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: space-between;
  div.order-collapse {
    width:25%;
    border: 1px solid #e5e5e5;
    /*Folded panel*/
    .el-collapse-item {
      /deep/ .el-collapse-item__header {
        text-align: left;
        background-color: #f8f8f8;
        padding:0 10px;
        font-weight: bold;
        color: #333;
        font-size: 14px;
      }
      /deep/ .el-collapse-item__content {
        padding: 15px;
        text-align: left;
        div {
          margin:5px 10px;
          span.item-name {
            font-weight: bold;
            color: #888;
            font-size: 14px;
            text-align: right;
          }
        }
        hr {
          border-top: 1px dotted #e5e5e5;
        }
      }
    }
    /* Name and value pair layout in order information*/
    .order-item {
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
      flex-direction: row;
      align-items: flex-start;
      span {
        display: inline-block;
      }
      span:first-child {
        min-width: 75px;
      }
      span:last-child {
        text-align:left;
      }
    }
  }

  /*** Status*/
  div.order-status-info{
    width:75%;
    padding:0 20px;
    border: 1px solid #e5e5e5;
    border-left: none;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: stretch;
    div.order-status {
      line-height: 40px;
      color: #333;
      font-size: 20px;
      padding: 5px;
      border-bottom: 1px solid #e5e5e5;
      i {
        color: #5cb85c;
        font-weight: bold;
        font-size: 25px;
      }
    }
    div.opera-btn {
      text-align: right;
      margin-bottom: 10px;
    }

    div.order-item {
      color: #333;
      font-size: 15px;
      margin: 5px 0;
      line-height: 25px;
      .el-button--text {
        padding: 0;
      }
    }
  }
}

/*Products*/
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

/*Area selector*/
/deep/.area-select {
  .el-form-item__content {
    text-align: left;
    .app-address {
      text-align: left;
    }
  }
}

/deep/ .el-table td:not(.is-left) {
  text-align: center;
}

/*Product picture size*/
.goods-image {
  width: 50px;
  height: 50px;
}

/deep/ .el-dialog__footer {
  padding-top: 0;
}
/*Logistics information*/
.logistics-base {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  span {
    font-size: 14px;
    color: #4c4646;
  }
}
/deep/ .el-dialog__body {
  padding: 20px 25px;
  .logistics-info {
    max-height: 500px;
    overflow-y: scroll;
  }
}

/*Electronic surface single*/
/deep/ .electronic-surface {
  border: 1px solid #ddd;
  padding: 5px;
}

.sku-spec {
  color: #ff9800;
  margin: 0;
}

.sku-act-tags {
  padding: 0;
  margin: 0;
}
.sku-act-tag {
  display: inline-block;
  padding: 0 5px;
  line-height: 15px;
  margin-right: 5px;
  border: 1px solid #f42424;
  color: #f42424;
}
</style>

