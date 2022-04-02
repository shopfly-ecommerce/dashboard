<template>
  <div class="sign-up-bg" v-loading="loading">
    <el-form
      :model="activityData"
      v-if="activityData"
      label-position="right"
      ref="activityData"
      label-width="120px"
      class="demo-ruleForm">
      <!--活动日期-->
      <el-form-item  label="活动日期:">
        {{ activityData.start_day | unixToDate }}
      </el-form-item>
      <!--报名截止日期-->
      <el-form-item label="报名截止日期:">
        {{ activityData.apply_end_time | unixToDate }}
      </el-form-item>
      <!--申请规则-->
      <el-form-item label="申请规则:">
        {{ activityData.seckill_rule }}
      </el-form-item>
      <!--抢购阶段-->
      <el-form-item label="抢购阶段:">
        <div v-for="(value, key) in activityData.range_list">
          <div class="panic-buy">
            <span class="time_pancy">{{ key }}:00</span>
            <el-button type="primary" @click="selectgoodslist(key)">选择商品</el-button>
          </div>
          <div :key="key">
            <en-table-layout
              v-if="value && value.length >= 1"
              :tableData="value"
              :key="key"
              class="buy-info"
              :loading="loading">
              <template slot="table-columns">
                <el-table-column label="商品名称">
                  <template slot-scope="scope">
                    <a href="" target="_blank" style="color: #00a2d4;">{{ scope.row.goods_name }}</a>
                  </template>
                </el-table-column>
                <el-table-column label="商品价格" width="100">
                  <template slot-scope="scope">
                    {{ scope.row.original_price | unitPrice('¥') }}
                  </template>
                </el-table-column>
                <el-table-column label="活动价">
                  <template slot-scope="scope">
                    <el-input placeholder="请输入活动价" @blur="intMoney(scope.row)" v-model="scope.row.price" style="width: 50%;">
                      <template slot="prepend">¥</template>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column label="售空数量">
                  <template slot-scope="scope">
                    <el-input-number v-model="scope.row.sold_quantity" controls-position="right"  :min="0"/>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="70">
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
      <el-button type="primary" @click="handleSignUp">确定报名</el-button>
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
        /** loading状态*/
        loading: false,

        /** 活动信息*/
        activityData: {},

        /** 活动ID*/
        seckillID: '',

        /** 商品ids */
        goodsIds: [],

        /** 当前操作的表格序列*/
        _order: 0,

        /** 商品选择器最大长度*/
        maxsize: 0,

        /** 商品选择器列表api*/
        goodsApi: 'seller/goods?market_enable=1&is_auth=1',

        /** 商城分类api */
        categoryApi: 'seller/goods/category/0/children',

        /** 回显数据使用 */
        multipleApi: 'seller/goods/@ids/details',

        /** 显示/隐藏商品选择器 */
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
      /** 获取限时活动详情 */
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

      /** 确定报名 */
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
        /** 参数格式校验 */
        let _result = true
        _params.forEach(key => {
          if (!RegExp.money.test(key.price) || key.price <= 0) {
            this.$message.error('请填写正确的抢购价格')
            _result = false
            return
          }
          if (!RegExp.integer.test(key.sold_quantity)) {
            this.$message.error('售空数量须为正整数')
            _result = false
            return
          }
        })
        if (!_result) {
          return
        }
        const routerCallBack = this.$route.params.callback
        this.$confirm('参与此活动进行报名的商品仅可在此次报名操作中编辑, 是否继续,请谨慎操作?', '提示', { type: 'warning' }).then(() => {
          API_limitTime.signUpLimitTimeActivity(_params).then(() => {
            this.$message.success('报名成功')
            this.$store.dispatch('delCurrentViews', {
              view: this.$route,
              $router: this.$router
            })
            routerCallBack && routerCallBack()
            this.$router.push({ path: `/promotions/activity-goods-data/${this.activityID}` })
          })
        })
      },

      /** 删除已选中的商品*/
      handleDelgoods(key, row) {
        for (let item in this.activityData.range_list[key]) {
          if (row.goods_id === this.activityData.range_list[key][item].goods_id) {
            this.$delete(this.activityData.range_list[key], item)
          }
        }
      },

      /**  显示商品选择器*/
      selectgoodslist(key) {
        this.showDialog = true
        this.goodsIds = (this.activityData.range_list[key] || []).map(key => {
          return key.goods_id
        })
        this._order = key
      },

      /** 保存商品选择器选择的商品 */
      refreshFunc(val) {
        /** 添加活动价格 & 售空数量 */
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
  /*背景颜色*/
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
  /*表格样式修正*/
  .has-gutter th {
    height: 50px;
    line-height: 50px;
  }

  /*平铺*/
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

   /*抢购时间段*/
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
