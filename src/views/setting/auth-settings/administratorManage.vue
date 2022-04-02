<template>
  <div>
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddAdmin">添加</el-button>
        </div>
      </div>

      <template slot="table-columns">
        <el-table-column prop="face" label="管理员头像">
          <template slot-scope="scope"><img :src="scope.row.face" class="face-image"></template>
        </el-table-column>
        <el-table-column prop="username" label="管理员名称"/>
        <el-table-column prop="role_name" label="所属角色"/>
        <el-table-column prop="department" label="所属部门"/>
        <el-table-column prop="real_name" label="管理员真实姓名"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditAdmin(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteAdmin(scope.$index, scope.row)">删除</el-button>
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
      :title="adminForm.id ? '编辑管理员' : '添加管理员'"
      :visible.sync="dialogVisible"
      width="500px"
      @open="handleDialogOpen"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="adminForm" :rules="adminRules" ref="adminForm" label-width="120px">
        <el-form-item label="管理员名称" prop="username">
          <span v-if="adminForm.id">{{ adminForm.username }}</span>
          <el-input v-else v-model="adminForm.username" :maxlength="20" clearable placeholder="请输入管理员名称"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码" prop="password">
          <el-input type="password" v-model="adminForm.password" :maxlength="20" clearable :placeholder="adminForm.id ? '不修改请留空' : '6-20位数字、英文字母，或者特殊字符'"></el-input>
        </el-form-item>
        <el-form-item label="所属角色" prop="role_id">
          <el-select
            v-model="adminForm.role_id"
            :disabled="adminForm.founder === 1"
            :placeholder="adminForm.founder === 1 ? '超级管理员无须选择角色' : '请选择角色'"
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
        <el-form-item label="所属部门" prop="department">
          <el-input v-model="adminForm.department" :maxlength="20" clearable placeholder="请输入所属部门"></el-input>
        </el-form-item>
        <el-form-item label="管理员真实姓名" prop="real_name">
          <el-input v-model="adminForm.real_name" :maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="adminForm.remark" :maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="管理员头像" prop="face">
          <el-upload
            :action="MixinUploadApi"
            :on-success="uploadSuccess"
            :on-remove="() => { adminForm.face = '' }"
            :file-list="adminForm.face ? [{name: 'face', url: adminForm.face}] : []"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">建议上传jpg/png文件，且不超过1MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="超级管理员">
          <el-radio v-model="adminForm.founder" :label="1">是</el-radio>
          <el-radio v-model="adminForm.founder" :label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdminForm">确 定</el-button>
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
        // 列表loading状态
        loading: false,
        // 列表参数
        params: {
          page_no: 1,
          page_size: 10
        },
        // 列表数据
        tableData: '',
        // 管理员表单
        adminForm: {},
        // 管理员表单 规则
        adminRules: {
          username: [this.MixinRequired('请输入管理员名称！')],
          password: [
            { required: true, message: '请输入管理员密码！', trigger: 'bulr' },
            {
              validator: (rule, value, callback) => {
                if (value && !RegExp.password.test(value)) {
                  callback(new Error('密码格式错误！'))
                } else {
                  callback()
                }
              }
            }
          ],
          department: [this.MixinRequired('请输入所属部门！')],
          role_id: [{ required: true, message: '请选择所属角色！', trigger: 'change' }],
          face: [this.MixinRequired('请上传管理员头像！')]
        },
        // 管理员表单 dialog
        dialogVisible: false,
        // 角色列表
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
        if (newValue === 1) this.adminForm.role_id = '超级管理员'
      }
    },
    mounted() {
      this.GET_AdministratorList()
      // 获取角色
      API_Auth.getRoleList({ page_size: 10000 }).then(response => {
        this.rolesOptions = response.data
      })
    },
    methods: {
      uploadSuccess(res) {
        this.$set(this.adminForm, 'face', res.url)
        this.$refs['adminForm'].validateField('face')
      },
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_AdministratorList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_AdministratorList()
      },

      /** 添加管理员 */
      handleAddAdmin() {
        this.adminForm = {
          founder: 0
        }
        this.dialogVisible = true
      },

      /** 编辑管理员 */
      handleEditAdmin(index, row) {
        this.adminForm = this.MixinClone(row)
        parseInt(this.adminForm.role_id) === 0 ? this.adminForm.role_id = '超级管理员' : null
        this.fileList = this.adminForm.face ? [{ name: 'face', url: this.adminForm.face }] : []
        this.dialogVisible = true
      },

      /** 删除管理员 */
      handleDeleteAdmin(index, row) {
        this.$confirm('确定要删除这个管理员吗？', '提示', { type: 'warning' }).then(() => {
          API_Auth.deleteAdministrator(row.id).then(() => {
            this.$message.success('删除成功！')
            this.GET_AdministratorList()
          })
        }).catch(() => {})
      },
      /** dialog打开后重置form表单校验结果 */
      handleDialogOpen() {
        setTimeout(() => { this.$refs['adminForm'].clearValidate() })
      },

      /** 提交管理员表单 */
      submitAdminForm() {
        this.$refs['adminForm'].validate((valid) => {
          if (valid) {
            const { id } = this.adminForm
            const params = this.MixinClone(this.adminForm)
            if (params.password) params.password = md5(params.password)
            if (!params.real_name) delete params.real_name
            params.role_id === '超级管理员' ? params.role_id = 0 : null
            if (id) {
              API_Auth.editAdministrator(id, params).then(response => {
                this.dialogVisible = false
                this.$message.success('修改成功！')
                this.GET_AdministratorList()
              })
            } else {
              API_Auth.addAdministrator(params).then(() => {
                this.dialogVisible = false
                this.$message.success('添加成功！')
                this.GET_AdministratorList()
              })
            }
          } else {
            this.$message.error('表单填写有误，请核对！')
            return false
          }
        })
      },

      /** 获取管理员列表 */
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
