<template>
  <en-table-layout
    :tableData="tableData.data"
    :loading="loading"
  >
    <div slot="toolbar" class="inner-toolbar">
      <div class="toolbar-btns">
        <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddRole">添加</el-button>
      </div>
    </div>

    <template slot="table-columns">
      <el-table-column prop="role_name" label="角色名称"/>
      <el-table-column prop="role_describe" label="角色描述"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEditRole(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDeleteRole(scope.row)">删除</el-button>
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
  import * as API_Auth from '@/api/auth'

  export default {
    name: 'roleManage',
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
        tableData: ''
      }
    },
    mounted() {
      this.GET_RoleList()
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_RoleList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_RoleList()
      },

      /** 添加角色 */
      handleAddRole() {
        this.$router.push({ name: 'rolePermission', params: { id: 0, callback: this.GET_RoleList }})
      },

      /** 编辑角色 */
      handleEditRole(row) {
        this.$router.push({ name: 'rolePermission', params: { id: row.role_id, callback: this.GET_RoleList }})
      },

      /** 删除角色 */
      handleDeleteRole(row) {
        this.$confirm('确定要删除这个角色吗？', '提示', { type: 'warning' }).then(() => {
          API_Auth.deleteRole(row.role_id).then(() => {
            this.$message.success('删除成功！')
            this.GET_RoleList()
          })
        }).catch(() => {})
      },

      /** 获取角色列表 */
      GET_RoleList() {
        this.loading = true
        API_Auth.getRoleList(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>
