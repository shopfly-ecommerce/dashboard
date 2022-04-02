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
          <en-table-search @search="searchEvent" placeholder="请输入商品名称" />
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column label="图片" width="120">
          <template slot-scope="scope">
            <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank">
              <img :src="scope.row.thumbnail" class="goods-image"/>
            </a>
          </template>
        </el-table-column>
        <el-table-column label="商品名称">
          <template slot-scope="scope">
            <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank" style="color: #00a2d4;">{{ scope.row.goods_name }}</a>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="120">
          <template slot-scope="scope">{{ scope.row.price | unitPrice('￥') }}</template>
        </el-table-column>
        <el-table-column label="库存" width="120">
          <template slot-scope="scope">{{ scope.row.quantity }}件</template>
        </el-table-column>
        <el-table-column label="可用库存" prop="enable_quantity" width="120"  :formatter="marketQuantity"/>
        <el-table-column label="创建时间" width="150">
          <template slot-scope="scope">{{ scope.row.create_time | unixToDate }}</template>
        </el-table-column>
        <el-table-column prop="market_enable" label="状态" :formatter="marketStatus" width="80"/>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="handleWithdraw(scope.row)">查看
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
    <el-dialog title="库存信息" center :visible.sync="goodsWarningStockshow" width="40%" class="popinfo">
      <en-table-layout :tableData="goodsWarningStockDate" :loading="loading">
        <template slot="table-columns">
          <el-table-column prop="sn" label="货号"/>
          <el-table-column prop="goods_name" label="商品名称"/>
          <el-table-column prop="quantity" label="库存"/>
          <el-table-column prop="enable_quantity" label="可用库存"/>
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
        /** 列表loading状态 */
        loading: false,

        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10
        },

        /** 列表数据 */
        tableData: [],

        /** 列表分页数据 */
        pageData: [],

        /** 预警商品库存信息显示*/
        goodsWarningStockshow: false,

        /** 预警商品库存信息*/
        goodsWarningStockDate: null
      }
    },
    mounted() {
      this.GET_WarningGoodsList()
    },
    methods: {

      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_WarningGoodsList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_WarningGoodsList()
      },

      /** 销售状态格式化 */
      marketStatus(row, column, cellValue) {
        return row.market_enable === 1 ? '上架' : '下架'
      },

      marketQuantity(row, column, cellValue) {
        return `${row.enable_quantity}件`
      },

      /** 搜索事件触发 */
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

      /** 查看库存信息 */
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
