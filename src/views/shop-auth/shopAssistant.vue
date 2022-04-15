<template>
  <div>
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddShopAssistant">add</el-button>
          <div style="margin-left: 20px; display: inline-block;font-size: 12px">
            The clerk state：
            <el-select
              v-model="params.disabled"
              placeholder="Please select shop assistant status"
              size="mini"
              @change="GET_ShopAssistantList"
              style="width: 150px">
              <el-option label="normal" :value="0"/>
              <el-option label="Has been disabled" :value="-1"/>
            </el-select>
          </div>
        </div>
      </div>

      <template slot="table-columns">
        <el-table-column prop="uname" label="Name of the clerk"/>
        <el-table-column prop="role" label="Subordinate role"/>
        <el-table-column prop="mobile" label="Mobile phone no."/>
        <el-table-column prop="email" label="email"/>
        <el-table-column label="The clerk state">
          <template slot-scope="{ row }">{{ row.user_state === 0 ? 'normal' : 'Be disabled' }}</template>
        </el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.founder !== 1"
              size="mini"
              type="primary"
              @click="handleEditShopAssistant(scope.$index, scope.row)">edit</el-button>
            <el-button
              v-if="params.disabled === 0 && scope.row.founder !== 1"
              size="mini"
              type="danger"
              @click="handleDeleteShopAssistant(scope.$index, scope.row)">disable</el-button>
            <el-button
              v-if="params.disabled === -1"
              size="mini"
              type="success"
              @click="handleRecoveryShopAssistant(scope.$index, scope.row)">restore</el-button>
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
    <!--add-->
    <el-dialog
      title="Add a clerk"
      :visible.sync="dialogVisible"
      width="500px"
      @open="handleDialogOpen"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form v-show="cur_step === 1" :model="shopAssistantPhoneForm" :rules="shopAssistantPhoneRules" ref="shopAssistantPhoneForm" label-width="120px">
        <el-form-item label="Mobile phone number" prop="mobile">
          <el-input v-model="shopAssistantPhoneForm.mobile" :maxlength="11" clearable placeholder="Please enter your mobile phone number"></el-input>
        </el-form-item>
        <el-form-item prop="captcha" class="img-code">
          <span slot="label">captcha</span>
          <el-input v-model="shopAssistantPhoneForm.captcha" clearable placeholder="captcha" maxlength="4">
            <template slot="append">
              <img :src="validcodeImg" @click="changeValidcode" class="verification-code">
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="sms_code" class="sms-code">
          <span slot="label">SMS verification code</span>
          <el-input v-model="shopAssistantPhoneForm.sms_code" :maxlength="6" placeholder="2Within minutes">
            <en-count-down-btn :start="sendValidMobileSms" :isStop="isStop" @end="changeValidcode" slot="append" />
          </el-input>
        </el-form-item>
      </el-form>
      <el-form v-show="cur_step === 2" :model="shopAddAssistantForm" :rules="shopAssistantRules" ref="shopAddAssistantForm" label-width="120px">
        <el-form-item label="Mobile phone number">
          <span>{{ shopAddAssistantForm.mobile }}</span>
        </el-form-item>
        <el-form-item v-if="!member_role" label="Name of the clerk" prop="uname">
          <el-input v-model="shopAddAssistantForm.uname" :maxlength="20" clearable placeholder="Please enter the name of the shop assistant"></el-input>
        </el-form-item>
        <el-form-item v-if="!member_role" label="The clerk password" prop="password">
          <el-input type="password" v-model="shopAddAssistantForm.password" :maxlength="20" clearable :placeholder="shopAddAssistantForm.clerk_id ? 'Leave blank if not modified' : '6-20A digital、The English alphabet'"></el-input>
        </el-form-item>
        <el-form-item label="Subordinate role" prop="role_id">
          <el-select
            v-model="shopAddAssistantForm.role_id"
            placeholder="Please select roles"
            :disabled="shopAddAssistantForm.founder === 1"
            value-key="role_id"
            clearable
          >
            <el-option :label="shopAddAssistantForm.founder === 1 ? 'The shop owner' : 'The shop assistant'" :value="0">
            </el-option>
            <el-option
              v-for="item in rolesOptions"
              :key="item.role_id"
              :label="item.role_name"
              :value="item.role_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="!member_role" label="Email address" prop="email">
          <el-input v-model="shopAddAssistantForm.email" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-show="cur_step === 1" type="primary" @click="toNext">Next</el-button>
        <el-button v-show="cur_step === 2" @click="dialogVisible = false">cancel</el-button>
        <el-button v-show="cur_step === 2" type="primary" @click="addShopAssistantForm">save</el-button>
      </span>
    </el-dialog>
    <!--edit-->
    <el-dialog
      title="Edit the clerk"
      :visible.sync="editDialogVisible"
      width="500px"
      @open="handleDialogOpen"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="shopAssistantForm" :rules="shopAssistantRules" ref="shopAssistantForm" label-width="120px">
        <el-form-item label="Mobile phone number">
          <span>{{ shopAssistantForm.mobile }}</span>
        </el-form-item>
        <el-form-item label="Name of the clerk" prop="uname">
          <el-input v-model="shopAssistantForm.uname" :maxlength="20" clearable placeholder="Please enter the name of the shop assistant"></el-input>
        </el-form-item>
        <el-form-item label="The clerk password" prop="password">
          <el-input type="password" v-model="shopAssistantForm.password" :maxlength="20" clearable :placeholder="shopAssistantForm.clerk_id ? 'Leave blank if not modified' : '6-20A digital、The English alphabet'"></el-input>
        </el-form-item>
        <el-form-item label="Subordinate role" prop="role_id">
          <el-select
            v-model="shopAssistantForm.role_id"
            placeholder="Please select roles"
            :disabled="shopAssistantForm.founder === 1"
            clearable
          >
            <el-option :label="shopAssistantForm.founder === 1 ? 'The shop owner' : 'The shop assistant'" :value="0">
            </el-option>
            <el-option
              v-for="item in rolesOptions"
              :key="item.role_id"
              :label="item.role_name"
              :value="item.role_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Email address" prop="email">
          <el-input v-model="shopAssistantForm.email" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">cancel</el-button>
        <el-button type="primary" @click="editShopAssistantForm">save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_Auth from '@/api/auth'
  import * as API_Common from '@/api/common'
  import md5 from 'js-md5'
  import Storage from '@/utils/storage'
  import { CountDownBtn } from '@/components/'
  import { RegExp } from '~/ui-utils'

  export default {
    name: 'shopAssistant',
    components: {
      [CountDownBtn.name]: CountDownBtn
    },
    data() {
      const checkName = (rule, value, callback) => {
        if (!value.trim()) {
          callback(new Error('Please enter the name of the shop assistant,And cannot be a space！'))
        } else if (!/^(?![0-9]+$)[\u4e00-\u9fa5_0-9A-Za-z]{2,20}$/.test(value)) {
          callback(new Error('Store clerk name must not be pure number, length2-20Characters, no special symbols allowed！'))
        } else {
          callback()
        }
      }
      return {
        uuid: Storage.getItem('seller_uuid'),
        // List loading status
        loading: false,
        // A list of parameters
        params: {
          page_no: 1,
          page_size: 10,
          disabled: 0
        },
        // The list of data
        tableData: '',
        // Shop assistant mobile form
        shopAssistantPhoneForm: {},
        // Shop assistant mobile form rules
        shopAssistantPhoneRules: {
          mobile: [
            this.MixinRequired('Please enter your mobile phone number！'),
            {
              validator: (rule, value, callback) => {
                if (!RegExp.mobile.test(value)) {
                  callback(new Error('The phone number is incorrectly formatted！'))
                } else {
                  callback()
                }
              },
              trigger: ['change', 'blur']
            }
          ],
          captcha: [this.MixinRequired('Please enter the image verification code！')],
          sms_code: [this.MixinRequired('Please enter the SMS verification code！')]
        },
        // Assistant adds form
        shopAddAssistantForm: {},
        // Clerk editing form
        shopAssistantForm: {},
        // Shop assistant form rules
        shopAssistantRules: {
          uname: [
            { required: true, message: 'Please enter the name of the shop assistant！', trigger: 'bulr' },
            { validator: checkName, trigger: 'blur' }
          ],
          password: [
            { required: true, message: 'Please enter the code of the shop assistant！', trigger: 'bulr' },
            {
              validator: (rule, value, callback) => {
                if (this.shopAssistantForm.clerk_id && !RegExp.password.test(value)) {
                  callback(new Error('Password format error！'))
                } else {
                  callback()
                }
              }
            }
          ],
          captcha: [this.MixinRequired('Please enter the image verification code！')],
          role_id: [
            { required: true, message: 'Please select the role！', trigger: 'change' },
            {
              validator: (rule, value, callback) => {
                const _result = this.tableData.data.findIndex(val => { return val.role_id === 0 })
                if (_result !== -1 && value === 0) {
                  callback(new Error('Super clerk can only add one！'))
                } else {
                  callback()
                }
              }
            }],
          mobile: [
            this.MixinRequired('Please enter your mobile phone number！'),
            {
              validator: (rule, value, callback) => {
                if (!RegExp.mobile.test(value)) {
                  callback(new Error('The phone number is incorrectly formatted！'))
                } else {
                  callback()
                }
              }
            }
          ],
          email: [
            this.MixinRequired('Please enter your email address！'),
            {
              validator: (rule, value, callback) => {
                if (!RegExp.email.test(value)) {
                  callback(new Error('The email address is incorrectly formatted！'))
                } else {
                  callback()
                }
              }
            }
          ]
        },
        // Shop Assistant Form Dialog
        dialogVisible: false,
        // Edit shop assistant form
        editDialogVisible: false,
        // The role list
        rolesOptions: [],
        // Captcha image
        validcodeImg: '',
        // The current step defaults to step 1
        cur_step: 1,
        // New salesperson or old salesperson 1 is old salesperson 0 is new salesperson default old salesperson
        member_role: 1,
        // Stop the timer
        isStop: false,
        // Edit mode not by default
        isEdit: false
      }
    },
    watch: {
      'shopAssistantForm.clerk_id': function(newValue) {
        this.shopAssistantRules.password[0].required = !newValue
      },
      dialogVisible() {
        if (!this.dialogVisible) {
          this.isStop = false
        }
      }
    },
    mounted() {
      this.GET_ShopAssistantList()
      // Acquire role
      API_Auth.getRoleList({ page_size: 10000 }).then(response => {
        this.rolesOptions = response.data
      })
      this.changeValidcode()
    },
    activated() {
      // Acquire role
      API_Auth.getRoleList({ page_size: 10000 }).then(response => {
        this.rolesOptions = response.data
      })
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_ShopAssistantList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_ShopAssistantList()
      },

      /** Add a clerk*/
      handleAddShopAssistant() {
        this.shopAssistantPhoneForm = {}
        this.dialogVisible = true
        // Stop timer
        this.isStop = true
        // Set add mode
        this.isEdit = false
      },

      /** Replace the image verification code*/
      changeValidcode() {
        this.validcodeImg = API_Common.getValidateCodeUrl('ADD_CLERK', this.uuid)
      },

      /** Sending a mobile verification code asynchronously*/
      sendValidMobileSms() {
        return new Promise((resolve, reject) => {
          const { mobile, captcha } = this.shopAssistantPhoneForm
          if (!mobile) {
            this.$message.error('Please enter your cell phone number！')
          } else if (!captcha) {
            this.$message.error('Please enter the image verification code！')
          } else {
            API_Auth.getSmsCode(mobile, { captcha: captcha, uuid: this.uuid }).then(() => {
              this.$message.success('The text message has been sent successfully, please note that check！')
              resolve()
            }).catch(reject)
          }
        })
      },

      /** Next*/
      toNext() {
        this.$refs['shopAssistantPhoneForm'].validate((valid) => {
          if (valid) {
            // Check the phone number
            const { mobile, sms_code } = this.shopAssistantPhoneForm
            API_Auth.valiPhone(mobile, { sms_code }).then((response) => {
              this.member_role = response.result === 'exist' ? 1 : 0
              this.cur_step = 2
              this.shopAddAssistantForm.mobile = response.mobile
            }).catch()
          } else {
            this.$message.error('There is an error in the form. Please check it！')
            return false
          }
        })
      },

      /** Edit the clerk*/
      handleEditShopAssistant(index, row) {
        this.shopAssistantForm = this.MixinClone(row)
        this.editDialogVisible = true
        // Set edit mode
        this.isEdit = true
      },

      /** To delete a clerk*/
      handleDeleteShopAssistant(index, row) {
        this.$confirm('Are you sure you want to ban the clerk？', 'prompt', { type: 'warning' }).then(() => {
          API_Auth.deleteShopAssistant(row.clerk_id).then(() => {
            this.$message.success('Disable the success！')
            this.GET_ShopAssistantList()
          })
        }).catch(() => {})
      },

      /** Restore disabled shop assistants*/
      handleRecoveryShopAssistant(index, row) {
        this.$confirm('Are you sure you want to restore the clerk？', 'prompt', { type: 'warning' }).then(() => {
          API_Auth.recoveryShopAssistant(row.clerk_id).then(() => {
            this.$message.success('Restore success！')
            this.GET_ShopAssistantList()
          })
        }).catch(() => {})
      },

      /** dialogReset after openingformForm validation results*/
      handleDialogOpen() {
        if (this.isEdit) {
          setTimeout(() => { this.$refs['shopAssistantForm'].clearValidate() })
        } else {
          setTimeout(() => { this.$refs['shopAssistantPhoneForm'].clearValidate() })
          setTimeout(() => { this.$refs['shopAssistantForm'].clearValidate() })
          this.cur_step = 1
        }
      },

      /** Add a clerk form*/
      addShopAssistantForm() {
        this.$refs['shopAddAssistantForm'].validate((valid) => {
          if (valid) {
            const params = this.MixinClone(this.shopAddAssistantForm)
            if (params.password) params.password = md5(params.password)
            if (this.member_role === 1) { // Old members
              API_Auth.addOldMember(params).then(() => {
                this.dialogVisible = false
                this.$message.success('Add a success！')
                this.GET_ShopAssistantList()
                this.isStop = false
              })
            } else { // New members
              API_Auth.addNewMember(params).then(() => {
                this.dialogVisible = false
                this.$message.success('Add a success！')
                this.GET_ShopAssistantList()
                this.isStop = false
              })
            }
          } else {
            this.$message.error('There is an error in the form. Please check it！')
            return false
          }
        })
      },

      /** Edit the clerk form*/
      editShopAssistantForm() {
        this.$refs['shopAssistantForm'].validate((valid) => {
          if (valid) {
            const { clerk_id } = this.shopAssistantForm
            const params = this.MixinClone(this.shopAssistantForm)
            if (params.password) params.password = md5(params.password)
            API_Auth.editShopAssistant(clerk_id, params).then(() => {
              this.editDialogVisible = false
              this.$message.success('Modify the success！')
              this.GET_ShopAssistantList()
            })
          } else {
            this.$message.error('There is an error in the form. Please check it！')
            return false
          }
        })
      },

      /** Get a list of shop assistants*/
      GET_ShopAssistantList() {
        this.loading = true
        API_Auth.getShopAssistantList(this.params).then(response => {
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
  /deep/ .img-code {
    width: 80%;
    .el-input-group__append {
      padding: 0;
      margin: 0;
      img {
        display: block;
        height: 30px;
        cursor: pointer;
      }
    }
  }
</style>
