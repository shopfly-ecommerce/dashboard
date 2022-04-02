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
          @click="handleDeleteRecycles()">批量删除
        </el-button>
        <el-button
          type="primary"
          :disabled="selectionids.length === 0"
          @click="handlReductionRecycles()">批量还原
        </el-button>
      </div>
      <div class="toolbar-search">
        <en-table-search @search="searchEvent" placeholder="请输入商品名称" />
      </div>
    </div>

    <template slot="table-columns">
      <el-table-column type="selection"/>
      <el-table-column label="图片" width="120">
        <template slot-scope="scope">
          <a :href="`${MixinBuyerDomain}/goods/${scope.row.goods_id}`" target="_blank">
            <img :src="scope.row.thumbnail" class="goods-image"/>
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="goods_name" label="商品名称">
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
      <el-table-column label="可用库存" width="120">
        <template slot-scope="scope">{{ scope.row.enable_quantity }}件</template>
      </el-table-column>
      <el-table-column label="创建时间" width="120">
        <template slot-scope="scope">{{ scope.row.create_time | unixToDate('yyyy-MM-dd hh:mm') }}</template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="handlReductionRecycle(scope.row)">还原
          </el-button>
          <el-button
            type="danger"
            @click="handleDeleteRecycle(scope.$index, scope.row)">删除
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
        /** 列表loading状态 */
        loading: false,

        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10,
          /** 表示回收站商品 */
          disabled: 0
        },

        /** 列表数据 */
        tableData: [],

        /** 列表分页数据 */
        pageData: [],

        /** 已选择的回收站商品 */
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

      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_RecycleGoodsList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_RecycleGoodsList()
      },

      /** 单个商品彻底删除操作确认 */
      handleDeleteRecycle(index, row) {
        this.$confirm('确认彻底删除吗，删除后可能会影响商品参与的相关活动信息？', '提示', { type: 'warning' })
          .then(() => this.DELETE_Recycles(row.goods_id))
          .catch(() => { })
      },

      /** 批量删除 */
      handleDeleteRecycles() {
        this.$confirm('确认彻底删除这些商品吗，删除后可能会影响商品参与的相关活动信息？', '提示', { type: 'warning' })
          .then(() => this.selectionids.length !== 0 && this.DELETE_Recycles(this.selectionids))
          .catch(() => { })
      },

      /**  回收站单个商品还原 */
      handlReductionRecycle(row) {
        this.$confirm('确认还原吗？', '提示', { type: 'warning' })
          .then(() => this.ReductionGoods(row.goods_id))
          .catch(() => {})
      },

      /** 批量还原 */
      handlReductionRecycles() {
        this.$confirm('确认彻底还原这些商品吗？', '提示', { type: 'warning' })
          .then(() => this.selectionids.length !== 0 && this.ReductionGoods(this.selectionids))
          .catch(() => { })
      },

      /** 搜索事件触发 */
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

      /** 还原回收站商品*/
      ReductionGoods(ids) {
        API_goods.RecycleReductionGoods(ids, {}).then(() => {
          this.$message.success('还原成功')
          this.GET_RecycleGoodsList()
        })
      },

      /** 删除回收站商品 */
      DELETE_Recycles(ids) {
        const _ids = ids.toString()
        API_goods.RecycleDeleteGoods(_ids, {}).then(() => {
          this.GET_RecycleGoodsList()
          this.$message.success('删除商品成功！')
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
