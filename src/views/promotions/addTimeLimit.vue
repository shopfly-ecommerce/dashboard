<template>
  <div class="sign-up-bg" v-loading="loading">
    <el-form
      :model="activityData"
      v-if="activityData"
      label-position="right"
      ref="activityData"
      label-width="120px"
      class="demo-ruleForm">
      <!--Event date-->
      <el-form-item  label="Event date:">
        {{ activityData.start_day | unixToDate }}
      </el-form-item>
      <!--Deadline for Registration-->
      <el-form-item label="Deadline for Registration:">
        {{ activityData.apply_end_time | unixToDate }}
      </el-form-item>
      <!--Apply the rules-->
      <el-form-item label="Apply the rules:">
        {{ activityData.seckill_rule }}
      </el-form-item>
      <!--Snap up stage-->
      <el-form-item label="Snap up stage:">
        <div v-for="(value, key) in activityData.range_list">
          <div class="panic-buy">
            <span class="time_pancy">{{ key }}:00</span>
            <el-button type="primary" @click="selectgoodslist(key)">Choose goods</el-button>
          </div>
          <div :key="key">
            <en-table-layout
              v-if="value && value.length >= 1"
              :tableData="value"
              :key="key"
              class="buy-info"
              :loading="loading">
              <template slot="table-columns">
                <el-table-column label="Name">
                  <template slot-scope="scope">
                    <a href="" target="_blank" style="color: #00a2d4;">{{ scope.row.goods_name }}</a>
                  </template>
                </el-table-column>
                <el-table-column label="Price" width="100">
                  <template slot-scope="scope">
                    {{ scope.row.original_price | unitPrice('¥') }}
                  </template>
                </el-table-column>
                <el-table-column label="Activity price">
                  <template slot-scope="scope">
                    <el-input placeholder="Please enter the activity price" @blur="intMoney(scope.row)" v-model="scope.row.price" style="width: 50%;">
                      <template slot="prepend">¥</template>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column label="The number sold out">
                  <template slot-scope="scope">
                    <el-input-number v-model="scope.row.sold_quantity" controls-position="right"  :min="0"/>
                  </template>
                </el-table-column>
                <el-table-column label="Operation" width="70">
                  <template slot-scope="scope">
                    <i class="el-icon-error icon-close" @click="handleDelgoods(key,scope.row)"></i>
                  </template>
                </el-table-column>
              </template>
            </en-table-layout>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div style="text-align: center;">
      <el-button type="primary" @click="handleSignUp">Determine the registration</el-button>
    </div>
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
  </div>
</template>

