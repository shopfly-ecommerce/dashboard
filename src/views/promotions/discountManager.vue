<template>
  <div>
    <en-table-layout
      toolbar
      pagination
      :tableData="tableData"
      :loading="loading">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button type="primary" @click="handleAddCoupon">新增</el-button>
        </div>
        <div class="toolbar-search">
          <en-table-search
            @search="searchEvent"
            @advancedSearch="advancedSearchEvent"
            advancedWidth="465"
            advanced
            placeholder="请输入关键字">
            <template slot="advanced-content">
              <el-form ref="advancedForm" :model="advancedForm" label-width="80px">
                <el-form-item label="有效期">
                  <el-date-picker
                    v-model="advancedForm.coupon_time_limit"
                    type="daterange"
                    align="center"
                    range-separator="-"
                    value-format="timestamp"
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
        <el-table-column prop="title" label="优惠券名称" />
        <el-table-column prop="coupon_price" label="优惠券面额（元）" width="120" />
        <el-table-column prop="coupon_threshold_price" label="使用限制(元)" width="120" />
        <el-table-column label="使用期限" width="240">
          <template slot-scope="scope">
            {{ scope.row.start_time | unixToDate('yyyy-MM-dd') }}~
            {{ scope.row.end_time | unixToDate('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column prop="create_num" label="发行量（个）" width="120" />
        <el-table-column prop="used_num" label="已使用量（个）" width="120"/>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="success"
              @click="handleEditCoupons(scope.row)">修改
            </el-button>
            <el-button
              type="danger"
              @click="handleDeleteGoods(scope.row)">删除
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
    <!--优惠券组件-->
    <Coupon
      :couponModelShow="couponModelShow"
      :currentcouponId="currentcouponId"
      @saveCoupon="saveCoupon"
    ></Coupon>
  </div>
</template>

<script>
  import * as API_coupon from '@/api/coupon'
  import { CategoryPicker } from '@/components'
  import { Coupon } from './components'
  export default {
    name: 'discountManager',
    components: {
      [CategoryPicker.name]: CategoryPicker,
      [Coupon.name]: Coupon
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
          coupon_time_limit: []
        },

        /** 优惠券弹框显示*/
        couponModelShow: false,

        /** 当前优惠券ID*/
        currentcouponId: '',

        /** 优惠券表单*/
        couponModelForm: {
          /** 优惠券名称*/
          title: '',

          /** 优惠券面额（元）*/
          coupon_price: 2,

          /** 使用限制（元）*/
          coupon_threshold_price: 2,

          /** 使用时限 */
          coupon_time_limit: '2017-02-25',

          /** 发行量（个） */
          create_num: 2,

          /** 已使用量（个） */
          used_num: 2
        }
      }
    },
    mounted() {
      this.GET_CouponsList()
    },
    methods: {

      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_CouponsList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_CouponsList()
      },

      /** 搜索事件触发 */
      searchEvent(data) {
        this.params = {
          ...this.params,
          keyword: data
        }
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        delete this.params.start_time
        delete this.params.end_time
        this.GET_CouponsList()
      },

      /** 高级搜索事件触发 */
      advancedSearchEvent() {
        this.params = this.MixinClone(this.params)
        const { coupon_time_limit } = this.advancedForm
        if (coupon_time_limit && coupon_time_limit[0]) {
          this.params.start_time = coupon_time_limit[0] / 1000
          this.params.end_time = coupon_time_limit[1] / 1000
        } else {
          delete this.params.start_time
          delete this.params.end_time
        }
        delete this.params.keyword
        this.GET_CouponsList()
      },

      GET_CouponsList() {
        this.loading = true
        API_coupon.getCouponsList(this.params).then(response => {
          this.loading = false
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
          this.tableData = response.data
          /** 已经使用量 */
          this.tableData.forEach(key => {
            key.used_num = key.used_num || 0
          })
        })
      },

      /** 删除优惠券 */
      handleDeleteGoods(row) {
        this.$confirm('确认删除此优惠券, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API_coupon.deleteCoupons(row.coupon_id, row).then(() => {
            this.GET_CouponsList()
            this.$message.success('删除优惠券成功！')
          })
        }).catch(() => {
          this.$message.info({ message: '已取消删除' })
        })
      },

      /** 修改*/
      handleEditCoupons(row) {
        this.couponModelShow = true
        this.currentcouponId = row.coupon_id
      },

      /** 新增优惠券*/
      handleAddCoupon() {
        this.couponModelShow = true
        this.currentcouponId = ''
      },

      /** 优惠券监听 */
      saveCoupon(target) {
        this.couponModelShow = false
        this.currentcouponId = ''
        target && this.GET_CouponsList()
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
  }

  .toolbar-btns {

  }

  .toolbar-search {
    margin-right: 10px;
  }

  .goods-image {
    width: 50px;
    height: 50px;
  }

</style>
