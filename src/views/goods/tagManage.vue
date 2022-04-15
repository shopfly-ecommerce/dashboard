<template>
  <en-table-layout
    pagination
    :tableData="tableData"
    :stripe="false"
    :loading="loading">
    <template slot="table-columns">
      <el-table-column prop="tag_name" label="Tag name"/>
      <el-table-column label="Operation">
        <template slot-scope="scope">
          <el-button type="primary" @click="addtag(scope.row)">Label product Settings</el-button>
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
  import * as API_goodsTag from '@/api/goodsTag'
  export default {
    name: 'tagManage',
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
        pageData: []
      }
    },
    mounted() {
      this.GET_TagsList()
    },
    methods: {

      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_TagsList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_TagsList()
      },

      /** The tag list*/
      GET_TagsList() {
        this.loading = true
        API_goodsTag.getTagsList(this.params).then(response => {
          this.loading = false
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
          this.tableData = response.data
        })
      },

      /** Label product Settings*/
      addtag(row) {
        this.$router.push({ path: `/goods/tag-add/${row.tag_id}`, query: { tag_name: row.tag_name }})
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ div.toolbar {
    display: none;
  }
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

  .goods-image {
    width: 50px;
    height: 50px;
  }

</style>
