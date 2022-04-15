<template>
  <div>
    <en-table-layout
      toolbar
      pagination
      :tableData="tableData"
      :loading="loading">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button type="primary" @click="handleAddCoupon">new</el-button>
        </div>
        <div class="toolbar-search">
          <en-table-search
            @search="searchEvent"
            @advancedSearch="advancedSearchEvent"
            advancedWidth="465"
            advanced
            placeholder="Please enter the keywords">
            <template slot="advanced-content">
              <el-form ref="advancedForm" :model="advancedForm" label-width="80px">
                <el-form-item label="The period of validity">
                  <el-date-picker
                    v-model="advancedForm.coupon_time_limit"
                    type="daterange"
                    align="center"
                    range-separator="-"
                    value-format="timestamp"
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
        <el-table-column prop="title" label="Coupon name" />
        <el-table-column prop="coupon_price" label="Coupon face value（USD）" width="120" />
        <el-table-column prop="coupon_threshold_price" label="Use restrictions(USD)" width="120" />
        <el-table-column label="Use period" width="240">
          <template slot-scope="scope">
            {{ scope.row.start_time | unixToDate('yyyy-MM-dd') }}~
            {{ scope.row.end_time | unixToDate('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column prop="create_num" label="circulation（a）" width="120" />
        <el-table-column prop="used_num" label="Already use（a）" width="120"/>
        <el-table-column label="Operation" width="180">
          <template slot-scope="scope">
            <el-button
              type="success"
              @click="handleEditCoupons(scope.row)">edit
            </el-button>
            <el-button
              type="danger"
              @click="handleDeleteGoods(scope.row)">delete
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
    <!--Coupon component-->
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
          coupon_time_limit: []
        },

        /** The coupon pops up*/
        couponModelShow: false,

        /** Current couponID*/
        currentcouponId: '',

        /** Coupon form*/
        couponModelForm: {
          /** Coupon name*/
          title: '',

          /** Coupon face value（USD）*/
          coupon_price: 2,

          /** Use restrictions（USD）*/
          coupon_threshold_price: 2,

          /** Use time limit*/
          coupon_time_limit: '2017-02-25',

          /** circulation（a） */
          create_num: 2,

          /** Already use（a） */
          used_num: 2
        }
      }
    },
    mounted() {
      this.GET_CouponsList()
    },
    methods: {

      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_CouponsList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_CouponsList()
      },

      /** Search Event Trigger*/
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

      /** Advanced search event triggered*/
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
          /** Used already*/
          this.tableData.forEach(key => {
            key.used_num = key.used_num || 0
          })
        })
      },

      /** Delete coupons*/
      handleDeleteGoods(row) {
        this.$confirm('Confirm to delete this coupon, Whether or not to continue?', 'prompt', {
          confirmButtonText: 'save',
          cancelButtonText: 'cancel',
          type: 'warning'
        }).then(() => {
          API_coupon.deleteCoupons(row.coupon_id, row).then(() => {
            this.GET_CouponsList()
            this.$message.success('Coupon deletion successful！')
          })
        }).catch(() => {
          this.$message.info({ message: 'Undeleted' })
        })
      },

      /** edit*/
      handleEditCoupons(row) {
        this.couponModelShow = true
        this.currentcouponId = row.coupon_id
      },

      /** New coupons*/
      handleAddCoupon() {
        this.couponModelShow = true
        this.currentcouponId = ''
      },

      /** Coupon monitoring*/
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
