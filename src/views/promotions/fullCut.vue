<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleToggleClick">
      <!--Full discount list-->
      <el-tab-pane label="Full discount list" name="fullList">
        <en-table-layout
          toolbar
          pagination
          :tableData="tableData"
          :loading="loading">
          <div slot="toolbar" class="inner-toolbar">
            <div class="toolbar-btns">
              <el-button type="primary" @click="handleAddFullCut">new</el-button>
            </div>
            <div class="toolbar-search">
              <en-table-search @search="searchEvent"/>
            </div>
          </div>
          <template slot="table-columns">
            <!--The name of the event-->
            <el-table-column prop="title" label="The name of the event"/>
            <!--The start time-->
            <el-table-column label="The start time" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.start_time | unixToDate }}</span>
              </template>
            </el-table-column>
            <!--The end of time-->
            <el-table-column label="The end of time" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.end_time | unixToDate }}</span>
              </template>
            </el-table-column>
            <!--The activity type-->
            <el-table-column prop="activity_type" label="The activity type" :formatter="activityType" width="120"  />
            <!--Active state-->
            <el-table-column label="Active state" prop="status_text" width="120" />
            <!--Operation-->
            <el-table-column label="Operation" width="180">
              <template slot-scope="scope">
                <el-button
                  v-html="(scope.row.status === 'END' || scope.row.status === 'UNDERWAY') ? 'To view' : 'edit'"
                  type="success"
                  @click="handleEditMould(scope.row)">
                </el-button>
                <el-button
                  :disabled="scope.row.status === 'UNDERWAY'"
                  type="danger"
                  @click="handleDeleteFullCut(scope.row)">delete
                </el-button>
              </template>
            </el-table-column>
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
      </el-tab-pane>
      <!--New full discount-->
      <el-tab-pane :label="fullCutName" name="add">
        <div class="content-goods-publish">
          <el-form
            :model="activityForm"
            status-icon
            :rules="rules"
            label-position="right"
            ref="activityForm"
            label-width="120px"
            class="demo-ruleForm">
            <!--Activity information-->
            <div class="base-info-item">
              <h4>Activity information</h4>
              <div>
                <!--The name of the event-->
                <el-form-item  label="The name of the event：" prop="title">
                  <el-input
                    v-model="activityForm.title"
                    style="width: 300px"
                    placeholder="No more than50A character"
                    maxLength="50">
                  </el-input>
                </el-form-item>
                <!--Validity Time Indicates the start time--By the time-->
                <el-form-item label="Effect of time：" prop="take_effect_time">
                  <el-date-picker
                    v-model="activityForm.take_effect_time"
                    type="datetimerange"
                    value-format="timestamp"
                    range-separator="-"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    :default-time="[MixinDefaultTime, MixinDefaultTime]"
                    :picker-options="{disabledDate(time) { return time.getTime() < Date.now() - 8.64E7 }}">
                  </el-date-picker>
                </el-form-item>
                <!--Activity description-->
                <el-form-item label="Activity description：">
                  <UE ref="UE" :defaultMsg="activityForm.description"></UE>
                </el-form-item>
              </div>
            </div>
            <!--Preferential Settings-->
            <div class="base-info-item">
              <h4>Preferential Settings</h4>
              <div>
                <!--Preferential threshold-->
                <el-form-item label="Preferential threshold：" prop="full_money">
                  <div>
                    full<el-input v-model="activityForm.full_money" style="width: 100px;"></el-input>
                    USD<span class="discount-tip">Consumption reached this amount to participate in the discount</span>
                  </div>
                </el-form-item>
                <!--Decrease in cash-->
                <el-form-item label="Preferential way：" prop="minus_value" class="discount-model">
                  <el-checkbox :label="reduceCashTxt" v-model="is_full_minus" @change="changeReduceCash"></el-checkbox>
                  <span class="integral-show" v-show="is_full_minus">
                    <el-input  size="mini" v-model="activityForm.minus_value"></el-input> USD
                  </span>
                </el-form-item>
                <!--At a discount-->
                <el-form-item prop="discount_value" class="discount-model">
                  <el-checkbox :label="discountTxt" v-model="is_discount" @change="changeDiscount"></el-checkbox>
                  <span class="integral-show" v-show="is_discount">
                    <el-input  size="mini" v-model="activityForm.discount_value"></el-input> fold
                  </span>
                </el-form-item>
                <!--Own stores--Award points-->
                <el-form-item prop="integral" class="discount-model" v-if="parseInt(shopInfo.self_operated) === 1">
                  <el-checkbox :label="integralTxt" v-model="isSendPoint" @change="changeIntegral"></el-checkbox>
                  <span class="integral-show" v-show="isSendPoint">
                    <el-input  size="mini" v-model="activityForm.point_value"></el-input> points
                  </span>
                </el-form-item>
                <!--Exempt postage-->
                <el-form-item prop="is_free_ship" class="discount-model">
                  <el-checkbox label="Exempt postage" v-model="is_free_ship" @change="changeis_free_ship"></el-checkbox>
                </el-form-item>
                <!--To send a coupon-->
                <el-form-item prop="bonus_id" class="discount-model">
                  <el-checkbox :label="couponTxt" v-model="is_send_bonus" @change="isChangeCoupon"></el-checkbox>
                  <el-select v-show="is_send_bonus" v-model="activityForm.bonus_id" placeholder="Please select" @change="changeCoupon">
                    <el-option
                      v-for="item in couponList"
                      :key="item.coupon_id"
                      :label="item.title"
                      :value="item.coupon_id">
                    </el-option>
                  </el-select>
                  <el-button type="text" v-show="is_send_bonus" @click="addCoupon">new</el-button>
                </el-form-item>
                <!--To send gift-->
                <el-form-item prop="gift_id" class="discount-model">
                  <el-checkbox :label="giftTxt" v-model="is_send_gift" @change="isChangeGift"></el-checkbox>
                  <el-select v-show="is_send_gift" v-model="activityForm.gift_id" placeholder="Please select" @change="changeGift">
                    <el-option
                      v-for="item in giftList"
                      :key="item.gift_id"
                      :label="item.gift_name"
                      :value="item.gift_id">
                    </el-option>
                  </el-select>
                  <el-button type="text" v-show="is_send_gift" @click="addGift">new</el-button>
                </el-form-item>
              </div>
            </div>
            <!--Activities of goods-->
            <div class="base-info-item">
              <h4>Activities of goods</h4>
              <div>
                <div class="activity-goods">
                  <el-form-item label="Activities of goods" prop="range_type">
                    <el-radio-group v-model="activityForm.range_type" @change="changeJoinGoods">
                      <el-radio :label="1">Participation of all commodities</el-radio>
                      <el-radio :label="2">Partial commodity participation</el-radio>
                    </el-radio-group>
                    <!--Commodity form-->
                    <div v-show="!goodsShow" class="goods-table">
                      <en-table-layout
                        toolbar
                        :tableData="activityForm.goods_list"
                        :loading="loading"
                        :selectionChange="selectionChange">
                        <div slot="toolbar" class="inner-toolbar">
                          <div class="toolbar-btns">
                            <el-button type="primary" @click="showGoodsSelector">Choose goods</el-button>
                            <el-button type="danger" @click="cancelall">Batch cancelled</el-button>
                          </div>
                        </div>
                        <template slot="table-columns">
                          <el-table-column type="selection"/>
                          <!--Product information-->
                          <el-table-column  label="Product information">
                            <template slot-scope="scope">
                              <div class="goods-info">
                                <img :src="scope.row.thumbnail" alt="" class="goods-image">
                                <div>
                                  <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank"
                                    style="color: #00a2d4;">{{ scope.row.goods_name }}</a>
                                  <span>{{ scope.row.price | unitPrice('￥') }}</span>
                                </div>
                              </div>
                            </template>
                          </el-table-column>
                          <!--Inventory-->
                          <el-table-column prop="enable_quantity" label="Inventory" />
                          <!--Operation-->
                          <el-table-column label="Operation" width="150">
                            <template slot-scope="scope">
                              <el-button
                                type="danger"
                                @click="handleCancleJoin(scope.$index, scope.row)">Cancel to
                              </el-button>
                            </template>
                          </el-table-column>
                        </template>
                      </en-table-layout>
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
            <!--The submit button-->
            <div class="btn-submit">
              <el-form-item>
                <el-button v-show="editEnabled" type="primary" @click="handleSaveActivity('activityForm')">Save Settings</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <!--The mask layer-->
        <div :class="{'cus-mask': !editEnabled}"></div>
      </el-tab-pane>
    </el-tabs>
    <!--Commodity selector-->
    <en-goods-picker
      type="seller"
      goods-type="NORMAL"
      :show="showDialog"
      :api="goodsApi"
      :multipleApi="multipleApi"
      :categoryApi="categoryApi"
      :defaultData="goodsIds"
      :limit="maxsize"
      @confirm="refreshFunc"
      @close="showDialog = false"/>
    <!--Gift component-->
    <add-gift
      :giftModelShow="giftModelShow"
      @saveGift="saveGift"/>
    <!--Coupon component-->
    <Coupon
      :couponModelShow="couponModelShow"
      @saveCoupon="saveCoupon"
    ></Coupon>
    <el-dialog
      title="The following commodities have participated in other activities and are in conflict with the current activities"
      :visible.sync="showConflictGoods"
      width="30%">
      <en-table-layout
        toolbar
        :tableData="conflictList">
        <template slot="table-columns">
          <!--Name-->
          <el-table-column prop="name" label="Name"/>
          <!--Commodity images-->
          <el-table-column label="Name">
            <template slot-scope="scope">
              <img :src="scope.row.thumbnail" class="goods-image"/>
            </template>
          </el-table-column>
        </template>
      </en-table-layout>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as API_activity from '@/api/activity'
  import * as API_Gift from '@/api/gift'
  import * as API_coupon from '@/api/coupon'
  import { RegExp } from '~/ui-utils'
  import { CategoryPicker, UE } from '@/components'
  import { AddGift, Coupon } from './components'

  export default {
    name: 'fullCut',
    components: {
      [CategoryPicker.name]: CategoryPicker,
      [UE.name]: UE,
      [AddGift.name]: AddGift,
      [Coupon.name]: Coupon
    },
    computed: {
      ...mapGetters([
        'shopInfo'
      ])
    },
    data() {
      const checkDiscountThreshold = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('Please enter your preferred cash amount'))
        }
        setTimeout(() => {
          if (!RegExp.money.test(value)) {
            callback(new Error('Please enter the correct amount'))
          } else if (parseFloat(value) > 99999999) {
            callback(new Error('The integral part of the preferential threshold amount shall not be greater than99999999'))
          } else if (this.is_full_minus && parseFloat(value) < parseFloat(this.activityForm.minus_value)) {
            callback(new Error('The reduction amount shall not be greater than the threshold amount'))
          } else {
            callback()
          }
        }, 1000)
      }
      const checkReduceCash = (rule, value, callback) => {
        if (this.is_full_minus) {
          if (!value) {
            return callback(new Error('Please enter your preferred cash amount'))
          }
          setTimeout(() => {
            if (!RegExp.money.test(value)) {
              callback(new Error('Please enter the correct amount'))
            } else if (parseFloat(value) > 99999999) {
              callback(new Error('The integral part of the reduction amount must not be greater than99999999'))
            } else if (this.is_full_minus && parseFloat(value) > parseFloat(this.activityForm.full_money)) {
              callback(new Error('The reduction amount shall not be greater than the threshold amount'))
            } else {
              callback()
            }
          }, 1000)
        } else {
          callback()
        }
      }
      const checkDiscountVal = (rule, value, callback) => {
        if (this.is_discount) {
          if (!value) {
            return callback(new Error('Please enter your preferred discount rate'))
          }
          // The canonical range is 0.1-9.9
          setTimeout(() => {
            if (!/^((0\.[1-9]{1})|(([1-9]{1})(\.\d{1})?))$/.test(value)) {
              callback(new Error('Please enter a positive integer or a decimal number'))
            } else if (parseInt(value) < 1 || parseInt(value) >= 10) {
              callback(new Error('Discount figures are available only1-9.9between'))
            } else {
              callback()
            }
          }, 500)
        } else {
          callback()
        }
      }
      const checkIntegral = (rule, value, callback) => {
        if (this.isIntegral) {
          if (!value) {
            return callback(new Error('Please enter the integral value'))
          }
          setTimeout(() => {
            if (!RegExp.integer.test(value)) {
              callback(new Error('Please enter a numeric value'))
            } else {
              callback()
            }
          }, 500)
        } else {
          callback()
        }
      }
      const checkRange = (rule, value, callback) => {
        if (!value && value !== 0) {
          return callback(new Error('Please select the mode of product participation'))
        } else {
          callback()
        }
      }
      const checkTakeEffectTime = (rule, value, callback) => {
        const now = new Date().getTime()
        if (!value) {
          return callback(new Error('Please select the effective date'))
        } else if (value[0] <= now) {
          callback(new Error('The start time of the activity must not be less than the current time'))
        } else {
          callback()
        }
      }
      return {
        /** The name of the current panel*/
        activeName: 'fullList',

        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10
        },

        /** The list of data*/
        tableData: [],

        /** List paging data*/
        pageData: null,

        fullCutName: 'New full discount',

        /** Add fill/subtract form information*/
        activityForm: {
          /** The current activityID*/
          fd_id: '',

          /** The name of the event/ title*/
          title: '',

          /** Effect of time*/
          take_effect_time: [],

          /** Activity description*/
          description: '',

          /** Preferential threshold*/
          full_money: '',

          /** Whether the discount*/
          is_discount: 0,

          /** A few discount*/
          discount_value: 0,

          /** Whether to reduce cash or not*/
          is_full_minus: 1,

          /** How much is the reduction of*/
          minus_value: 0,

          /** Whether to integrate or not*/
          is_send_point: 1,

          /** point*/
          point_value: 0,

          /** Is there any postage free*/
          is_free_ship: 1,

          /** Are there any freebies*/
          is_send_gift: 1,

          /** The giftsid */
          gift_id: '',

          /** Whether to send coupons or not*/
          is_send_bonus: 1,

          /** couponsId */
          bonus_id: '',

          /** Whether all goods participate*/
          range_type: '',

          /** Activities of goods*/
          goods_list: []
        },

        /** Whether to reduce cash or not*/
        is_full_minus: false,

        /** Less cash text*/
        reduceCashTxt: 'Decrease in cash(And discount activities can only choose one)',

        /** Whether the discount*/
        is_discount: false,

        /** Discount text*/
        discountTxt: 'At a discount(And cash reduction activities can only choose one)',

        /** Whether to integrate or not*/
        isSendPoint: false,

        /** Integral text*/
        integralTxt: 'Award points',

        /** Is there any postage free1Exempt postage*/
        is_free_ship: false,

        /** Whether to send coupons or not*/
        is_send_bonus: false,

        /** Coupon display text*/
        couponTxt: 'To send a coupon',

        /** Coupon list*/
        couponList: [],

        /** Displays coupon pop-ups*/
        couponModelShow: false,

        /** Are there any freebies*/
        is_send_gift: false,

        /** Giveaways display text*/
        giftTxt: 'To send gift',

        /** Gift list*/
        giftList: [],

        /** Display the giveaway cartridge*/
        giftModelShow: false,

        /** Whether to display the item table*/
        goodsShow: true,

        /** Select thegoods_id*/
        selectionids: [],

        /** Maximum length of commodity selector*/
        maxsize: 0,

        /** productids */
        goodsIds: [],

        /** Product selector listapi*/
        goodsApi: 'seller/goods?market_enable=1&is_auth=1',

        /** Mall classificationapi */
        categoryApi: 'seller/goods/category/0/children',

        /** Echo data usage*/
        multipleApi: 'seller/goods/@ids/details',

        /** According to/Hide the product selector*/
        showDialog: false,

        /** Form check rule*/
        rules: {
          /** The name of the event*/
          title: [
            { required: true, message: 'Please enter the activity name', trigger: 'blur' },
            { min: 0, max: 60, message: 'The length of60Within two characters', trigger: 'blur' }
          ],

          /** Effect of time*/
          take_effect_time: [
            { type: 'array', required: true, message: 'Please select the effective date', trigger: 'blur' },
            { validator: checkTakeEffectTime, trigger: 'blur' }
          ],

          /** Preferential threshold*/
          full_money: [
            { required: true, message: 'Please enter the discount threshold', trigger: 'blur' },
            { validator: checkDiscountThreshold, trigger: 'blur' }
          ],

          /** Decrease in cash*/
          minus_value: [
            { validator: checkReduceCash, trigger: 'blur' }
          ],

          /** A few discount*/
          discount_value: [
            { validator: checkDiscountVal, trigger: 'blur' }
          ],

          /** point*/
          integral: [
            { validator: checkIntegral, trigger: 'blur' }
          ],

          /** Mode of Commodity participation*/
          range_type: [
            { required: true, message: 'Please choose how to participate', trigger: 'blur' },
            { validator: checkRange, trigger: 'change' }
          ]
        },

        // Uneditable means ongoing or defunct by default
        editEnabled: true,

        /** Whether to display a list of conflicts*/
        showConflictGoods: false,

        /** The conflict list shows the commodity name commodity price commodity picture*/
        conflictList: []
      }
    },
    mounted() {
      this.GET_FullCutActivityList()
      /** Coupon list*/
      this.GET_CouponsList()
      /** Gift list*/
      this.GET_giftList()
    },
    methods: {
      /** The activity type*/
      activityType(row, column, cellValue) {
        if (row.is_discount === 1) {
          return 'Full fold'
        }
        if (row.is_full_minus === 1) {
          return 'Full reduction'
        }
        return 'With preferential'
      },

      /** Search Event Trigger*/
      searchEvent(data) {
        this.params = {
          ...this.params,
          keywords: data
        }
        this.GET_FullCutActivityList()
      },

      /** Switch panel*/
      handleToggleClick(tab, event) {
        this.activeName = tab.name
        switch (this.activeName) {
          case 'fullList':
            this.GET_FullCutActivityList()
            break
          case 'add':
            this.activityForm = {
              /** The name of the event/ title*/
              title: '',

              /** Effect of time*/
              take_effect_time: [],

              /** Activity description*/
              description: '',

              /** Preferential threshold*/
              full_money: '',

              /** Whether the discount*/
              is_discount: 0,

              /** A few discount*/
              discount_value: '',

              /** Whether to reduce cash or not*/
              is_full_minus: 0,

              /** How much is the reduction of*/
              minus_value: '',

              /** Whether to integrate or not*/
              isIntegral: 0,

              /** point*/
              integral: 0,

              /** Is there any postage free*/
              is_free_ship: 0,

              /** Are there any freebies*/
              is_send_gift: 0,

              /** The giftsid */
              gift_id: '',

              /** Whether to send coupons or not*/
              is_send_bonus: 0,

              /** couponsId */
              bonus_id: '',

              /** Whether all goods participate*/
              range_type: '',

              /** Activities of goods*/
              goods_list: []
            }
            this.fullCutName = 'New full discount'
            this.editEnabled = true
            /** Processing of discount data*/
            this.is_discount = false
            this.is_full_minus = false
            this.isIntegral = false
            this.is_free_ship = false
            this.is_send_bonus = false
            this.is_send_gift = false
            this.discountTxt = 'At a discount(And cash reduction activities can only choose one)'
            this.reduceCashTxt = 'Decrease in cash(And discount activities can only choose one)'
            this.changeIntegral(this.isIntegral)
            this.isChangeCoupon(this.is_send_bonus)
            this.isChangeGift(this.is_send_gift)
        }
      },

      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_FullCutActivityList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_FullCutActivityList()
      },

      /** Whether all products are selected*/
      changeJoinGoods(val) {
        this.goodsShow = val === 1
      },

      /** Save the item selected by the commodity selector*/
      refreshFunc(val) {
        if (val) {
          this.activityForm.goods_list = val
        }
      },

      /** Displays the product selector*/
      showGoodsSelector() {
        this.showDialog = true
        this.goodsIds = this.activityForm.goods_list.map(key => {
          return key.goods_id
        })
      },

      /** Cancel to*/
      handleCancleJoin(index, row) {
        this.activityForm.goods_list.forEach((elem, _index) => {
          if (index === _index) {
            this.activityForm.goods_list.splice(_index, 1)
          }
        })
        this.goodsIds = this.activityForm.goods_list.map(key => {
          return key.goods_id
        })
      },

      /** Item selection*/
      selectionChange(val) {
        this.selectionids = val.map(item => item.goods_id)
      },

      /** Batch cancelled*/
      cancelall() {
        this.selectionids.forEach(key => {
          this.activityForm.goods_list.forEach((elem, index) => {
            if (elem.goods_id === key) {
              this.activityForm.goods_list.splice(index, 1)
            }
          })
          this.$message.success('Batch cancel successful！')
        })
        this.goodsIds = this.activityForm.goods_list.map(key => {
          return key.goods_id
        })
      },

      /** Obtain activity information*/
      GET_FullCutActivityList() {
        this.loading = true
        API_activity.getFullCutActivityList(this.params).then(response => {
          this.loading = false
          this.tableData = response.data
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
        })
      },

      /** Edit full reduction offers*/
      handleEditMould(row) {
        this.activeName = 'add'
        this.fullCutName = 'Editor full discount'
        this.editEnabled = !(row.status === 'END' || row.status === 'UNDERWAY')
        setTimeout(() => { this.$refs['activityForm'].resetFields() })
        this.GET_FullCutActivityDetails(row.fd_id)
      },

      /** Get individual item details*/
      GET_FullCutActivityDetails(id) {
        API_activity.getFullCutActivityDetails(id, {}).then((response) => {
          this.activityForm = {
            ...response,
            fd_id: id,
            take_effect_time: [parseInt(response.start_time) * 1000, parseInt(response.end_time) * 1000]
          }
          /** Processing commodity information*/
          this.goodsShow = this.activityForm.range_type === 1
          this.activityForm.goods_list = response.goods_list
          /** Processing of discount data*/
          this.is_discount = this.activityForm.is_discount === 1
          this.is_full_minus = this.activityForm.is_full_minus === 1
          this.isSendPoint = this.activityForm.is_send_point === 1
          this.is_free_ship = this.activityForm.is_free_ship === 1
          this.is_send_bonus = this.activityForm.is_send_bonus === 1
          this.is_send_gift = this.activityForm.is_send_gift === 1
          this.changeDiscount(this.is_discount)
          this.changeReduceCash(this.is_full_minus)
          this.changeIntegral(this.isSendPoint)
          this.isChangeCoupon(this.is_send_bonus)
          this.isChangeGift(this.is_send_gift)
        })
      },

      /** Delete full discount promotions*/
      handleDeleteFullCut(row) {
        this.$confirm('Verify that the current item is deleted？', 'Confirm the information', { type: 'warning' })
          .then(() => this.toDelActivity(row))
          .catch(() => {})
      },

      /** To delete*/
      toDelActivity(row) {
        API_activity.deleteFullCutActivity(row.fd_id).then(() => {
          this.$message.success('Delete the success！')
          this.GET_FullCutActivityList()
        })
      },

      /** New full reduction concessions*/
      handleAddFullCut() {
        this.activeName = 'add'
        this.fullCutName = 'New full discount'
        this.editEnabled = true
        this.activityForm = {
          /** The name of the event/ title*/
          title: '',

          /** Effect of time*/
          take_effect_time: [],

          /** Activity description*/
          description: '',

          /** Preferential threshold*/
          full_money: '',

          /** Whether the discount*/
          is_discount: 0,

          /** A few discount*/
          discount_value: '',

          /** Whether to reduce cash or not*/
          is_full_minus: 0,

          /** How much is the reduction of*/
          minus_value: '',

          /** Whether to integrate or not*/
          isIntegral: 0,

          /** point*/
          integral: 0,

          /** Is there any postage free*/
          is_free_ship: 0,

          /** Are there any freebies*/
          is_send_gift: 0,

          /** The giftsid */
          gift_id: '',

          /** Whether to send coupons or not*/
          is_send_bonus: 0,

          /** couponsId */
          bonus_id: '',

          /** Whether all goods participate*/
          range_type: '',

          /** Activities of goods*/
          goods_list: []
        }
        this.is_discount = false
        this.is_full_minus = false
        this.isSendPoint = false
        this.is_free_ship = false
        this.is_send_bonus = false
        this.is_send_gift = false

        this.discountTxt = 'At a discount(And cash reduction activities can only choose one)'
        this.reduceCashTxt = 'Decrease in cash(And discount activities can only choose one)'
        this.changeIntegral(this.isIntegral)
        this.isChangeCoupon(this.is_send_bonus)
        this.isChangeGift(this.is_send_gift)
      },

      /** Whether the discount*/
      changeDiscount(val) {
        this.is_discount = val
        this.activityForm.is_discount = val ? 1 : 0
        if (this.is_full_minus) {
          this.activityForm.is_full_minus = val ? 0 : 1
        }
        if (val) {
          this.is_full_minus = !this.is_discount
          this.reduceCashTxt = this.is_full_minus ? 'Reduction of' : 'Reduction of现金(And discount activities can only choose one)'
        }
        this.discountTxt = this.is_discount ? 'play' : 'play折(And cash reduction activities can only choose one)'
      },

      /** Whether to reduce cash or not*/
      changeReduceCash(val) {
        this.is_full_minus = val
        this.activityForm.is_full_minus = val ? 1 : 0
        if (this.is_discount) {
          this.activityForm.is_discount = val ? 0 : 1
        }
        if (val) {
          this.is_discount = !this.is_full_minus
          this.discountTxt = this.is_discount ? 'play' : 'play折(And cash reduction activities can only choose one)'
        }
        this.reduceCashTxt = this.is_full_minus ? 'Reduction of' : 'Reduction of现金(And discount activities can only choose one)'
      },

      /** Whether to integrate or not*/
      changeIntegral(val) {
        this.integralTxt = val ? 'send' : 'send积分'
        this.activityForm.is_send_point = val ? 1 : 0
      },

      /** Whether to change postage free*/
      changeis_free_ship(val) {
        this.is_free_ship = val
        this.activityForm.is_free_ship = this.is_free_ship ? 1 : 0
      },

      /** Whether to send coupons or not*/
      isChangeCoupon(val) {
        this.is_send_bonus = val
        this.activityForm.is_send_bonus = this.is_send_bonus ? 1 : 0
        this.couponTxt = this.is_send_bonus ? 'send' : 'send优惠券'
      },

      /** Get a coupon list*/
      GET_CouponsList() {
        API_coupon.getCouponsStatusList().then(response => {
          this.couponList = response
        })
      },

      /** When the selected coupon changes*/
      changeCoupon(val) {
        this.activityForm.bonus_id = val
      },

      /** New coupons*/
      addCoupon() {
        this.couponModelShow = true
      },

      /** Coupon monitoring*/
      saveCoupon(target) {
        this.couponModelShow = false
        target && this.GET_CouponsList()
      },

      /** Whether to send gifts*/
      isChangeGift(val) {
        this.is_send_gift = val
        this.activityForm.is_send_gift = this.is_send_gift ? 1 : 0
        this.giftTxt = this.is_send_gift ? 'send' : 'send赠品'
      },

      /** Get a list of freebies*/
      GET_giftList() {
        API_Gift.getGiftsAllList().then(response => {
          this.giftList = response
        })
      },

      /** When the selected freebies change*/
      changeGift(val) {
        this.activityForm.gift_id = val
      },

      /** New gift*/
      addGift() {
        this.giftModelShow = true
      },

      /** Gift to monitor*/
      saveGift(target) {
        this.giftModelShow = false
        target && this.GET_giftList()
      },

      /** Save form Settings*/
      handleSaveActivity(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            /** Processing form data*/
            this.activityForm.point_value = parseInt(this.activityForm.point_value)
            this.activityForm.start_time = this.activityForm.take_effect_time[0] / 1000
            this.activityForm.end_time = this.activityForm.take_effect_time[1] / 1000
            this.activityForm.description = this.$refs['UE'].getUEContent()
            let _goodslist = []
            if (this.activityForm.goods_list && Array.isArray(this.activityForm.goods_list) && this.activityForm.range_type === 2) {
              _goodslist = this.activityForm.goods_list.map(key => {
                return {
                  goods_id: key.goods_id,
                  name: key.goods_name,
                  goods_name: key.goods_name,
                  price: key.price,
                  thumbnail: key.thumbnail
                }
              })
            }
            if (_goodslist.length > 0 && this.activityForm.range_type === 2) {
              this.activityForm.goods_list = _goodslist
            } else {
              delete this.activityForm.goods_list
            }
            if (this.activityForm.fd_id) {
              API_activity.saveFullCutActivity(this.activityForm.fd_id, this.activityForm).then(() => {
                this.$message.success('Save success！')
                this.activeName = 'fullList'
                this.GET_FullCutActivityList()
              }).catch((res) => {
                if (res.response.data.code === '401' && res.response.data.data) {
                  this.showConflictGoods = true
                  const goods_name = JSON.parse(res.response.data.data).map(key => { return key.name }).toString()
                  this.$message.error(`${goods_name}Has participated in other activities and has conflicts with the current activities`)
                } else {
                  this.$message.error(res.response.data.message)
                }
              })
            } else {
              API_activity.addFullCutActivity(this.activityForm).then(() => {
                this.$message.success('Add a success！')
                this.activeName = 'fullList'
                this.GET_FullCutActivityList()
              }).catch((res) => {
                if (res.response.data.code === '401' && res.response.data.data) {
                  // this.showConflictGoods = true
                  // this.conflictList = JSON.parse(res.response.data.data)
                  const goods_name = JSON.parse(res.response.data.data).map(key => { return key.name }).toString()
                  this.$message.error(`${goods_name}Has participated in other activities and has conflicts with the current activities`)
                } else {
                  this.$message.error(res.response.data.message)
                }
              })
            }
          } else {
            this.$message.error('There is an error in the form. Please correct it')
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

  /deep/ .toolbar {
    padding: 15px;
  }
  /*Commodity images*/
  .goods-image {
    width: 50px;
    height: 50px;
  }

  /deep/ .el-form-item__content {
    width: 65%;
  }

  /*baiduUE*/
  /deep/ #edui1 {
    width: 100% !important;
  }

  .content-goods-publish {
    padding: 15px;
    margin: 0 auto;
    text-align: center;
    border: 1px solid #ddd;
    background: none repeat scroll 0 0 #fff;
  }

  /*The form of information*/
  .el-form {
    padding-bottom: 80px;
    .el-form-item {
      width: 100%;
      text-align: left;

      /*Award points*/
      .integral-show {
        .el-input {
          width: 70px;
        }
      }
      /** The drop-down list*/
      /deep/ .el-select .el-select--medium {
        width: 160px;
      }
    }
    /deep/ .discount-model {
        margin-bottom: 15px;
    }

    /*The submit button*/
    /deep/ .btn-submit {
      width: 100%;
      .el-form-item__content {
        text-align: center;
      }
    }
  }

  /** Form information*/
  .goods-info {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    div {
      a {
        color: #409EFF;
      }
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: flex-start;
      margin-left: 20px;
    }
  }

  /*tile*/
  div.base-info-item {
    h4 {
      padding:0 10px;
      border: 1px solid #ddd;
      background-color: #f8f8f8;
      font-weight: bold;
      color: #333;
      font-size: 14px;
      line-height: 40px;
      text-align: left;
    }
    h4 + div {
      margin-top: 15px;
    }
    .el-form-item {
      margin-left: 5%;
      min-width: 300px;
    }
    .el-form-item__content {
      margin-left: 120px;
      text-align: left;
    }
    p.goods-group-manager {
      padding-left: 12.3%;
      text-align: left;
      color: #999;
      font-size: 13px;
    }
  }

  /*Product Form information*/
  .goods-table {
    /deep/ thead>tr {
      /deep/ th:nth-child(2) {
        text-align: left !important;
      }
    }
  }

  /*The mask layer*/
  .cus-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
  }
</style>


