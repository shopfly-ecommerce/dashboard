<template>
  <div>
    <en-table-layout
      :tableData="tableData"
      pagination
      :loading="loading">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns"></div>
        <div class="toolbar-search">
          <en-table-search @search="searchEvent" placeholder="请输入会员姓名"/>
        </div>
      </div>
      <template slot="table-columns">
        <!--升级时间-->
        <el-table-column prop="create_time" :formatter="MixinUnixToDate" label="升级时间"/>
        <!--姓名-->
        <el-table-column prop="member_name" label="姓名"/>
        <!--方式-->
        <el-table-column prop="type" label="方式"/>
        <!--原提成模板-->
        <el-table-column prop="old_tpl_name" label="原提成模板"/>
        <!--升级后模板-->
        <el-table-column prop="new_tpl_name" label="升级后模板"/>
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
        // 列表loading状态
        loading: false,
        // 列表参数
        params: {
          page_no: 1,
          page_size: 10
        },
        // 列表数据
        tableData: [],

        pageData: []
      }
    },
    mounted() {
      this.GET_UpGradeLogList()
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_UpGradeLogList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_UpGradeLogList()
      },

      /** 搜索事件触发 */
      searchEvent(data) {
        this.params = {
          ...this.params,
          member_name: data
        }
        this.GET_UpGradeLogList()
      },

      /** 获取升级日志列表 */
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

