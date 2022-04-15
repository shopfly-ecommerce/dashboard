<template>
  <en-table-layout
    :toolbar="false"
    :tableData="tableData.data"
    :loading="loading"
  >
    <template slot="table-columns">
      <el-table-column prop="uname" label="username"/>
      <el-table-column prop="mobile" label="Mobile phone no."/>
      <el-table-column prop="email" label="email"/>
      <el-table-column label="Registration time">
        <template slot-scope="scope">{{ scope.row.create_time | unixToDate }}</template>
      </el-table-column>
      <el-table-column label="Last login time">
        <template slot-scope="scope">{{ scope.row.last_login | unixToDate }}</template>
      </el-table-column>
      <el-table-column prop="login_count" label="The login number"/>
      <el-table-column prop="sex" label="gender" :formatter="formatterSex"/>
      <el-table-column label="Operation">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleRecoverMember(scope.$index, scope.row)">restore</el-button>
        </template>
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
  import * as API_Member from '@/api/member'

  export default {
    name: 'memberRecycle',
    data() {
      return {
        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10,
          disabled: -1
        },

        /** The list of data*/
        tableData: ''
      }
    },
    mounted() {
      this.GET_RecycleMemberList()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_RecycleMemberList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_RecycleMemberList()
      },

      /** Restore membership operation*/
      handleRecoverMember(index, row) {
        this.$confirm('Are you sure you want to reinstate this member？', 'prompt', { type: 'warning' }).then(() => {
          API_Member.recycleMember(row.member_id).then(() => {
            this.$message.success('Member recovery successful！')
            this.GET_RecycleMemberList()
          })
        }).catch(() => {})
      },

      /** Gender formatting*/
      formatterSex(row, column, cellValue) {
        return row.sex === 1 ? 'male' : 'female'
      },

      /** Get a list of Recycle Bin members*/
      GET_RecycleMemberList() {
        this.loading = true
        API_Member.getRecycleMemberList(this.params).then(response => {
          this.loading = false
          this.tableData = response
          this.tableData.data.forEach(item => {
            if (item.mobile == null) {
              item.mobile = ''
            }
          })
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>