<script>
  import * as API_limitTime from '@/api/limitTime'
  import { CategoryPicker } from '@/components'
  import { RegExp } from '~/ui-utils'
  import { cloneObj } from '@/utils/index'
  export default {
    name: 'addTimeLimit',
    components: {
      [CategoryPicker.name]: CategoryPicker
    },
    data() {
      return {
        /** loadingStatus*/
        loading: false,

        /** Activity information*/
        activityData: {},

        /** activityID*/
        seckillID: '',

        /** productids */
        goodsIds: [],

        /** The sequence of tables for the current operation*/
        _order: 0,

        /** Maximum length of commodity selector*/
        maxsize: 0,

        /** Product selector listapi*/
        goodsApi: 'seller/goods?market_enable=1&is_auth=1',

        /** Mall classificationapi */
        categoryApi: 'seller/goods/category/0/children',

        /** Echo data usage*/
        multipleApi: 'seller/goods/@ids/details',

        /** According to/Hide the product selector*/
        showDialog: false
      }
    },
    mounted() {
      this.activityID = this.$route.params.id
      this.GET_limitTimeActivityDetails()
    },
    beforeRouteUpdate(to, from, next) {
      this.activityID = to.params.id
      this.GET_limitTimeActivityDetails()
      next()
    },
    methods: {
      /** Get details of time-limited activities*/
      GET_limitTimeActivityDetails() {
        API_limitTime.getLimitTimeAlreadyActivityDetails(this.activityID, {}).then(response => {
          this.loading = false
          this.activityData = response
        })
      },

      intMoney(row) {
        if (!RegExp.money.test(row.act_price)) {
          row.act_price = 0.00
        } else {
          row.act_price = Number.parseFloat(row.act_price).toFixed(2)
        }
      },

      /** Determine the registration*/
      handleSignUp() {
        let _params = []
        for (let k in this.activityData.range_list) {
          let rangeLength = this.activityData.range_list[k] ? this.activityData.range_list[k].length : 0
          if (rangeLength !== 0) {
            const _arr = this.activityData.range_list[k].map(key => {
              let _item = {
                goods_id: key.goods_id,
                goods_name: key.goods_name,
                sold_quantity: parseInt(key.sold_quantity),
                price: Number(key.price),
                seckill_id: parseInt(this.activityID),
                original_price: key.original_price,
                time_line: k,
                start_day: this.activityData.start_day,
                status: this.activityData.seckill_status
              }
              return _item
            })
            _params = _params.concat(_arr)
          }
        }
        /** Parameter format check*/
        let _result = true
        _params.forEach(key => {
          if (!RegExp.money.test(key.price) || key.price <= 0) {
            this.$message.error('Please fill in the correct snap - up price')
            _result = false
            return
          }
          if (!RegExp.integer.test(key.sold_quantity)) {
            this.$message.error('Sell out quantity must be a positive integer')
            _result = false
            return
          }
        })
        if (!_result) {
          return
        }
        const routerCallBack = this.$route.params.callback
        this.$confirm('Products registered for this activity can only be edited during this registration operation, Whether or not to continue,Please operate with caution?', 'prompt', { type: 'warning' }).then(() => {
          API_limitTime.signUpLimitTimeActivity(_params).then(() => {
            this.$message.success('Sign up success')
            this.$store.dispatch('delCurrentViews', {
              view: this.$route,
              $router: this.$router
            })
            routerCallBack && routerCallBack()
            this.$router.push({ path: `/promotions/activity-goods-data/${this.activityID}` })
          })
        })
      },

      /** Delete the selected item*/
      handleDelgoods(key, row) {
        for (let item in this.activityData.range_list[key]) {
          if (row.goods_id === this.activityData.range_list[key][item].goods_id) {
            this.$delete(this.activityData.range_list[key], item)
          }
        }
      },

      /**  Displays the product selector*/
      selectgoodslist(key) {
        this.showDialog = true
        this.goodsIds = (this.activityData.range_list[key] || []).map(key => {
          return key.goods_id
        })
        this._order = key
      },

      /** Save the item selected by the commodity selector*/
      refreshFunc(val) {
        /** Add Event Price& The number sold out*/
        val.forEach(key => {
          this.$set(key, 'original_price', key.price)
          this.$set(key, 'sold_quantity', 0)
          this.$set(key, 'price', 0)
        })
        let key = this._order
        let result_list = []
        let primeval_list = this.activityData.range_list[key]
        let clone_list = cloneObj(val)
        if (primeval_list && primeval_list.length) {
          clone_list.forEach(clone_list_item => {
            if (primeval_list.find(item => clone_list_item.goods_id === item.goods_id)) {
              result_list.push(primeval_list.find(item => clone_list_item.goods_id === item.goods_id))
            } else {
              result_list.push(clone_list_item)
            }
          })
          this.activityData.range_list[key] = result_list
        } else {
          this.activityData.range_list[key] = cloneObj(val)
        }
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /*The background color*/
  .sign-up-bg {
    background: #fff;
    border: 1px solid #ddd;
    padding: 15px;
  }
  .demo-ruleForm {
    margin-left: 4.5%;
  }
  .icon-close {
    cursor: pointer;
  }
  /*Table style modification*/
  .has-gutter th {
    height: 50px;
    line-height: 50px;
  }

  /*tile*/
  div.base-info-item {
    .el-form-item {
      margin-left: 5%;
      width: 22%;
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

   /*Buying period*/
  .time_pancy {
    display: inline-block;
    margin: 8px 11px 8px 0;
    text-align: center;
    width: 200px;
    padding: 6px 10px;
    background: #fff;
    border:1px dotted #dddddd;
    border-radius: 3px;
    font-size: 15px;
  }
</style>
