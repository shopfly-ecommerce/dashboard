<template>
  <en-table-layout
    :toolbar="false"
    :tableData="tableData.data"
    :loading="loading"
  >
    <template slot="table-columns">
      <el-table-column label="Commodity images">
        <template slot-scope="scope">
          <a :href="MixinBuyerDomain + '/goods/' + scope.row.goods_id" class="goods-name" target="_blank"><img :src="scope.row.thumbnail" :alt="scope.row.goods_name" class="goods-image"></a>
        </template>
      </el-table-column>
      <el-table-column prop="sn" label="SN"/>
      <el-table-column label="Name" width="400">
        <template slot-scope="{ row }">
          <a :href="MixinBuyerDomain + '/goods/' + row.goods_id" class="goods-name" target="_blank">{{ row.goods_name }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="price" :formatter="MixinFormatPrice" label="Price"/>
      <el-table-column label="Status">
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
        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10,
          goods_type: 'POINT'
        },

        /** The list of data*/
        tableData: ''
      }
    },
    created() {
      this.GET_PointGoodsList()
    },
    filters: {
      statusFilter(val) {
        switch (val) {
          case 0: return 'unsold'
          case 1: return 'In the sale'
          case 2: return 'Preview the goods'
        }
      }
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_PointGoodsList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_PointGoodsList()
      },

      /** Get membership list*/
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
