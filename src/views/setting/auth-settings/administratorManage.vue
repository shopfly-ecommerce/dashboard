<template>
  <div>
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddAdmin">add</el-button>
        </div>
      </div>

      <template slot="table-columns">
        <el-table-column prop="face" label="Administrator avatar">
          <template slot-scope="scope"><img :src="scope.row.face" class="face-image"></template>
        </el-table-column>
        <el-table-column prop="username" label="Administrator name"/>
        <el-table-column prop="role_name" label="Subordinate role"/>
        <el-table-column prop="department" label="Subordinate departments"/>
        <el-table-column prop="real_name" label="Real name of administrator"/>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditAdmin(scope.$index, scope.row)">edit</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteAdmin(scope.$index, scope.row)">delete</el-button>
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
    <el-dialog
      :title="adminForm.id ? 'Edit manager' : 'Add administrator'"
      :visible.sync="dialogVisible"
      width="500px"
      @open="handleDialogOpen"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="adminForm" :rules="adminRules" ref="adminForm" label-width="120px">
        <el-form-item label="Administrator name" prop="username">
          <span v-if="adminForm.id">{{ adminForm.username }}</span>
          <el-input v-else v-model="adminForm.username" :maxlength="20" clearable placeholder="Please enter the administrator name"></el-input>
        </el-form-item>
        <el-form-item label="Administrator password" prop="password">
          <el-input type="password" v-model="adminForm.password" :maxlength="20" clearable :placeholder="adminForm.id ? 'Leave blank if not modified' : '6-20A digital、English letters, or special characters'"></el-input>
        </el-form-item>
        <el-form-item label="Subordinate role" prop="role_id">
          <el-select
            v-model="adminForm.role_id"
            :disabled="adminForm.founder === 1"
            :placeholder="adminForm.founder === 1 ? 'Super administrators do not have to select roles' : 'Please select roles'"
            clearable
          >
            <el-option
              v-for="item in rolesOptions"
              :key="item.role_id"
              :label="item.role_name"
              :value="item.role_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Subordinate departments" prop="department">
          <el-input v-model="adminForm.department" :maxlength="20" clearable placeholder="Please enter your department"></el-input>
        </el-form-item>
        <el-form-item label="Real name of administrator" prop="real_name">
          <el-input v-model="adminForm.real_name" :maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="Note information" prop="remark">
          <el-input v-model="adminForm.remark" :maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="Administrator avatar" prop="face">
          <el-upload
            :action="MixinUploadApi"
            :on-success="uploadSuccess"
            :on-remove="() => { adminForm.face = '' }"
            :file-list="adminForm.face ? [{name: 'face', url: adminForm.face}] : []"
            list-type="picture">
            <el-button size="small" type="primary">upload</el-button>
            <div slot="tip" class="el-upload__tip">Recommended to uploadjpg/pngFile, and not exceeding1MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="Super administrator">
          <el-radio v-model="adminForm.founder" :label="1">is</el-radio>
          <el-radio v-model="adminForm.founder" :label="0">no</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitAdminForm">save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_Auth from '@/api/auth'
  import md5 from 'js-md5'
  import { RegExp } from '~/ui-utils'

  export default {
    name: 'administratorManage',
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
        tableData: '',
        // Administrator form
        adminForm: {},
        // Administrator form rules
        adminRules: {
          username: [this.MixinRequired('Please enter the administrator name！')],
          password: [
            { required: true, message: 'Please enter the administrator password！', trigger: 'bulr' },
            {
              validator: (rule, value, callback) => {
                if (value && !RegExp.password.test(value)) {
                  callback(new Error('Password format error！'))
                } else {
                  callback()
                }
              }
            }
          ],
          department: [this.MixinRequired('Please enter your department！')],
          role_id: [{ required: true, message: 'Please select the role！', trigger: 'change' }],
          face: [this.MixinRequired('Please upload the administrators avatar！')]
        },
        // Administrator form Dialog
        dialogVisible: false,
        // The role list
        rolesOptions: []
      }
    },
    watch: {
      'adminForm.id': function(newValue) {
        this.adminRules.username[0].required = !newValue
        this.adminRules.password[0].required = !newValue
      },
      'adminForm.founder': function(newValue) {
        this.adminRules.role_id[0].required = newValue === 0
        if (newValue === 1) this.adminForm.role_id = 'Super administrator'
      }
    },
    mounted() {
      this.GET_AdministratorList()
      // Acquire role
      API_Auth.getRoleList({ page_size: 10000 }).then(response => {
        this.rolesOptions = response.data
      })
    },
    methods: {
      uploadSuccess(res) {
        this.$set(this.adminForm, 'face', res.url)
        this.$refs['adminForm'].validateField('face')
      },
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_AdministratorList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_AdministratorList()
      },

      /** Add administrator*/
      handleAddAdmin() {
        this.adminForm = {
          founder: 0
        }
        this.dialogVisible = true
      },

      /** Edit manager*/
      handleEditAdmin(index, row) {
        this.adminForm = this.MixinClone(row)
        parseInt(this.adminForm.role_id) === 0 ? this.adminForm.role_id = 'Super administrator' : null
        this.fileList = this.adminForm.face ? [{ name: 'face', url: this.adminForm.face }] : []
        this.dialogVisible = true
      },

      /** Delete administrator*/
      handleDeleteAdmin(index, row) {
        this.$confirm('Are you sure you want to delete this administrator？', 'prompt', { type: 'warning' }).then(() => {
          API_Auth.deleteAdministrator(row.id).then(() => {
            this.$message.success('Delete the success！')
            this.GET_AdministratorList()
          })
        }).catch(() => {})
      },
      /** dialogReset after openingformForm validation results*/
      handleDialogOpen() {
        setTimeout(() => { this.$refs['adminForm'].clearValidate() })
      },

      /** Submit the admin form*/
      submitAdminForm() {
        this.$refs['adminForm'].validate((valid) => {
          if (valid) {
            const { id } = this.adminForm
            const params = this.MixinClone(this.adminForm)
            if (params.password) params.password = md5(params.password)
            if (!params.real_name) delete params.real_name
            params.role_id === 'Super administrator' ? params.role_id = 0 : null
            if (id) {
              API_Auth.editAdministrator(id, params).then(response => {
                this.dialogVisible = false
                this.$message.success('Modify the success！')
                this.GET_AdministratorList()
              })
            } else {
              API_Auth.addAdministrator(params).then(() => {
                this.dialogVisible = false
                this.$message.success('Add a success！')
                this.GET_AdministratorList()
              })
            }
          } else {
            this.$message.error('There is an error in the form. Please check it！')
            return false
          }
        })
      },

      /** Get the list of administrators*/
      GET_AdministratorList() {
        this.loading = true
        API_Auth.getAdministratorList(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .face-image {
    display: block;
    width: 50px;
    height: 50px;
    margin: 0 auto;
  }
  /deep/ .el-dialog__body {
    padding: 10px 20px;
  }
</style>
