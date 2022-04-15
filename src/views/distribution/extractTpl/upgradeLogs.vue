<template>
  <div>
    <en-table-layout
      :tableData="tableData"
      pagination
      :loading="loading">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns"></div>
        <div class="toolbar-search">
          <en-table-search @search="searchEvent" placeholder="Please enter the members name"/>
        </div>
      </div>
      <template slot="table-columns">
        <!--Update time-->
        <el-table-column prop="create_time" :formatter="MixinUnixToDate" label="Update time"/>
        <!--The name-->
        <el-table-column prop="member_name" label="The name"/>
        <!--way-->
        <el-table-column prop="type" label="way"/>
        <!--Original commission template-->
        <el-table-column prop="old_tpl_name" label="Original commission template"/>
        <!--Upgraded template-->
        <el-table-column prop="new_tpl_name" label="Upgraded template"/>
      </template>
      <el-pagination
        v-if="tableData"
        slot="pagination"
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
  import * as API_distribution from '@/api/distribution'

  export default {
    name: 'upgradeLogs',
    data() {
      return {
        // List loading status
        loading: false,
        // A list of parameters
        params: {
          page_no: 1,
          page_size: 10
        },
        // The list of data
        tableData: [],

        pageData: []
      }
    },
    mounted() {
      this.GET_UpGradeLogList()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_UpGradeLogList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_UpGradeLogList()
      },

      /** Search Event Trigger*/
      searchEvent(data) {
        this.params = {
          ...this.params,
          member_name: data
        }
        this.GET_UpGradeLogList()
      },

      /** Gets the list of upgrade logs*/
      GET_UpGradeLogList() {
        this.loading = true
        API_distribution.getUpgradeLogs(this.params).then(response => {
          this.loading = false
          this.tableData = response.data
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
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
    padding: 0 20px;
  }
</style>

