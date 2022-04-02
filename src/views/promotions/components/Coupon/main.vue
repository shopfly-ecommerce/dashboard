<template>
  <el-dialog :title="couponTitle" :visible.sync="couponShow" width="30%">
    <el-form :model="couponForm" ref="couponForm" label-position="right" :rules="rules"  label-width="120px">
      <el-form-item label="优惠券名称：" prop="title">
        <el-input
          auto-complete="off"
          v-model="couponForm.title"
          @change="couponForm.title = couponForm.title.trim()"
          placeholder="请输入10个以内的汉字"
          maxLength="10"
          label-width="100"></el-input>
      </el-form-item>
      <el-form-item label="优惠券面额：" prop="coupon_price">
        <el-input placeholder="请输入优惠券面额,长度最多8个字符" maxLength="8" v-model="couponForm.coupon_price">
          <template slot="prepend">¥</template>
        </el-input>
      </el-form-item>
      <el-form-item label="买家需消费：" prop="coupon_threshold_price">
        <el-input placeholder="请输入内容,长度最多8个字符" maxlength="8" v-model="couponForm.coupon_threshold_price">
          <template slot="prepend">¥</template>
        </el-input>
      </el-form-item>
      <el-form-item label="使用期限：" style="text-align: left" prop="coupon_time_limit">
        <el-date-picker
          v-model="couponForm.coupon_time_limit"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          clearable
          :default-time="[MixinDefaultTime]"
          :picker-options="{disabledDate(time) { return time.getTime() < Date.now() - 8.64E7 }}">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="发行量：" prop="create_num">
        <el-input v-model="couponForm.create_num" maxlength="8" label-width="100"></el-input>
      </el-form-item>
      <el-form-item label="每人限领：" prop="limit_num">
        <el-input v-model="couponForm.limit_num" maxlength="8"  label-width="100"></el-input>
        <p>提示：如果每人限领数量为0，代表不限制会员领取优惠券数量</p>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancelCoupon">取 消</el-button>
      <el-button type="primary" @click="handleReserveCoupon">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import * as API_coupon from '@/api/coupon'
  import { RegExp } from '~/ui-utils'
  export default {
    name: 'Coupon',
    data() {
      const checkCouponPrice = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入优惠券面额'))
        } else if (!RegExp.money.test(value)) {
          callback(new Error('请输入正确的面额'))
        } else {
          callback()
        }
      }
      const checkCouponThresholdPrice = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入消费门槛金额'))
        } else if (!RegExp.money.test(value)) {
          callback(new Error('请输入正确的金额'))
        } else {
          callback()
        }
      }
      const checkCreateNum = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入发行量'))
        } else if (!RegExp.integer.test(value)) {
          callback(new Error('请输入正整数'))
        } else if (parseInt(value) < parseInt(this.couponForm.limit_num)) {
          callback(new Error('每人限领数量不得大于发行量'))
        } else {
          callback()
        }
      }
      const checkLimitNum = (rule, value, callback) => {
        if (!value && parseInt(value) !== 0) {
          callback(new Error('请输入每人限领数量'))
        } else if (!RegExp.integer.test(value) && parseInt(value) !== 0) {
          callback(new Error('请输入正整数'))
        } else if (parseInt(value) > parseInt(this.couponForm.create_num)) {
          callback(new Error('每人限领数量不得大于发行量'))
        } else {
          callback()
        }
      }

      return {
        /** 是否显示优惠券弹框 */
        couponShow: false,

        /** 日期选择器选项 */
        pickoptions: {
          disabledDate: (time) => {
            return time.getTime() < Date.now()
          }
        },

        /** 优惠券表单*/
        couponForm: {
          title: '',
          coupon_price: '',
          coupon_threshold_price: '',
          coupon_time_limit: [],
          create_num: '',
          limit_num: ''
        },

        /** 表单校验规则 */
        rules: {
          /** 优惠券名称 */
          title: [
            { required: true, message: '请输入优惠券名称', trigger: 'blur' }
          ],

          /** 优惠券面额 */
          coupon_price: [
            { required: true, message: '请输入优惠券面额', trigger: 'blur' },
            { validator: checkCouponPrice, trigger: 'blur' }
          ],

          /** 消费门槛 */
          coupon_threshold_price: [
            { required: true, message: '请输入消费门槛', trigger: 'blur' },
            { validator: checkCouponThresholdPrice, trigger: 'blur' }
          ],

          /** 使用期限 */
          coupon_time_limit: [
            { required: true, message: '请输入使用期限', trigger: 'blur' },
            { type: 'array', trigger: 'blur' }
          ],

          /** 发行量 */
          create_num: [
            { required: true, message: '请输入优惠券发行量', trigger: 'blur' },
            { validator: checkCreateNum, trigger: 'blur' }
          ],

          /** 每人限领 */
          limit_num: [
            { required: true, message: '请输入限领数量', trigger: 'blur' },
            { validator: checkLimitNum, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      couponTitle() {
        return this.currentcouponId ? '编辑优惠券' : '新增优惠券'
      }
    },
    props: {
      /** 是否显示优惠券弹框 */
      couponModelShow: {
        type: Boolean,
        default: false
      },

      /** 当前优惠券Id */
      currentcouponId: {
        type: [Number, String],
        default: () => {
          return ''
        }
      }
    },
    watch: {
      couponModelShow() {
        this.couponShow = this.couponModelShow
        setTimeout(() => { this.$refs['couponForm'].resetFields() })
      },
      couponShow() {
        !this.couponShow && this.$emit('saveCoupon', false)
      },
      currentcouponId() {
        if (this.currentcouponId) {
          this.GET_couponDetails()
        } else {
          this.couponForm = {
            /** 优惠券名称*/
            title: '',

            /** 优惠券面额（元）*/
            coupon_price: '',

            /** 使用限制（元）*/
            coupon_threshold_price: '',

            /** 使用时限 */
            coupon_time_limit: [],

            /** 发行量（个） */
            create_num: '',

            /** 每人限领 */
            limit_num: ''
          }
        }
      }
    },
    methods: {
      /** 查询一个优惠券详情 */
      GET_couponDetails() {
        API_coupon.getCouponDetails(this.currentcouponId, {}).then(response => {
          this.couponForm = {
            ...response,
            coupon_time_limit: [parseInt(response.start_time) * 1000, parseInt(response.end_time) * 1000]
          }
        })
      },

      /** 取消 */
      handleCancelCoupon() {
        this.$emit('saveCoupon', false)
      },

      /** 保存优惠券*/
      handleReserveCoupon() {
        this.$refs['couponForm'].validate((valid) => {
          if (valid) {
            const _params = {
              ...this.couponForm,
              start_time: this.couponForm.coupon_time_limit[0] / 1000,
              end_time: this.couponForm.coupon_time_limit[1] / 1000
            }
            delete _params.coupon_time_limit
            this.$confirm('优惠券生效后不可编辑，是否确认？', '提示', { type: 'warning' }).then(() => {
              if (this.currentcouponId) {
                API_coupon.modifyCoupons(this.currentcouponId, _params).then(() => {
                  this.couponShow = false
                  this.$message.success('保存成功！')
                  this.$emit('saveCoupon', true)
                })
              } else {
                API_coupon.addCoupons(_params).then(() => {
                  this.couponShow = false
                  this.$message.success('保存成功！')
                  this.$emit('saveCoupon', true)
                })
              }
            }).catch(() => {})
          } else {
            this.$message.error('表单存在错误，请修改')
          }
        })
      }
    }
  }
</script>

<style lang="scss" type="scss" scoped>
  .el-date-editor {
    width: 100%;
  }
</style>
