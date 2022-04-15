<template>
  <div>
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddMember">add</el-button>
        </div>
        <div class="toolbar-search">
          <en-table-search
            @search="searchEvent"
            @advancedSearch="advancedSearchEvent"
            advanced
            placeholder="Please enter your member name or mobile phone number"
            :advancedWidth="450"
          >
            <template slot="advanced-content">
              <el-form ref="advancedForm" :model="advancedForm" label-width="100px">
                <el-form-item label="username">
                  <el-input size="medium" v-model="advancedForm.uname" clearable></el-input>
                </el-form-item>
                <el-form-item label="Mobile phone no.">
                  <el-input size="medium" v-model="advancedForm.mobile" clearable></el-input>
                </el-form-item>
                <el-form-item label="email">
                  <el-input size="medium" v-model="advancedForm.email" clearable></el-input>
                </el-form-item>
                <el-form-item label="Member of the gender">
                  <el-radio-group v-model="advancedForm.sex">
                    <el-radio :label="1">male</el-radio>
                    <el-radio :label="0">female</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="Registration time interval">
                  <el-date-picker
                    v-model="advancedForm.register_time_range"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="Start date"
                    end-placeholder="End date"
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
        <el-table-column prop="uname" label="username"/>
        <el-table-column prop="mobile" label="Mobile phone no."/>
        <el-table-column prop="email" label="email"/>
        <el-table-column label="Registration time">
          <template slot-scope="scope">{{ scope.row.create_time | unixToDate }}</template>
        </el-table-column>
        <el-table-column label="Last login time">
          <template slot-scope="scope">
	          <span v-if="scope.row.last_login">
		          {{ scope.row.last_login | unixToDate }}
	          </span>
          </template>
        </el-table-column>
        <el-table-column prop="login_count" label="The login number"/>
        <el-table-column prop="sex" label="gender" :formatter="formatterSex"/>
        <el-table-column label="Operation" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="() => { $router.push({ path: `/member/memberManage/edit/${scope.row.member_id}` }) }">Operation</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteMember(scope.$index, scope.row)">disable</el-button>
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
    <!--Add memberdialog-->
    <el-dialog
      title="Add member"
      :visible.sync="dialogAddMemberVisible"
      width="650px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="addMemberForm" :rules="addMemberRules" ref="addMemberForm" label-width="100px" inline>
        <!--username-->
        <el-form-item label="username" prop="uname">
          <el-input v-model="addMemberForm.uname" :maxlength="20"></el-input>
        </el-form-item>
        <!--password-->
        <el-form-item label="password" prop="password">
          <el-input v-model="addMemberForm.password" :type="pwdType" :maxlength="20"></el-input>
          <span class="show-pwd" @click="pwdType = pwdType === 'password' ? 'text' : 'password'">
            <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <!--nickname-->
        <el-form-item label="nickname" prop="nickname">
          <el-input v-model="addMemberForm.nickname" :maxlength="20"></el-input>
        </el-form-item>
        <!--gender-->
        <el-form-item label="gender" class="form-item-sex">
          <el-radio v-model="addMemberForm.sex" :label="1">male</el-radio>
          <el-radio v-model="addMemberForm.sex" :label="0">female</el-radio>
        </el-form-item>
        <!--birthday-->
        <el-form-item label="birthday" prop="birthday">
          <el-date-picker
            v-model="addMemberForm.birthday"
            type="date"
            :editable="false"
            value-format="timestamp"
            placeholder="Choose a birthday"
            :picker-options="{disabledDate(time) { return time.getTime() > Date.now() }}">
          </el-date-picker>
        </el-form-item>
        <!--email-->
        <el-form-item label="email" prop="email">
          <el-input v-model="addMemberForm.email"></el-input>
        </el-form-item>
        <!--region-->
        <el-form-item label="region" prop="region" class="form-item-region">
          <en-region-picker :api="MixinRegionApi" :default="defaultRegion" @changed="(object) => { addMemberForm.region = object.last_id }"/>
        </el-form-item>
        <!--Mobile phone number-->
        <el-form-item label="Mobile phone number" prop="mobile">
          <el-input v-model.number="addMemberForm.mobile" :maxlength="11"></el-input>
        </el-form-item>
        <!--Detailed address-->
        <el-form-item label="Detailed address" prop="address">
          <el-input v-model="addMemberForm.address" :maxlength="50"></el-input>
        </el-form-item>
        <!--Fixed telephone-->
        <el-form-item label="Fixed telephone">
          <el-input v-model.number="addMemberForm.tel" :maxlength="20"></el-input>
        </el-form-item>
        <!--Zip code-->
        <el-form-item label="Zip code">
          <el-input v-model.number="addMemberForm.zip" :maxlength="6"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddMemberVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitAddMemberForm('addMemberForm')">save</el-button>
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
        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10
        },

        /** The list of data*/
        tableData: '',

        // Locale ID array
        defaultRegion: null,

        /** Advanced search data*/
        advancedForm: {},

        /** Add memberdialog */
        dialogAddMemberVisible: false,

        /** Add membership form data*/
        addMemberForm: {},

        /** Add membership form rules*/
        addMemberRules: {
          uname: [
            this.MixinRequired('Please enter the user name！'),
            { min: 2, max: 20, message: 'The length of2 to20 A character', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (!RegExp.userName.test(value)) {
                  callback(new Error('Please enter Chinese characters、The letter、digital、“-”、“_The combination of"！'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          password: [
            this.MixinRequired('Please enter your password.！'),
            {
              validator: (rule, value, callback) => {
                if (!RegExp.password.test(value)) {
                  callback(new Error('Incorrect password format！'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          nickname: [
            this.MixinRequired('Please enter a nickname！'),
            { min: 2, max: 20, message: 'The length of2 to20 A character', trigger: 'blur' }
          ],
          birthday: [this.MixinRequired('Please choose your birthday！')],
          email: [
            this.MixinRequired('Please enter your email address！'),
            {
              validator: (rule, value, callback) => {
                if (!RegExp.email.test(value)) {
                  callback(new Error('The e - mail box is incorrectly formatted！'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          mobile: [
            this.MixinRequired('Please enter your mobile phone number！'),
            {
              validator: (rule, value, callback) => {
                if (!RegExp.mobile.test(value)) {
                  callback(new Error('The phone is not in the right format！'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          address: [
            this.MixinRequired('Please enter the detailed address！'),
            { max: 50, message: 'The longest50A character', trigger: 'blur' }
          ],
          region: [
            { required: true, message: 'Please select address！', trigger: 'change' }
          ]
        },
        pwdType: 'password'
      }
    },
    mounted() {
      this.GET_MemberList()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_MemberList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_MemberList()
      },

      handleDeleteMember(index, row) {
        this.$confirm('Are you sure you want to disable this member？', 'prompt', { type: 'warning' }).then(() => {
          API_Member.deleteMember(row.member_id).then(() => {
            this.$message.success('Disable the success！')
            this.GET_MemberList()
          })
        }).catch(() => {})
      },

      /** Gender formatting*/
      formatterSex(row, column, cellValue) {
        return row.sex === 1 ? 'male' : 'female'
      },

      /** Add member*/
      handleAddMember() {
        this.addMemberForm = { sex: 1, region: '' }
        this.dialogAddMemberVisible = true
      },

      /** Search Event Trigger*/
      searchEvent(keyword) {
        this.params.keyword = keyword
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        this.params.page_no = 1
        this.GET_MemberList()
      },

      /** Advanced search event triggered*/
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

      /** Submit the add membership form*/
      submitAddMemberForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params = this.MixinClone(this.addMemberForm)
            params.birthday = parseInt(params.birthday / 1000)
            API_Member.addMember(params).then(response => {
              this.dialogAddMemberVisible = false
              this.$message.success('Add a success！')
              this.GET_MemberList()
              this.addMemberForm = {}
              this.defaultRegion = []
            })
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },

      /** Get membership list*/
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
