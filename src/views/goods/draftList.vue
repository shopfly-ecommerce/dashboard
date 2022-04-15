<template>
  <en-table-layout
    toolbar
    pagination
    :tableData="tableData"
    :loading="loading">
    <div slot="toolbar" class="inner-toolbar">
      <div class="toolbar-search">
        <en-table-search @search="searchEvent" placeholder="Please enter the name of the item" />
      </div>
    </div>
    <template slot="table-columns">
      <el-table-column label="Image" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.thumbnail" class="goods-image"/>
        </template>
      </el-table-column>
      <el-table-column prop="goods_name" label="Name"/>
      <el-table-column label="Price" width="120">
        <template slot-scope="scope">{{ scope.row.price | unitPrice('￥') }}</template>
      </el-table-column>
      <el-table-column label="Inventory" width="120">
        <template slot-scope="scope">{{ scope.row.quantity }}a</template>
      </el-table-column>
      <el-table-column label="Last update" width="120">
        <template slot-scope="scope">{{ scope.row.create_time | unixToDate('yyyy-MM-dd hh:mm') }}</template>
      </el-table-column>
      <el-table-column label="Operation" width="180">
        <template slot-scope="scope">
          <el-button
            type="success"
            @click="handleDraftEdit(scope.row)">edit
          </el-button>
          <el-button
            type="danger"
            @click="handleDraftDel(scope.row)">delete
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

      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_DraftGoodsList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_DraftGoodsList()
      },

      /** Search Event Trigger*/
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

      /** Draft box editor*/
      handleDraftEdit(row) {
        const _draft_goods_id = row.draft_goods_id || '0'
        this.$router.push({ name: 'goodPublish', params: { goodsid: _draft_goods_id, isdraft: 2, callback: this.GET_DraftGoodsList }})
      },

      /** Draft box goods deleted*/
      handleDraftDel(row) {
        this.$confirm('Confirm deletion of this draft box item, Whether or not to continue?', 'prompt', { type: 'warning' }).then(() => {
          API_goods.deleteDraftGoods(row.draft_goods_id, {}).then(() => {
            this.GET_DraftGoodsList()
            this.$message.success('Delete draft box item successfully！')
          })
        }).catch(() => {
          this.$message.info({ message: 'Undeleted' })
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ .el-table td:not(.is-left) {
    text-align: center;
  }

  /** The toolbar*/
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

  /*Commodity images*/
  .goods-image {
    width: 50px;
    height: 50px;
  }

</style>
