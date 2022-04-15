<template>
  <en-table-layout
    :tableData="tableData.data"
    :loading="loading"
  >
    <div slot="toolbar" class="inner-toolbar">
      <div class="toolbar-btns">
        <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddRole">add</el-button>
      </div>
    </div>

    <template slot="table-columns">
      <el-table-column prop="role_name" label="Character name"/>
      <el-table-column prop="role_describe" label="Role description"/>
      <el-table-column label="Operation">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEditRole(scope.row)">edit</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDeleteRole(scope.row)">delete</el-button>
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
        // List loading status
        loading: false,
        // A list of parameters
        params: {
          page_no: 1,
          page_size: 10
        },
        // The list of data
        tableData: ''
      }
    },
    mounted() {
      this.GET_RoleList()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_RoleList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_RoleList()
      },

      /** Adding roles*/
      handleAddRole() {
        this.$router.push({ name: 'rolePermission', params: { id: 0, callback: this.GET_RoleList }})
      },

      /** Editing the role*/
      handleEditRole(row) {
        this.$router.push({ name: 'rolePermission', params: { id: row.role_id, callback: this.GET_RoleList }})
      },

      /** Delete the role*/
      handleDeleteRole(row) {
        this.$confirm('Are you sure you want to delete this character？', 'prompt', { type: 'warning' }).then(() => {
          API_Auth.deleteRole(row.role_id).then(() => {
            this.$message.success('Delete the success！')
            this.GET_RoleList()
          })
        }).catch(() => {})
      },

      /** Get a list of roles*/
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
