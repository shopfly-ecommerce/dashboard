<template>
  <en-table-layout
    :toolbar="false"
    :tableData="tableData.data"
    :loading="loading"
  >
    <template slot="table-columns">
      <el-table-column prop="uname" label="用户名"/>
      <el-table-column prop="mobile" label="手机号"/>
      <el-table-column prop="email" label="电子邮箱"/>
      <el-table-column label="注册时间">
        <template slot-scope="scope">{{ scope.row.create_time | unixToDate }}</template>
      </el-table-column>
      <el-table-column label="上次登录时间">
        <template slot-scope="scope">{{ scope.row.last_login | unixToDate }}</template>
      </el-table-column>
      <el-table-column prop="login_count" label="登录次数"/>
      <el-table-column prop="sex" label="性别" :formatter="formatterSex"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleRecoverMember(scope.$index, scope.row)">恢复</el-button>
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
        /** 列表loading状态 */
        loading: false,

        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10,
          disabled: -1
        },

        /** 列表数据 */
        tableData: ''
      }
    },
    mounted() {
      this.GET_RecycleMemberList()
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_RecycleMemberList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_RecycleMemberList()
      },

      /** 恢复会员操作 */
      handleRecoverMember(index, row) {
        this.$confirm('确定要恢复这个会员吗？', '提示', { type: 'warning' }).then(() => {
          API_Member.recycleMember(row.member_id).then(() => {
            this.$message.success('会员恢复成功！')
            this.GET_RecycleMemberList()
          })
        }).catch(() => {})
      },

      /** 性别格式化 */
      formatterSex(row, column, cellValue) {
        return row.sex === 1 ? '男' : '女'
      },

      /** 获取回收站会员列表 */
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
