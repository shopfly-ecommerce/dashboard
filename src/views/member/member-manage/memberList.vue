<template>
  <div>
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddMember">添加</el-button>
        </div>
        <div class="toolbar-search">
          <en-table-search
            @search="searchEvent"
            @advancedSearch="advancedSearchEvent"
            advanced
            placeholder="请输入会员名或手机号"
            :advancedWidth="450"
          >
            <template slot="advanced-content">
              <el-form ref="advancedForm" :model="advancedForm" label-width="100px">
                <el-form-item label="用户名">
                  <el-input size="medium" v-model="advancedForm.uname" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                  <el-input size="medium" v-model="advancedForm.mobile" clearable></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱">
                  <el-input size="medium" v-model="advancedForm.email" clearable></el-input>
                </el-form-item>
                <el-form-item label="会员性别">
                  <el-radio-group v-model="advancedForm.sex">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="0">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="注册时间区间">
                  <el-date-picker
                    v-model="advancedForm.register_time_range"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="timestamp"
                    style="width: 324px"
                    :picker-options="{ shortcuts: MixinPickerShortcuts }"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-form>
            </template>
          </en-table-search>
        </div>
      </div>

      <template slot="table-columns">
        <el-table-column prop="uname" label="用户名"/>
        <el-table-column prop="mobile" label="手机号"/>
        <el-table-column prop="email" label="电子邮箱"/>
        <el-table-column label="注册时间">
          <template slot-scope="scope">{{ scope.row.create_time | unixToDate }}</template>
        </el-table-column>
        <el-table-column label="上次登录时间">
          <template slot-scope="scope">
	          <span v-if="scope.row.last_login">
		          {{ scope.row.last_login | unixToDate }}
	          </span>
          </template>
        </el-table-column>
        <el-table-column prop="login_count" label="登录次数"/>
        <el-table-column prop="sex" label="性别" :formatter="formatterSex"/>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="() => { $router.push({ path: `/member/memberManage/edit/${scope.row.member_id}` }) }">操作</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteMember(scope.$index, scope.row)">禁用</el-button>
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
    <!--添加会员 dialog-->
    <el-dialog
      title="添加会员"
      :visible.sync="dialogAddMemberVisible"
      width="650px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="addMemberForm" :rules="addMemberRules" ref="addMemberForm" label-width="100px" inline>
        <!--用户名-->
        <el-form-item label="用户名" prop="uname">
          <el-input v-model="addMemberForm.uname" :maxlength="20"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addMemberForm.password" :type="pwdType" :maxlength="20"></el-input>
          <span class="show-pwd" @click="pwdType = pwdType === 'password' ? 'text' : 'password'">
            <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <!--昵称-->
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="addMemberForm.nickname" :maxlength="20"></el-input>
        </el-form-item>
        <!--性别-->
        <el-form-item label="性别" class="form-item-sex">
          <el-radio v-model="addMemberForm.sex" :label="1">男</el-radio>
          <el-radio v-model="addMemberForm.sex" :label="0">女</el-radio>
        </el-form-item>
        <!--生日-->
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="addMemberForm.birthday"
            type="date"
            :editable="false"
            value-format="timestamp"
            placeholder="选择生日"
            :picker-options="{disabledDate(time) { return time.getTime() > Date.now() }}">
          </el-date-picker>
        </el-form-item>
        <!--邮箱-->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addMemberForm.email"></el-input>
        </el-form-item>
        <!--地区-->
        <el-form-item label="地区" prop="region" class="form-item-region">
          <en-region-picker :api="MixinRegionApi" :default="defaultRegion" @changed="(object) => { addMemberForm.region = object.last_id }"/>
        </el-form-item>
        <!--手机号码-->
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model.number="addMemberForm.mobile" :maxlength="11"></el-input>
        </el-form-item>
        <!--详细地址-->
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="addMemberForm.address" :maxlength="50"></el-input>
        </el-form-item>
        <!--固定电话-->
        <el-form-item label="固定电话">
          <el-input v-model.number="addMemberForm.tel" :maxlength="20"></el-input>
        </el-form-item>
        <!--邮编-->
        <el-form-item label="邮编">
          <el-input v-model.number="addMemberForm.zip" :maxlength="6"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddMemberVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddMemberForm('addMemberForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_Member from '@/api/member'
  import { RegExp } from '~/ui-utils'

  export default {
    name: 'memberList',
    watch: {
      'addMemberForm.region'(next, prev) {
        if (next && next.length) {
          this.$refs.addMemberForm.clearValidate('region')
        }
      }
    },
    data() {
      return {
        /** 列表loading状态 */
        loading: false,

        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10
        },

        /** 列表数据 */
        tableData: '',

        // 地区id数组
        defaultRegion: null,

        /** 高级搜索数据 */
        advancedForm: {},

        /** 添加会员 dialog */
        dialogAddMemberVisible: false,

        /** 添加会员 表单数据 */
        addMemberForm: {},

        /** 添加会员 表单规则 */
        addMemberRules: {
          uname: [
            this.MixinRequired('请输入用户名！'),
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (!RegExp.userName.test(value)) {
                  callback(new Error('请输入汉字、字母、数字、“-”、“_”的组合！'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          password: [
            this.MixinRequired('请输入密码！'),
            {
              validator: (rule, value, callback) => {
                if (!RegExp.password.test(value)) {
                  callback(new Error('密码格式有误！'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          nickname: [
            this.MixinRequired('请输入昵称！'),
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          birthday: [this.MixinRequired('请选择生日！')],
          email: [
            this.MixinRequired('请输入电子邮箱！'),
            {
              validator: (rule, value, callback) => {
                if (!RegExp.email.test(value)) {
                  callback(new Error('电子邮箱格式有误！'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          mobile: [
            this.MixinRequired('请输入手机号码！'),
            {
              validator: (rule, value, callback) => {
                if (!RegExp.mobile.test(value)) {
                  callback(new Error('手机格式格式有误！'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          address: [
            this.MixinRequired('请输入详细地址！'),
            { max: 50, message: '最长50个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择地址！', trigger: 'change' }
          ]
        },
        pwdType: 'password'
      }
    },
    mounted() {
      this.GET_MemberList()
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_MemberList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_MemberList()
      },

      handleDeleteMember(index, row) {
        this.$confirm('确定要禁用这个会员吗？', '提示', { type: 'warning' }).then(() => {
          API_Member.deleteMember(row.member_id).then(() => {
            this.$message.success('禁用成功！')
            this.GET_MemberList()
          })
        }).catch(() => {})
      },

      /** 性别格式化 */
      formatterSex(row, column, cellValue) {
        return row.sex === 1 ? '男' : '女'
      },

      /** 添加会员 */
      handleAddMember() {
        this.addMemberForm = { sex: 1, region: '' }
        this.dialogAddMemberVisible = true
      },

      /** 搜索事件触发 */
      searchEvent(keyword) {
        this.params.keyword = keyword
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        this.params.page_no = 1
        this.GET_MemberList()
      },

      /** 高级搜索事件触发 */
      advancedSearchEvent() {
        const { advancedForm } = this
        const { register_time_range, sex } = advancedForm
        Object.keys(this.advancedForm).forEach(key => {
          if (advancedForm[key] !== undefined) {
            this.params[key] = advancedForm[key]
          }
        })
        if (register_time_range && register_time_range.length === 2) {
          this.params.start_time = register_time_range[0] / 1000
          this.params.end_time = register_time_range[1] / 1000
        } else {
          delete this.params.start_time
          delete this.params.end_time
        }
        delete this.params.register_time_range
        delete this.params.keyword
        if (sex === -1) delete this.params.sex
        this.params.page_no = 1
        this.GET_MemberList()
      },

      /** 提交添加会员表单 */
      submitAddMemberForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params = this.MixinClone(this.addMemberForm)
            params.birthday = parseInt(params.birthday / 1000)
            API_Member.addMember(params).then(response => {
              this.dialogAddMemberVisible = false
              this.$message.success('添加成功！')
              this.GET_MemberList()
              this.addMemberForm = {}
              this.defaultRegion = []
            })
          } else {
            this.$message.error('表单填写有误，请检查！')
            return false
          }
        })
      },

      /** 获取会员列表 */
      GET_MemberList() {
        this.loading = true
        const { params } = this
        Object.keys(params).forEach(key => {
          if (!params[key] && params[key] !== 0) {
            delete params[key]
          }
        })
        API_Member.getMemberList(params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .show-pwd {
    position: absolute;
    top: 0;
    right: 10px;
    cursor: pointer;
  }

  .el-date-editor.el-input {
    width: 180px;
  }

  /deep/ .form-item-sex .el-form-item__content{
    width: 180px;
  }

  /deep/ .form-item-region .el-form-item__content {
    min-width: 180px;
  }
  /deep/ .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 30px;
  }

</style>
