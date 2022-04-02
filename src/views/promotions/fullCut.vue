<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleToggleClick">
      <!--满优惠列表-->
      <el-tab-pane label="满优惠列表" name="fullList">
        <en-table-layout
          toolbar
          pagination
          :tableData="tableData"
          :loading="loading">
          <div slot="toolbar" class="inner-toolbar">
            <div class="toolbar-btns">
              <el-button type="primary" @click="handleAddFullCut">新增</el-button>
            </div>
            <div class="toolbar-search">
              <en-table-search @search="searchEvent"/>
            </div>
          </div>
          <template slot="table-columns">
            <!--活动名称-->
            <el-table-column prop="title" label="活动名称"/>
            <!--开始时间-->
            <el-table-column label="开始时间" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.start_time | unixToDate }}</span>
              </template>
            </el-table-column>
            <!--结束时间-->
            <el-table-column label="结束时间" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.end_time | unixToDate }}</span>
              </template>
            </el-table-column>
            <!--活动类型-->
            <el-table-column prop="activity_type" label="活动类型" :formatter="activityType" width="120"  />
            <!--活动状态-->
            <el-table-column label="活动状态" prop="status_text" width="120" />
            <!--操作-->
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  v-html="(scope.row.status === 'END' || scope.row.status === 'UNDERWAY') ? '查看' : '编辑'"
                  type="success"
                  @click="handleEditMould(scope.row)">
                </el-button>
                <el-button
                  :disabled="scope.row.status === 'UNDERWAY'"
                  type="danger"
                  @click="handleDeleteFullCut(scope.row)">删除
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
      <!--新增满优惠-->
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
            <!--活动信息-->
            <div class="base-info-item">
              <h4>活动信息</h4>
              <div>
                <!--活动名称-->
                <el-form-item  label="活动名称：" prop="title">
                  <el-input
                    v-model="activityForm.title"
                    style="width: 300px"
                    placeholder="不超过50个字符"
                    maxLength="50">
                  </el-input>
                </el-form-item>
                <!--生效时间 开始时间--截止时间-->
                <el-form-item label="生效时间：" prop="take_effect_time">
                  <el-date-picker
                    v-model="activityForm.take_effect_time"
                    type="datetimerange"
                    value-format="timestamp"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="[MixinDefaultTime, MixinDefaultTime]"
                    :picker-options="{disabledDate(time) { return time.getTime() < Date.now() - 8.64E7 }}">
                  </el-date-picker>
                </el-form-item>
                <!--活动描述-->
                <el-form-item label="活动描述：">
                  <UE ref="UE" :defaultMsg="activityForm.description"></UE>
                </el-form-item>
              </div>
            </div>
            <!--优惠设置-->
            <div class="base-info-item">
              <h4>优惠设置</h4>
              <div>
                <!--优惠门槛-->
                <el-form-item label="优惠门槛：" prop="full_money">
                  <div>
                    满 <el-input v-model="activityForm.full_money" style="width: 100px;"></el-input>
                    元  <span class="discount-tip">消费达到此金额即可参与优惠</span>
                  </div>
                </el-form-item>
                <!--减现金-->
                <el-form-item label="优惠方式：" prop="minus_value" class="discount-model">
                  <el-checkbox :label="reduceCashTxt" v-model="is_full_minus" @change="changeReduceCash"></el-checkbox>
                  <span class="integral-show" v-show="is_full_minus">
                    <el-input  size="mini" v-model="activityForm.minus_value"></el-input> 元
                  </span>
                </el-form-item>
                <!--打折-->
                <el-form-item prop="discount_value" class="discount-model">
                  <el-checkbox :label="discountTxt" v-model="is_discount" @change="changeDiscount"></el-checkbox>
                  <span class="integral-show" v-show="is_discount">
                    <el-input  size="mini" v-model="activityForm.discount_value"></el-input> 折
                  </span>
                </el-form-item>
                <!--自营店--送积分-->
                <el-form-item prop="integral" class="discount-model" v-if="parseInt(shopInfo.self_operated) === 1">
                  <el-checkbox :label="integralTxt" v-model="isSendPoint" @change="changeIntegral"></el-checkbox>
                  <span class="integral-show" v-show="isSendPoint">
                    <el-input  size="mini" v-model="activityForm.point_value"></el-input> 分
                  </span>
                </el-form-item>
                <!--免邮费-->
                <el-form-item prop="is_free_ship" class="discount-model">
                  <el-checkbox label="免邮费" v-model="is_free_ship" @change="changeis_free_ship"></el-checkbox>
                </el-form-item>
                <!--送优惠券-->
                <el-form-item prop="bonus_id" class="discount-model">
                  <el-checkbox :label="couponTxt" v-model="is_send_bonus" @change="isChangeCoupon"></el-checkbox>
                  <el-select v-show="is_send_bonus" v-model="activityForm.bonus_id" placeholder="请选择" @change="changeCoupon">
                    <el-option
                      v-for="item in couponList"
                      :key="item.coupon_id"
                      :label="item.title"
                      :value="item.coupon_id">
                    </el-option>
                  </el-select>
                  <el-button type="text" v-show="is_send_bonus" @click="addCoupon">新增</el-button>
                </el-form-item>
                <!--送赠品-->
                <el-form-item prop="gift_id" class="discount-model">
                  <el-checkbox :label="giftTxt" v-model="is_send_gift" @change="isChangeGift"></el-checkbox>
                  <el-select v-show="is_send_gift" v-model="activityForm.gift_id" placeholder="请选择" @change="changeGift">
                    <el-option
                      v-for="item in giftList"
                      :key="item.gift_id"
                      :label="item.gift_name"
                      :value="item.gift_id">
                    </el-option>
                  </el-select>
                  <el-button type="text" v-show="is_send_gift" @click="addGift">新增</el-button>
                </el-form-item>
              </div>
            </div>
            <!--活动商品-->
            <div class="base-info-item">
              <h4>活动商品</h4>
              <div>
                <div class="activity-goods">
                  <el-form-item label="活动商品" prop="range_type">
                    <el-radio-group v-model="activityForm.range_type" @change="changeJoinGoods">
                      <el-radio :label="1">全部商品参与</el-radio>
                      <el-radio :label="2">部分商品参与</el-radio>
                    </el-radio-group>
                    <!--商品表格-->
                    <div v-show="!goodsShow" class="goods-table">
                      <en-table-layout
                        toolbar
                        :tableData="activityForm.goods_list"
                        :loading="loading"
                        :selectionChange="selectionChange">
                        <div slot="toolbar" class="inner-toolbar">
                          <div class="toolbar-btns">
                            <el-button type="primary" @click="showGoodsSelector">选择商品</el-button>
                            <el-button type="danger" @click="cancelall">批量取消</el-button>
                          </div>
                        </div>
                        <template slot="table-columns">
                          <el-table-column type="selection"/>
                          <!--商品信息-->
                          <el-table-column  label="商品信息">
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
                          <!--库存-->
                          <el-table-column prop="enable_quantity" label="库存" />
                          <!--操作-->
                          <el-table-column label="操作" width="150">
                            <template slot-scope="scope">
                              <el-button
                                type="danger"
                                @click="handleCancleJoin(scope.$index, scope.row)">取消参加
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
            <!--提交按钮-->
            <div class="btn-submit">
              <el-form-item>
                <el-button v-show="editEnabled" type="primary" @click="handleSaveActivity('activityForm')">保存设置</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <!--遮罩层-->
        <div :class="{'cus-mask': !editEnabled}"></div>
      </el-tab-pane>
    </el-tabs>
    <!--商品选择器-->
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
    <!--赠品组件-->
    <add-gift
      :giftModelShow="giftModelShow"
      @saveGift="saveGift"/>
    <!--优惠券组件-->
    <Coupon
      :couponModelShow="couponModelShow"
      @saveCoupon="saveCoupon"
    ></Coupon>
    <el-dialog
      title="以下商品已经参加其它活动，于当前活动存在冲突"
      :visible.sync="showConflictGoods"
      width="30%">
      <en-table-layout
        toolbar
        :tableData="conflictList">
        <template slot="table-columns">
          <!--商品名称-->
          <el-table-column prop="name" label="商品名称"/>
          <!--商品图片-->
          <el-table-column label="商品名称">
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
          return callback(new Error('请输入要优惠的现金金额'))
        }
        setTimeout(() => {
          if (!RegExp.money.test(value)) {
            callback(new Error('请输入正确的金额'))
          } else if (parseFloat(value) > 99999999) {
            callback(new Error('优惠门槛金额整数部分不得大于99999999'))
          } else if (this.is_full_minus && parseFloat(value) < parseFloat(this.activityForm.minus_value)) {
            callback(new Error('减少金额不能大于门槛金额'))
          } else {
            callback()
          }
        }, 1000)
      }
      const checkReduceCash = (rule, value, callback) => {
        if (this.is_full_minus) {
          if (!value) {
            return callback(new Error('请输入要优惠的现金金额'))
          }
          setTimeout(() => {
            if (!RegExp.money.test(value)) {
              callback(new Error('请输入正确的金额'))
            } else if (parseFloat(value) > 99999999) {
              callback(new Error('减少金额整数部分不得大于99999999'))
            } else if (this.is_full_minus && parseFloat(value) > parseFloat(this.activityForm.full_money)) {
              callback(new Error('减少金额不能大于门槛金额'))
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
            return callback(new Error('请输入要优惠的打折力度'))
          }
          // 正则范围 0.1-9.9
          setTimeout(() => {
            if (!/^((0\.[1-9]{1})|(([1-9]{1})(\.\d{1})?))$/.test(value)) {
              callback(new Error('请输入正整数或者一位小数'))
            } else if (parseInt(value) < 1 || parseInt(value) >= 10) {
              callback(new Error('打折数字只能在1-9.9之间'))
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
            return callback(new Error('请输入积分值'))
          }
          setTimeout(() => {
            if (!RegExp.integer.test(value)) {
              callback(new Error('请输入数字值'))
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
          return callback(new Error('请选择商品参与方式'))
        } else {
          callback()
        }
      }
      const checkTakeEffectTime = (rule, value, callback) => {
        const now = new Date().getTime()
        if (!value) {
          return callback(new Error('请选择生效时间'))
        } else if (value[0] <= now) {
          callback(new Error('活动开始时间不得小于当前时间'))
        } else {
          callback()
        }
      }
      return {
        /** 当前面板的名字*/
        activeName: 'fullList',

        /** 列表loading状态 */
        loading: false,

        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10
        },

        /** 列表数据*/
        tableData: [],

        /** 列表分页数据 */
        pageData: null,

        fullCutName: '新增满优惠',

        /** 新增满减表单信息*/
        activityForm: {
          /** 当前活动ID*/
          fd_id: '',

          /** 活动名称/标题*/
          title: '',

          /** 生效时间*/
          take_effect_time: [],

          /** 活动描述*/
          description: '',

          /** 优惠门槛*/
          full_money: '',

          /** 是否打折 */
          is_discount: 0,

          /** 打几折 */
          discount_value: 0,

          /** 是否减现金 */
          is_full_minus: 1,

          /** 减多少钱*/
          minus_value: 0,

          /** 是否送积分 */
          is_send_point: 1,

          /** 积分 */
          point_value: 0,

          /** 是否免邮费*/
          is_free_ship: 1,

          /** 是否有赠品  */
          is_send_gift: 1,

          /** 赠品id */
          gift_id: '',

          /** 是否送优惠券 */
          is_send_bonus: 1,

          /** 优惠券Id */
          bonus_id: '',

          /** 是否全部商品参与*/
          range_type: '',

          /** 活动商品*/
          goods_list: []
        },

        /** 是否减现金  */
        is_full_minus: false,

        /** 减现金文本 */
        reduceCashTxt: '减现金(与打折活动只能选择一种)',

        /** 是否打折 */
        is_discount: false,

        /** 打折文本 */
        discountTxt: '打折(与减现金活动只能选择一种)',

        /** 是否送积分 */
        isSendPoint: false,

        /** 积分文本 */
        integralTxt: '送积分',

        /** 是否免邮费 1免邮费*/
        is_free_ship: false,

        /** 是否送优惠券 */
        is_send_bonus: false,

        /** 优惠券显示文本 */
        couponTxt: '送优惠券',

        /** 优惠券列表 */
        couponList: [],

        /** 显示优惠券弹框 */
        couponModelShow: false,

        /** 是否有赠品  */
        is_send_gift: false,

        /** 赠品显示文本 */
        giftTxt: '送赠品',

        /** 赠品列表 */
        giftList: [],

        /** 显示赠品弹框 */
        giftModelShow: false,

        /** 是否显示商品表格*/
        goodsShow: true,

        /** 选择的goods_id*/
        selectionids: [],

        /** 商品选择器最大长度*/
        maxsize: 0,

        /** 商品ids */
        goodsIds: [],

        /** 商品选择器列表api*/
        goodsApi: 'seller/goods?market_enable=1&is_auth=1',

        /** 商城分类api */
        categoryApi: 'seller/goods/category/0/children',

        /** 回显数据使用 */
        multipleApi: 'seller/goods/@ids/details',

        /** 显示/隐藏商品选择器 */
        showDialog: false,

        /** 表单校验规则*/
        rules: {
          /** 活动名称 */
          title: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 0, max: 60, message: '长度在60个字符之内', trigger: 'blur' }
          ],

          /** 生效时间 */
          take_effect_time: [
            { type: 'array', required: true, message: '请选择生效时间', trigger: 'blur' },
            { validator: checkTakeEffectTime, trigger: 'blur' }
          ],

          /** 优惠门槛 */
          full_money: [
            { required: true, message: '请输入优惠门槛', trigger: 'blur' },
            { validator: checkDiscountThreshold, trigger: 'blur' }
          ],

          /** 减现金 */
          minus_value: [
            { validator: checkReduceCash, trigger: 'blur' }
          ],

          /** 打几折 */
          discount_value: [
            { validator: checkDiscountVal, trigger: 'blur' }
          ],

          /** 积分 */
          integral: [
            { validator: checkIntegral, trigger: 'blur' }
          ],

          /** 商品参与方式 */
          range_type: [
            { required: true, message: '请选择参与方式', trigger: 'blur' },
            { validator: checkRange, trigger: 'change' }
          ]
        },

        // 是否不可编辑 即是否是进行中 或者已失效状态 默认可以
        editEnabled: true,

        /** 是否显示冲突列表 */
        showConflictGoods: false,

        /** 冲突列表 显示商品名称 商品价格 商品图片 */
        conflictList: []
      }
    },
    mounted() {
      this.GET_FullCutActivityList()
      /** 优惠券列表 */
      this.GET_CouponsList()
      /** 赠品列表 */
      this.GET_giftList()
    },
    methods: {
      /** 活动类型 */
      activityType(row, column, cellValue) {
        if (row.is_discount === 1) {
          return '满折'
        }
        if (row.is_full_minus === 1) {
          return '满减'
        }
        return '满优惠'
      },

      /** 搜索事件触发 */
      searchEvent(data) {
        this.params = {
          ...this.params,
          keywords: data
        }
        this.GET_FullCutActivityList()
      },

      /** 切换面板 */
      handleToggleClick(tab, event) {
        this.activeName = tab.name
        switch (this.activeName) {
          case 'fullList':
            this.GET_FullCutActivityList()
            break
          case 'add':
            this.activityForm = {
              /** 活动名称/标题*/
              title: '',

              /** 生效时间*/
              take_effect_time: [],

              /** 活动描述*/
              description: '',

              /** 优惠门槛*/
              full_money: '',

              /** 是否打折 */
              is_discount: 0,

              /** 打几折 */
              discount_value: '',

              /** 是否减现金 */
              is_full_minus: 0,

              /** 减多少钱*/
              minus_value: '',

              /** 是否送积分 */
              isIntegral: 0,

              /** 积分 */
              integral: 0,

              /** 是否免邮费*/
              is_free_ship: 0,

              /** 是否有赠品  */
              is_send_gift: 0,

              /** 赠品id */
              gift_id: '',

              /** 是否送优惠券 */
              is_send_bonus: 0,

              /** 优惠券Id */
              bonus_id: '',

              /** 是否全部商品参与*/
              range_type: '',

              /** 活动商品*/
              goods_list: []
            }
            this.fullCutName = '新增满优惠'
            this.editEnabled = true
            /** 处理优惠数据 */
            this.is_discount = false
            this.is_full_minus = false
            this.isIntegral = false
            this.is_free_ship = false
            this.is_send_bonus = false
            this.is_send_gift = false
            this.discountTxt = '打折(与减现金活动只能选择一种)'
            this.reduceCashTxt = '减现金(与打折活动只能选择一种)'
            this.changeIntegral(this.isIntegral)
            this.isChangeCoupon(this.is_send_bonus)
            this.isChangeGift(this.is_send_gift)
        }
      },

      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_FullCutActivityList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_FullCutActivityList()
      },

      /** 是否全选商品*/
      changeJoinGoods(val) {
        this.goodsShow = val === 1
      },

      /** 保存商品选择器选择的商品 */
      refreshFunc(val) {
        if (val) {
          this.activityForm.goods_list = val
        }
      },

      /** 显示商品选择器*/
      showGoodsSelector() {
        this.showDialog = true
        this.goodsIds = this.activityForm.goods_list.map(key => {
          return key.goods_id
        })
      },

      /** 取消参加*/
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

      /** 商品选中项 */
      selectionChange(val) {
        this.selectionids = val.map(item => item.goods_id)
      },

      /** 批量取消 */
      cancelall() {
        this.selectionids.forEach(key => {
          this.activityForm.goods_list.forEach((elem, index) => {
            if (elem.goods_id === key) {
              this.activityForm.goods_list.splice(index, 1)
            }
          })
          this.$message.success('批量取消成功！')
        })
        this.goodsIds = this.activityForm.goods_list.map(key => {
          return key.goods_id
        })
      },

      /** 获取活动信息*/
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

      /** 编辑满减优惠 */
      handleEditMould(row) {
        this.activeName = 'add'
        this.fullCutName = '编辑满优惠'
        this.editEnabled = !(row.status === 'END' || row.status === 'UNDERWAY')
        setTimeout(() => { this.$refs['activityForm'].resetFields() })
        this.GET_FullCutActivityDetails(row.fd_id)
      },

      /** 获取单个商品详情 */
      GET_FullCutActivityDetails(id) {
        API_activity.getFullCutActivityDetails(id, {}).then((response) => {
          this.activityForm = {
            ...response,
            fd_id: id,
            take_effect_time: [parseInt(response.start_time) * 1000, parseInt(response.end_time) * 1000]
          }
          /** 处理商品信息 */
          this.goodsShow = this.activityForm.range_type === 1
          this.activityForm.goods_list = response.goods_list
          /** 处理优惠数据 */
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

      /** 删除满减优惠活动 */
      handleDeleteFullCut(row) {
        this.$confirm('确认删除当前项？', '确认信息', { type: 'warning' })
          .then(() => this.toDelActivity(row))
          .catch(() => {})
      },

      /** 执行删除*/
      toDelActivity(row) {
        API_activity.deleteFullCutActivity(row.fd_id).then(() => {
          this.$message.success('删除成功！')
          this.GET_FullCutActivityList()
        })
      },

      /** 新增满减优惠 */
      handleAddFullCut() {
        this.activeName = 'add'
        this.fullCutName = '新增满优惠'
        this.editEnabled = true
        this.activityForm = {
          /** 活动名称/标题*/
          title: '',

          /** 生效时间*/
          take_effect_time: [],

          /** 活动描述*/
          description: '',

          /** 优惠门槛*/
          full_money: '',

          /** 是否打折 */
          is_discount: 0,

          /** 打几折 */
          discount_value: '',

          /** 是否减现金 */
          is_full_minus: 0,

          /** 减多少钱*/
          minus_value: '',

          /** 是否送积分 */
          isIntegral: 0,

          /** 积分 */
          integral: 0,

          /** 是否免邮费*/
          is_free_ship: 0,

          /** 是否有赠品  */
          is_send_gift: 0,

          /** 赠品id */
          gift_id: '',

          /** 是否送优惠券 */
          is_send_bonus: 0,

          /** 优惠券Id */
          bonus_id: '',

          /** 是否全部商品参与*/
          range_type: '',

          /** 活动商品*/
          goods_list: []
        }
        this.is_discount = false
        this.is_full_minus = false
        this.isSendPoint = false
        this.is_free_ship = false
        this.is_send_bonus = false
        this.is_send_gift = false

        this.discountTxt = '打折(与减现金活动只能选择一种)'
        this.reduceCashTxt = '减现金(与打折活动只能选择一种)'
        this.changeIntegral(this.isIntegral)
        this.isChangeCoupon(this.is_send_bonus)
        this.isChangeGift(this.is_send_gift)
      },

      /** 是否打折 */
      changeDiscount(val) {
        this.is_discount = val
        this.activityForm.is_discount = val ? 1 : 0
        if (this.is_full_minus) {
          this.activityForm.is_full_minus = val ? 0 : 1
        }
        if (val) {
          this.is_full_minus = !this.is_discount
          this.reduceCashTxt = this.is_full_minus ? '减' : '减现金(与打折活动只能选择一种)'
        }
        this.discountTxt = this.is_discount ? '打' : '打折(与减现金活动只能选择一种)'
      },

      /** 是否减现金 */
      changeReduceCash(val) {
        this.is_full_minus = val
        this.activityForm.is_full_minus = val ? 1 : 0
        if (this.is_discount) {
          this.activityForm.is_discount = val ? 0 : 1
        }
        if (val) {
          this.is_discount = !this.is_full_minus
          this.discountTxt = this.is_discount ? '打' : '打折(与减现金活动只能选择一种)'
        }
        this.reduceCashTxt = this.is_full_minus ? '减' : '减现金(与打折活动只能选择一种)'
      },

      /** 是否送积分 */
      changeIntegral(val) {
        this.integralTxt = val ? '送' : '送积分'
        this.activityForm.is_send_point = val ? 1 : 0
      },

      /** 是否免邮费改变 */
      changeis_free_ship(val) {
        this.is_free_ship = val
        this.activityForm.is_free_ship = this.is_free_ship ? 1 : 0
      },

      /** 是否送优惠券 */
      isChangeCoupon(val) {
        this.is_send_bonus = val
        this.activityForm.is_send_bonus = this.is_send_bonus ? 1 : 0
        this.couponTxt = this.is_send_bonus ? '送' : '送优惠券'
      },

      /** 获取优惠券列表 */
      GET_CouponsList() {
        API_coupon.getCouponsStatusList().then(response => {
          this.couponList = response
        })
      },

      /** 所选优惠券变化时 */
      changeCoupon(val) {
        this.activityForm.bonus_id = val
      },

      /** 新增优惠券 */
      addCoupon() {
        this.couponModelShow = true
      },

      /** 优惠券监听 */
      saveCoupon(target) {
        this.couponModelShow = false
        target && this.GET_CouponsList()
      },

      /** 是否送赠品 */
      isChangeGift(val) {
        this.is_send_gift = val
        this.activityForm.is_send_gift = this.is_send_gift ? 1 : 0
        this.giftTxt = this.is_send_gift ? '送' : '送赠品'
      },

      /** 获取赠品列表 */
      GET_giftList() {
        API_Gift.getGiftsAllList().then(response => {
          this.giftList = response
        })
      },

      /** 所选赠品变化时 */
      changeGift(val) {
        this.activityForm.gift_id = val
      },

      /** 新增赠品 */
      addGift() {
        this.giftModelShow = true
      },

      /** 赠品监听  */
      saveGift(target) {
        this.giftModelShow = false
        target && this.GET_giftList()
      },

      /** 保存表单设置*/
      handleSaveActivity(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            /** 处理表单数据 */
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
                this.$message.success('保存成功！')
                this.activeName = 'fullList'
                this.GET_FullCutActivityList()
              }).catch((res) => {
                if (res.response.data.code === '401' && res.response.data.data) {
                  this.showConflictGoods = true
                  const goods_name = JSON.parse(res.response.data.data).map(key => { return key.name }).toString()
                  this.$message.error(`${goods_name}已经参加其它活动，于当前活动存在冲突`)
                } else {
                  this.$message.error(res.response.data.message)
                }
              })
            } else {
              API_activity.addFullCutActivity(this.activityForm).then(() => {
                this.$message.success('添加成功！')
                this.activeName = 'fullList'
                this.GET_FullCutActivityList()
              }).catch((res) => {
                if (res.response.data.code === '401' && res.response.data.data) {
                  // this.showConflictGoods = true
                  // this.conflictList = JSON.parse(res.response.data.data)
                  const goods_name = JSON.parse(res.response.data.data).map(key => { return key.name }).toString()
                  this.$message.error(`${goods_name}已经参加其它活动，于当前活动存在冲突`)
                } else {
                  this.$message.error(res.response.data.message)
                }
              })
            }
          } else {
            this.$message.error('表单存在错误，请修正')
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
  /*商品图片*/
  .goods-image {
    width: 50px;
    height: 50px;
  }

  /deep/ .el-form-item__content {
    width: 65%;
  }

  /*百度UE*/
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

  /*表单信息*/
  .el-form {
    padding-bottom: 80px;
    .el-form-item {
      width: 100%;
      text-align: left;

      /*送积分*/
      .integral-show {
        .el-input {
          width: 70px;
        }
      }
      /** 下拉列表 */
      /deep/ .el-select .el-select--medium {
        width: 160px;
      }
    }
    /deep/ .discount-model {
        margin-bottom: 15px;
    }

    /*提交按钮*/
    /deep/ .btn-submit {
      width: 100%;
      .el-form-item__content {
        text-align: center;
      }
    }
  }

  /** 表格信息 */
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

  /*平铺*/
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

  /*商品表格信息*/
  .goods-table {
    /deep/ thead>tr {
      /deep/ th:nth-child(2) {
        text-align: left !important;
      }
    }
  }

  /*遮罩层*/
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


