<template>
  <en-table-layout
    :toolbar="false"
    :tableData="tableData.data"
    :loading="loading"
  >
    <template slot="table-columns">
      <el-table-column label="商品图片">
        <template slot-scope="scope">
          <a :href="MixinBuyerDomain + '/goods/' + scope.row.goods_id" class="goods-name" target="_blank"><img :src="scope.row.thumbnail" :alt="scope.row.goods_name" class="goods-image"></a>
        </template>
      </el-table-column>
      <el-table-column prop="sn" label="商品编号"/>
      <el-table-column label="商品名称" width="400">
        <template slot-scope="{ row }">
          <a :href="MixinBuyerDomain + '/goods/' + row.goods_id" class="goods-name" target="_blank">{{ row.goods_name }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="price" :formatter="MixinFormatPrice" label="商品价格"/>
      <el-table-column label="商品状态">
        <template slot-scope="scope">{{ scope.row.market_enable | statusFilter }}</template>
      </el-table-column>
    </template>

    <el-pagination
      v-if="tableData"
      slot="pagination"
      @size-change="handlePageSizeChange"
      @current-change="handlePageCurrentChange"
      :current-page="tableData.page_no"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="tableData.page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.data_total">
    </el-pagination>
  </en-table-layout>
</template>

<script>
  import * as API_Goods from '@/api/goods'

  export default {
    name: 'pointsGoods',
    data() {
      return {
        /** 列表loading状态 */
        loading: false,

        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10,
          goods_type: 'POINT'
        },

        /** 列表数据 */
        tableData: ''
      }
    },
    created() {
      this.GET_PointGoodsList()
    },
    filters: {
      statusFilter(val) {
        switch (val) {
          case 0: return '已下架'
          case 1: return '售卖中'
          case 2: return '预览商品'
        }
      }
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_PointGoodsList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_PointGoodsList()
      },

      /** 获取会员列表 */
      GET_PointGoodsList() {
        this.loading = true
        API_Goods.getGoodsList(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .goods-image {
    width: 50px;
    height: 50px;
  }
  .goods-name {
    color: #4183c4;
    &:hover { color: #f42424 }
  }
</style>
