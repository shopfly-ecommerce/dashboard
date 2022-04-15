<template>
  <el-dialog :title="couponTitle" :visible.sync="couponShow" width="30%">
    <el-form :model="couponForm" ref="couponForm" label-position="right" :rules="rules"  label-width="120px">
      <el-form-item label="Coupon name：" prop="title">
        <el-input
          auto-complete="off"
          v-model="couponForm.title"
          @change="couponForm.title = couponForm.title.trim()"
          placeholder="Please enter the10Chinese characters within 10"
          maxLength="10"
          label-width="100"></el-input>
      </el-form-item>
      <el-form-item label="Coupon face value：" prop="coupon_price">
        <el-input placeholder="Please enter coupon denomination,The length of the most8A character" maxLength="8" v-model="couponForm.coupon_price">
          <template slot="prepend">¥</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Buyers need to consume：" prop="coupon_threshold_price">
        <el-input placeholder="Please enter content,The length of the most8A character" maxlength="8" v-model="couponForm.coupon_threshold_price">
          <template slot="prepend">¥</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Use period：" style="text-align: left" prop="coupon_time_limit">
        <el-date-picker
          v-model="couponForm.coupon_time_limit"
          type="daterange"
          range-separator="-"
          start-placeholder="Start date"
          end-placeholder="End date"
          clearable
          :default-time="[MixinDefaultTime]"
          :picker-options="{disabledDate(time) { return time.getTime() < Date.now() - 8.64E7 }}">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="circulation：" prop="create_num">
        <el-input v-model="couponForm.create_num" maxlength="8" label-width="100"></el-input>
      </el-form-item>
      <el-form-item label="Each limit get：" prop="limit_num">
        <el-input v-model="couponForm.limit_num" maxlength="8"  label-width="100"></el-input>
        <p>prompt：If the limit is per person0, which means that there is no limit on the number of coupons members can receive</p>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancelCoupon">cancel</el-button>
      <el-button type="primary" @click="handleReserveCoupon">save</el-button>
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
          callback(new Error('Please enter coupon denomination'))
        } else if (!RegExp.money.test(value)) {
          callback(new Error('Please enter the correct denomination'))
        } else {
          callback()
        }
      }
      const checkCouponThresholdPrice = (rule, value, callback) => {
        if (!value) {
          callback(new Error('Please enter the threshold amount'))
        } else if (!RegExp.money.test(value)) {
          callback(new Error('Please enter the correct amount'))
        } else {
          callback()
        }
      }
      const checkCreateNum = (rule, value, callback) => {
        if (!value) {
          callback(new Error('Please enter circulation'))
        } else if (!RegExp.integer.test(value)) {
          callback(new Error('Please enter a positive integer'))
        } else if (parseInt(value) < parseInt(this.couponForm.limit_num)) {
          callback(new Error('No more than the quantity of circulation per person'))
        } else {
          callback()
        }
      }
      const checkLimitNum = (rule, value, callback) => {
        if (!value && parseInt(value) !== 0) {
          callback(new Error('Please enter the limit per person'))
        } else if (!RegExp.integer.test(value) && parseInt(value) !== 0) {
          callback(new Error('Please enter a positive integer'))
        } else if (parseInt(value) > parseInt(this.couponForm.create_num)) {
          callback(new Error('No more than the quantity of circulation per person'))
        } else {
          callback()
        }
      }

      return {
        /** Whether to display coupon pop-ups*/
        couponShow: false,

        /** Date picker options*/
        pickoptions: {
          disabledDate: (time) => {
            return time.getTime() < Date.now()
          }
        },

        /** Coupon form*/
        couponForm: {
          title: '',
          coupon_price: '',
          coupon_threshold_price: '',
          coupon_time_limit: [],
          create_num: '',
          limit_num: ''
        },

        /** Form check rule*/
        rules: {
          /** Coupon name*/
          title: [
            { required: true, message: 'Please enter the name of the coupon', trigger: 'blur' }
          ],

          /** Coupon face value*/
          coupon_price: [
            { required: true, message: 'Please enter coupon denomination', trigger: 'blur' },
            { validator: checkCouponPrice, trigger: 'blur' }
          ],

          /** The consumption threshold*/
          coupon_threshold_price: [
            { required: true, message: 'Please enter the consumption threshold', trigger: 'blur' },
            { validator: checkCouponThresholdPrice, trigger: 'blur' }
          ],

          /** Use period*/
          coupon_time_limit: [
            { required: true, message: 'Please enter the term of use', trigger: 'blur' },
            { type: 'array', trigger: 'blur' }
          ],

          /** circulation*/
          create_num: [
            { required: true, message: 'Please enter coupon quantity', trigger: 'blur' },
            { validator: checkCreateNum, trigger: 'blur' }
          ],

          /** Each limit get*/
          limit_num: [
            { required: true, message: 'Please enter the limit quantity', trigger: 'blur' },
            { validator: checkLimitNum, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      couponTitle() {
        return this.currentcouponId ? 'Edit coupons' : 'New coupons'
      }
    },
    props: {
      /** Whether to display coupon pop-ups*/
      couponModelShow: {
        type: Boolean,
        default: false
      },

      /** Current couponId */
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
            /** Coupon name*/
            title: '',

            /** Coupon face value（USD）*/
            coupon_price: '',

            /** Use restrictions（USD）*/
            coupon_threshold_price: '',

            /** Use time limit*/
            coupon_time_limit: [],

            /** circulation（a） */
            create_num: '',

            /** Each limit get*/
            limit_num: ''
          }
        }
      }
    },
    methods: {
      /** Query a coupon for details*/
      GET_couponDetails() {
        API_coupon.getCouponDetails(this.currentcouponId, {}).then(response => {
          this.couponForm = {
            ...response,
            coupon_time_limit: [parseInt(response.start_time) * 1000, parseInt(response.end_time) * 1000]
          }
        })
      },

      /** cancel*/
      handleCancelCoupon() {
        this.$emit('saveCoupon', false)
      },

      /** Save coupons*/
      handleReserveCoupon() {
        this.$refs['couponForm'].validate((valid) => {
          if (valid) {
            const _params = {
              ...this.couponForm,
              start_time: this.couponForm.coupon_time_limit[0] / 1000,
              end_time: this.couponForm.coupon_time_limit[1] / 1000
            }
            delete _params.coupon_time_limit
            this.$confirm('The coupon is not editable after it takes effect, please confirm？', 'prompt', { type: 'warning' }).then(() => {
              if (this.currentcouponId) {
                API_coupon.modifyCoupons(this.currentcouponId, _params).then(() => {
                  this.couponShow = false
                  this.$message.success('Save success！')
                  this.$emit('saveCoupon', true)
                })
              } else {
                API_coupon.addCoupons(_params).then(() => {
                  this.couponShow = false
                  this.$message.success('Save success！')
                  this.$emit('saveCoupon', true)
                })
              }
            }).catch(() => {})
          } else {
            this.$message.error('There is an error in the form. Please modify it')
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
