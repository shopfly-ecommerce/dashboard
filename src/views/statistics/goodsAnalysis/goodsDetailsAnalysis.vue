<template>
  <div class="bg-shop-summary">
    <en-table-layout
      toolbar
      pagination
      :tableData="tableData"
      :loading="loading">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <div class="conditions">
            <span>商品分类:</span>
            <en-category-picker
              size="mini"
              :api="api"
              :props="props"
              class="choose-machine"
              @changed="changeGoodsCateGory"
              :clearable='true'/>
          </div>
          <div class="conditions">
            <span>商品名称:</span>
            <el-input size="mini" v-model="params.goods_name" clearable />
          </div>
          <el-button @click="handleSearchGoods" type="primary" size="mini">搜索</el-button>
        </div>
        <div class="toolbar-search"></div>
      </div>
      <template slot="table-columns">
        <!--商品名称-->
        <el-table-column label="商品名称">
          <template slot-scope="scope">
            <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank" style="color: #00a2d4;">{{ scope.row.goods_name }}</a>
          </template>
        </el-table-column>
        <!--价格-->
        <el-table-column label="价格">
          <template slot-scope="scope">
            <span>{{ scope.row.price | unitPrice('¥') }}</span>
          </template>
        </el-table-column>
        <!--近30天下单商品数-->
        <el-table-column prop="numbers" sortable label="近30天下单商品数"/>
        <!--近30天下单金额-->
        <el-table-column prop="total_price" sortable label="近30天下单金额">
          <template slot-scope="scope">
            <span>{{ scope.row.total_price | unitPrice('¥') }}</span>
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
  </div>
</template>

<script>
  import * as API_goodsDetailsStatistics from '@/api/goodsDetailsStatistics'
  import { CategoryPicker } from '@/components'
  export default {
    name: 'goodsDetails',
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

          page_size: 10,

          category_id: 0,

          goods_name: ''
        },

        /** 列表数据 */
        tableData: [],

        /** 列表分页数据 */
        pageData: [],

        /** 分类请求api */
        api: 'seller/goods/category/0/children',

        /** 映射属性 */
        props: {
          value: 'category_id',
          label: 'name',
          children: 'children',
          disabled: 'disabled'
        }
      }
    },
    mounted() {
      this.GET_GoodsStatistics()
    },
    methods: {

      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        console.log(33, size)
        this.params.page_size = size
        this.GET_GoodsStatistics()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        console.log(88, page)
        this.params.page_no = page
        this.GET_GoodsStatistics()
      },

      /** 搜索事件触发 */
      handleSearchGoods() {
        this.GET_GoodsStatistics()
      },

      /**  平台商品分类选择组件值发生改变 */
      changeGoodsCateGory(data) {
        if (data[data.length - 1]) {
          this.params.category_id = parseInt(data[data.length - 1])
        } else {
          this.params.category_id = 0
        }
      },

      GET_GoodsStatistics() {
        this.loading = true
        API_goodsDetailsStatistics.getGoodsStatisticsList(this.params).then(response => {
          this.loading = false
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
          this.tableData = response.data
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ .el-table td:not(.is-left) {
    text-align: center;
  }

  .inner-toolbar {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  .toolbar-search {
    margin-right: 10px;
  }

  /deep/ .el-input__inner {
    border-color: rgb(220, 223, 230);
  }

  div.toolbar-btns {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    div {
      span {
        display: inline-block;
        font-size: 14px;
        color: #606266;
      }
    }
    .conditions {
      margin-right: 30px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      span {
        display: block;
        width: 90px;
      }
      .choose-machine {
        width: 100%;
      }
    }
  }
</style>

