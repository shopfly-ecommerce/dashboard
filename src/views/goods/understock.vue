<template>
  <div>
    <en-table-layout
      toolbar
      pagination
      :tableData="tableData"
      :loading="loading">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns"></div>
        <div class="toolbar-search">
          <en-table-search @search="searchEvent" placeholder="Please enter the name of the item" />
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column label="Image" width="120">
          <template slot-scope="scope">
            <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank">
              <img :src="scope.row.thumbnail" class="goods-image"/>
            </a>
          </template>
        </el-table-column>
        <el-table-column label="Name">
          <template slot-scope="scope">
            <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank" style="color: #00a2d4;">{{ scope.row.goods_name }}</a>
          </template>
        </el-table-column>
        <el-table-column label="Price" width="120">
          <template slot-scope="scope">{{ scope.row.price | unitPrice('￥') }}</template>
        </el-table-column>
        <el-table-column label="Inventory" width="120">
          <template slot-scope="scope">{{ scope.row.quantity }}a</template>
        </el-table-column>
        <el-table-column label="Available" prop="enable_quantity" width="120"  :formatter="marketQuantity"/>
        <el-table-column label="Last update" width="150">
          <template slot-scope="scope">{{ scope.row.create_time | unixToDate }}</template>
        </el-table-column>
        <el-table-column prop="market_enable" label="Status" :formatter="marketStatus" width="80"/>
        <el-table-column label="Operation" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="handleWithdraw(scope.row)">To view
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
    <el-dialog title="Inventory information" center :visible.sync="goodsWarningStockshow" width="40%" class="popinfo">
      <en-table-layout :tableData="goodsWarningStockDate" :loading="loading">
        <template slot="table-columns">
          <el-table-column prop="sn" label="SN"/>
          <el-table-column prop="goods_name" label="Name"/>
          <el-table-column prop="quantity" label="Inventory"/>
          <el-table-column prop="enable_quantity" label="Available"/>
        </template>
      </en-table-layout>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_goods from '@/api/goods'
  import { CategoryPicker } from '@/components'

  export default {
    name: 'understock',
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

        /** Warning commodity inventory information display*/
        goodsWarningStockshow: false,

        /** Warning commodity inventory information*/
        goodsWarningStockDate: null
      }
    },
    mounted() {
      this.GET_WarningGoodsList()
    },
    methods: {

      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_WarningGoodsList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_WarningGoodsList()
      },

      /** Sales status formatting*/
      marketStatus(row, column, cellValue) {
        return row.market_enable === 1 ? 'save' : 'off'
      },

      marketQuantity(row, column, cellValue) {
        return `${row.enable_quantity}a`
      },

      /** Search Event Trigger*/
      searchEvent(data) {
        this.params = {
          ...this.params,
          keyword: data
        }
        this.GET_WarningGoodsList()
      },

      GET_WarningGoodsList() {
        this.loading = true
        API_goods.getWarningGoodsList(this.params).then(response => {
          this.loading = false
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
          this.tableData = response.data
        })
      },

      /** View inventory information*/
      handleWithdraw(row) {
        this.goodsWarningStockshow = true
        API_goods.getWarningGoodsStockList(row.goods_id).then((response) => {
          this.goodsWarningStockDate = response
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

  /deep/ .el-table td:not(.is-left) {
    text-align: center;
  }

  .inner-toolbar {
    display: flex;
    width: 100%;
  }

  .toolbar-search {
    margin-right: 10px;
  }
  /deep/ .popinfo {
    .toolbar {
      display: none;
    }
    .el-dialog__body {
      border: 1px solid #e5e5e5;
      .el-table {
        border: 1px solid #e5e5e5;
      }
    }
  }

  .goods-image {
    width: 50px;
    height: 50px;
  }

</style>
