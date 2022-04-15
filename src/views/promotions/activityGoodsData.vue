<template>
  <div>
    <en-table-layout
      pagination
      :tableData="tableData"
      :loading="loading">
      <template slot="table-columns">
        <el-table-column label="Name">
          <template slot-scope="scope">
            <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank" style="color: #00a2d4;">{{ scope.row.goods_name }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="original_price" :formatter="MixinFormatPrice" label="Product  price"/>
        <el-table-column prop="price" :formatter="MixinFormatPrice" label="Activity price"/>
        <el-table-column prop="sold_quantity" label="The number sold out" width="100"/>
        <el-table-column label="For moment" width="100">
          <template slot-scope="scope">{{ scope.row.time_line < 10 ? '0' + scope.row.time_line : scope.row.time_line }} : 00</template>
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
  </div>
</template>

<script>
  import * as API_LimitTime from '@/api/limitTime'
  import { CategoryPicker } from '@/components'

  export default {
    name: 'activityGoodsData',
    components: {
      [CategoryPicker.name]: CategoryPicker
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
        tableData: [],

        /** List paging data*/
        pageData: [],

        /** Flash salesID */
        activityID: ''
      }
    },
    filters: {
      timeLine(val) {
        return parseInt(val) < 10 ? '0' + val + ':00:00' : val + ':00:00'
      }
    },
    watch: {
      activityID: 'GET_ActivityGoodsList'
    },
    beforeRouteUpdate(to, from, next) {
      this.activityID = to.params.id
      next()
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.activityID = to.params.id
      })
    },
    activated() {
      this.activityID = this.$route.params.id
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_ActivityGoodsList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_ActivityGoodsList()
      },

      /** Get active merchandise information*/
      GET_ActivityGoodsList() {
        this.loading = true
        const _params = {
          ...this.params,
          seckill_id: this.activityID
        }
        API_LimitTime.getLimitTimeGoodsList(_params).then(response => {
          this.loading = false
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
          this.tableData = response.data
        })
      },

      /** To check the reason*/
      lookReason(row) {
        this.$alert(row.fail_reason, 'Dismiss the reason')
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ .el-table td:not(.is-left) {
    text-align: center;
  }

  /*tile*/
  div.base-info-item {
    h4 {
      margin-bottom: 10px;
      padding:0 10px;
      border: 1px solid #ddd;
      background-color: #f8f8f8;
      font-weight: bold;
      color: #333;
      font-size: 14px;
      line-height: 40px;
      text-align: left;
    }
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

    /*Integral prompt*/
    p.exchange-tip {
      margin:0;
      padding: 10px;
      padding-left: 15%;
      text-align: left;
      color: #8a6d3b;
      background: #fcf8e3;
      border: 1px solid #faebcc;
    }
  }
</style>
