<template>
  <en-table-layout
    toolbar
    pagination
    :tableData="tableData"
    :loading="loading"
    :selectionChange="selectionChange"
  >
    <div slot="toolbar" class="inner-toolbar">
      <div class="toolbar-btns">
        <el-button
          type="danger"
          :disabled="selectionids.length === 0"
          @click="handleDeleteRecycles()">Batch delete
        </el-button>
        <el-button
          type="primary"
          :disabled="selectionids.length === 0"
          @click="handlReductionRecycles()">Mass reduction
        </el-button>
      </div>
      <div class="toolbar-search">
        <en-table-search @search="searchEvent" placeholder="Please enter the name of the item" />
      </div>
    </div>

    <template slot="table-columns">
      <el-table-column type="selection"/>
      <el-table-column label="Image" width="120">
        <template slot-scope="scope">
          <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank">
            <img :src="scope.row.thumbnail" class="goods-image"/>
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="goods_name" label="Name">
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
      <el-table-column label="Available" width="120">
        <template slot-scope="scope">{{ scope.row.enable_quantity }}a</template>
      </el-table-column>
      <el-table-column label="Last update" width="120">
        <template slot-scope="scope">{{ scope.row.create_time | unixToDate('yyyy-MM-dd hh:mm') }}</template>
      </el-table-column>
      <el-table-column label="Operation" width="180">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="handlReductionRecycle(scope.row)">reduction
          </el-button>
          <el-button
            type="danger"
            @click="handleDeleteRecycle(scope.$index, scope.row)">delete
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
</template>

<script>
  import * as API_goods from '@/api/goods'
  import { CategoryPicker } from '@/components'

  export default {
    name: 'recycleStation',
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
          page_size: 10,
          /** Represents the Recycling Depot Goods*/
          disabled: 0
        },

        /** The list of data*/
        tableData: [],

        /** List paging data*/
        pageData: [],

        /** Selected recycle bin merchandise*/
        selectionids: []
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.GET_RecycleGoodsList()
        next()
      })
    },
    methods: {

      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_RecycleGoodsList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_RecycleGoodsList()
      },

      /** Complete deletion of a single commodity operation confirmation*/
      handleDeleteRecycle(index, row) {
        this.$confirm('Confirm whether the product has been deleted thoroughly. The deletion may affect the relevant activity information that the product participates in？', 'prompt', { type: 'warning' })
          .then(() => this.DELETE_Recycles(row.goods_id))
          .catch(() => { })
      },

      /** Batch delete*/
      handleDeleteRecycles() {
        this.$confirm('Is it confirmed to delete these goods thoroughly? The deletion may affect the relevant activity information that the goods participate in？', 'prompt', { type: 'warning' })
          .then(() => this.selectionids.length !== 0 && this.DELETE_Recycles(this.selectionids))
          .catch(() => { })
      },

      /**  Recycling station for individual commodity reduction*/
      handlReductionRecycle(row) {
        this.$confirm('Confirm the restore？', 'prompt', { type: 'warning' })
          .then(() => this.ReductionGoods(row.goods_id))
          .catch(() => {})
      },

      /** Mass reduction*/
      handlReductionRecycles() {
        this.$confirm('Are you sure to completely restore these goods？', 'prompt', { type: 'warning' })
          .then(() => this.selectionids.length !== 0 && this.ReductionGoods(this.selectionids))
          .catch(() => { })
      },

      /** Search Event Trigger*/
      searchEvent(data) {
        this.params = {
          ...this.params,
          keyword: data
        }
        this.GET_RecycleGoodsList()
      },

      GET_RecycleGoodsList() {
        this.loading = true
        API_goods.getRecycleGoodsList(this.params).then(response => {
          this.loading = false
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
          this.tableData = response.data
        })
      },

      /** goods_id*/
      selectionChange(val) {
        this.selectionids = val.map(item => item.goods_id).toString()
      },

      /** Recycle goods from the recycle bin*/
      ReductionGoods(ids) {
        API_goods.RecycleReductionGoods(ids, {}).then(() => {
          this.$message.success('Reduction of success')
          this.GET_RecycleGoodsList()
        })
      },

      /** Delete Recycle Bin items*/
      DELETE_Recycles(ids) {
        const _ids = ids.toString()
        API_goods.RecycleDeleteGoods(_ids, {}).then(() => {
          this.GET_RecycleGoodsList()
          this.$message.success('Goods deleted successfully！')
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
    justify-content: space-between;
    .toolbar-search {
      margin-right: 10px;
    }
  }

  .goods-image {
    width: 50px;
    height: 50px;
  }

</style>
