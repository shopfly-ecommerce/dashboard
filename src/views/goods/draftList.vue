<template>
  <en-table-layout
    toolbar
    pagination
    :tableData="tableData"
    :loading="loading">
    <div slot="toolbar" class="inner-toolbar">
      <div class="toolbar-search">
        <en-table-search @search="searchEvent" placeholder="请输入商品名称" />
      </div>
    </div>
    <template slot="table-columns">
      <el-table-column label="图片" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.thumbnail" class="goods-image"/>
        </template>
      </el-table-column>
      <el-table-column prop="goods_name" label="商品名称"/>
      <el-table-column label="价格" width="120">
        <template slot-scope="scope">{{ scope.row.price | unitPrice('￥') }}</template>
      </el-table-column>
      <el-table-column label="库存" width="120">
        <template slot-scope="scope">{{ scope.row.quantity }}件</template>
      </el-table-column>
      <el-table-column label="创建时间" width="120">
        <template slot-scope="scope">{{ scope.row.create_time | unixToDate('yyyy-MM-dd hh:mm') }}</template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="success"
            @click="handleDraftEdit(scope.row)">编辑
          </el-button>
          <el-button
            type="danger"
            @click="handleDraftDel(scope.row)">删除
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
    name: 'draftList',
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
        tableData: null,

        /** 列表分页数据 */
        pageData: null
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.GET_DraftGoodsList()
        next()
      })
    },
    methods: {

      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_DraftGoodsList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_DraftGoodsList()
      },

      /** 搜索事件触发 */
      searchEvent(data) {
        this.params = {
          ...this.params,
          keyword: data
        }
        delete this.params.category_path
        this.GET_DraftGoodsList()
      },
      GET_DraftGoodsList() {
        this.loading = true
        API_goods.getDraftGoodsList(this.params).then(response => {
          this.loading = false
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
          this.tableData = response.data
          this.tableData.forEach(key => {
            if (!key.thumbnail && key.gallery_list) {
              key.thumbnail = key.gallery_list[0]
            }
          })
        })
      },

      /** 草稿箱编辑 */
      handleDraftEdit(row) {
        const _draft_goods_id = row.draft_goods_id || '0'
        this.$router.push({ name: 'goodPublish', params: { goodsid: _draft_goods_id, isdraft: 2, callback: this.GET_DraftGoodsList }})
      },

      /** 草稿箱商品删除 */
      handleDraftDel(row) {
        this.$confirm('确认删除此草稿箱商品, 是否继续?', '提示', { type: 'warning' }).then(() => {
          API_goods.deleteDraftGoods(row.draft_goods_id, {}).then(() => {
            this.GET_DraftGoodsList()
            this.$message.success('删除草稿箱商品成功！')
          })
        }).catch(() => {
          this.$message.info({ message: '已取消删除' })
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ .el-table td:not(.is-left) {
    text-align: center;
  }

  /** 工具条 */
  /deep/ div.toolbar {
    height: 70px;
    padding: 20px 0;
  }
  .inner-toolbar {
    display: flex;
    width: 100%;
    justify-content: space-between;
    .toolbar-search {
      margin-right: 10px;
      display: inline-block
    }
  }

  /*商品图片*/
  .goods-image {
    width: 50px;
    height: 50px;
  }

</style>
