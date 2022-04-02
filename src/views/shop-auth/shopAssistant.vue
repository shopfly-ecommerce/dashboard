<template>
  <div>
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddShopAssistant">添加</el-button>
          <div style="margin-left: 20px; display: inline-block;font-size: 12px">
            店员状态：
            <el-select
              v-model="params.disabled"
              placeholder="请选择店员状态"
              size="mini"
              @change="GET_ShopAssistantList"
              style="width: 150px">
              <el-option label="正常" :value="0"/>
              <el-option label="已禁用" :value="-1"/>
            </el-select>
          </div>
        </div>
      </div>

      <template slot="table-columns">
        <el-table-column prop="uname" label="店员名称"/>
        <el-table-column prop="role" label="所属角色"/>
        <el-table-column prop="mobile" label="手机号"/>
        <el-table-column prop="email" label="邮箱"/>
        <el-table-column label="店员状态">
          <template slot-scope="{ row }">{{ row.user_state === 0 ? '正常' : '被禁用' }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.founder !== 1"
              size="mini"
              type="primary"
              @click="handleEditShopAssistant(scope.$index, scope.row)">编辑</el-button>
            <el-button
              v-if="params.disabled === 0 && scope.row.founder !== 1"
              size="mini"
              type="danger"
              @click="handleDeleteShopAssistant(scope.$index, scope.row)">禁用</el-button>
            <el-button
              v-if="params.disabled === -1"
              size="mini"
              type="success"
              @click="handleRecoveryShopAssistant(scope.$index, scope.row)">恢复</el-button>
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
    <!--添加-->
    <el-dialog
      title="添加店员"
      :visible.sync="dialogVisible"
      width="500px"
      @open="handleDialogOpen"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form v-show="cur_step === 1" :model="shopAssistantPhoneForm" :rules="shopAssistantPhoneRules" ref="shopAssistantPhoneForm" label-width="120px">
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="shopAssistantPhoneForm.mobile" :maxlength="11" clearable placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="captcha" class="img-code">
          <span slot="label">验&ensp;证&ensp;码</span>
          <el-input v-model="shopAssistantPhoneForm.captcha" clearable placeholder="验证码" maxlength="4">
            <template slot="append">
              <img :src="validcodeImg" @click="changeValidcode" class="verification-code">
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="sms_code" class="sms-code">
          <span slot="label">短信验证码</span>
          <el-input v-model="shopAssistantPhoneForm.sms_code" :maxlength="6" placeholder="2分钟内有效">
            <en-count-down-btn :start="sendValidMobileSms" :isStop="isStop" @end="changeValidcode" slot="append" />
          </el-input>
        </el-form-item>
      </el-form>
      <el-form v-show="cur_step === 2" :model="shopAddAssistantForm" :rules="shopAssistantRules" ref="shopAddAssistantForm" label-width="120px">
        <el-form-item label="手机号码">
          <span>{{ shopAddAssistantForm.mobile }}</span>
        </el-form-item>
        <el-form-item v-if="!member_role" label="店员名称" prop="uname">
          <el-input v-model="shopAddAssistantForm.uname" :maxlength="20" clearable placeholder="请输入店员名称"></el-input>
        </el-form-item>
        <el-form-item v-if="!member_role" label="店员密码" prop="password">
          <el-input type="password" v-model="shopAddAssistantForm.password" :maxlength="20" clearable :placeholder="shopAddAssistantForm.clerk_id ? '不修改请留空' : '6-20位数字、英文字母'"></el-input>
        </el-form-item>
        <el-form-item label="所属角色" prop="role_id">
          <el-select
            v-model="shopAddAssistantForm.role_id"
            placeholder="请选择角色"
            :disabled="shopAddAssistantForm.founder === 1"
            value-key="role_id"
            clearable
          >
            <el-option :label="shopAddAssistantForm.founder === 1 ? '店主' : '超级店员'" :value="0">
            </el-option>
            <el-option
              v-for="item in rolesOptions"
              :key="item.role_id"
              :label="item.role_name"
              :value="item.role_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="!member_role" label="邮箱地址" prop="email">
          <el-input v-model="shopAddAssistantForm.email" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-show="cur_step === 1" type="primary" @click="toNext">下一步</el-button>
        <el-button v-show="cur_step === 2" @click="dialogVisible = false">取 消</el-button>
        <el-button v-show="cur_step === 2" type="primary" @click="addShopAssistantForm">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑-->
    <el-dialog
      title="编辑店员"
      :visible.sync="editDialogVisible"
      width="500px"
      @open="handleDialogOpen"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="shopAssistantForm" :rules="shopAssistantRules" ref="shopAssistantForm" label-width="120px">
        <el-form-item label="手机号码">
          <span>{{ shopAssistantForm.mobile }}</span>
        </el-form-item>
        <el-form-item label="店员名称" prop="uname">
          <el-input v-model="shopAssistantForm.uname" :maxlength="20" clearable placeholder="请输入店员名称"></el-input>
        </el-form-item>
        <el-form-item label="店员密码" prop="password">
          <el-input type="password" v-model="shopAssistantForm.password" :maxlength="20" clearable :placeholder="shopAssistantForm.clerk_id ? '不修改请留空' : '6-20位数字、英文字母'"></el-input>
        </el-form-item>
        <el-form-item label="所属角色" prop="role_id">
          <el-select
            v-model="shopAssistantForm.role_id"
            placeholder="请选择角色"
            :disabled="shopAssistantForm.founder === 1"
            clearable
          >
            <el-option :label="shopAssistantForm.founder === 1 ? '店主' : '超级店员'" :value="0">
            </el-option>
            <el-option
              v-for="item in rolesOptions"
              :key="item.role_id"
              :label="item.role_name"
              :value="item.role_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱地址" prop="email">
          <el-input v-model="shopAssistantForm.email" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editShopAssistantForm">确 定</el-button>
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
          callback(new Error('请输入店员名称,且不能为空格！'))
        } else if (!/^(?![0-9]+$)[\u4e00-\u9fa5_0-9A-Za-z]{2,20}$/.test(value)) {
          callback(new Error('店员名称不可为纯数字，长度2-20个字符，不允许特殊符号！'))
        } else {
          callback()
        }
      }
      return {
        uuid: Storage.getItem('seller_uuid'),
        // 列表loading状态
        loading: false,
        // 列表参数
        params: {
          page_no: 1,
          page_size: 10,
          disabled: 0
        },
        // 列表数据
        tableData: '',
        // 店员手机表单
        shopAssistantPhoneForm: {},
        // 店员手机表单 规则
        shopAssistantPhoneRules: {
          mobile: [
            this.MixinRequired('请输入手机号码！'),
            {
              validator: (rule, value, callback) => {
                if (!RegExp.mobile.test(value)) {
                  callback(new Error('手机号码格式有误！'))
                } else {
                  callback()
                }
              },
              trigger: ['change', 'blur']
            }
          ],
          captcha: [this.MixinRequired('请输入图片验证码！')],
          sms_code: [this.MixinRequired('请输入短信验证码！')]
        },
        // 店员添加表单
        shopAddAssistantForm: {},
        // 店员编辑表单
        shopAssistantForm: {},
        // 店员表单 规则
        shopAssistantRules: {
          uname: [
            { required: true, message: '请输入店员名称！', trigger: 'bulr' },
            { validator: checkName, trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入店员密码！', trigger: 'bulr' },
            {
              validator: (rule, value, callback) => {
                if (this.shopAssistantForm.clerk_id && !RegExp.password.test(value)) {
                  callback(new Error('密码格式错误！'))
                } else {
                  callback()
                }
              }
            }
          ],
          captcha: [this.MixinRequired('请输入图片验证码！')],
          role_id: [
            { required: true, message: '请选择所属角色！', trigger: 'change' },
            {
              validator: (rule, value, callback) => {
                const _result = this.tableData.data.findIndex(val => { return val.role_id === 0 })
                if (_result !== -1 && value === 0) {
                  callback(new Error('超级店员只能添加一个！'))
                } else {
                  callback()
                }
              }
            }],
          mobile: [
            this.MixinRequired('请输入手机号码！'),
            {
              validator: (rule, value, callback) => {
                if (!RegExp.mobile.test(value)) {
                  callback(new Error('手机号码格式有误！'))
                } else {
                  callback()
                }
              }
            }
          ],
          email: [
            this.MixinRequired('请输入邮箱地址！'),
            {
              validator: (rule, value, callback) => {
                if (!RegExp.email.test(value)) {
                  callback(new Error('邮箱地址格式有误！'))
                } else {
                  callback()
                }
              }
            }
          ]
        },
        // 店员表单 dialog
        dialogVisible: false,
        // 编辑店员表单
        editDialogVisible: false,
        // 角色列表
        rolesOptions: [],
        // 验证码图片
        validcodeImg: '',
        // 当前步骤 默认第一步
        cur_step: 1,
        // 新店员还是老店员 1为老店员 0为新店员 默认老店员
        member_role: 1,
        // 是否停止计时器
        isStop: false,
        // 是否是编辑模式 默认不是
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
      // 获取角色
      API_Auth.getRoleList({ page_size: 10000 }).then(response => {
        this.rolesOptions = response.data
      })
      this.changeValidcode()
    },
    activated() {
      // 获取角色
      API_Auth.getRoleList({ page_size: 10000 }).then(response => {
        this.rolesOptions = response.data
      })
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_ShopAssistantList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_ShopAssistantList()
      },

      /** 添加店员 */
      handleAddShopAssistant() {
        this.shopAssistantPhoneForm = {}
        this.dialogVisible = true
        // 停止计时器
        this.isStop = true
        // 设置添加模式
        this.isEdit = false
      },

      /** 更换图片验证码 */
      changeValidcode() {
        this.validcodeImg = API_Common.getValidateCodeUrl('ADD_CLERK', this.uuid)
      },

      /** 发送手机验证码异步方法 */
      sendValidMobileSms() {
        return new Promise((resolve, reject) => {
          const { mobile, captcha } = this.shopAssistantPhoneForm
          if (!mobile) {
            this.$message.error('请输入手机号！')
          } else if (!captcha) {
            this.$message.error('请输入图片验证码！')
          } else {
            API_Auth.getSmsCode(mobile, { captcha: captcha, uuid: this.uuid }).then(() => {
              this.$message.success('短信发送成功，请注意查收！')
              resolve()
            }).catch(reject)
          }
        })
      },

      /** 下一步 */
      toNext() {
        this.$refs['shopAssistantPhoneForm'].validate((valid) => {
          if (valid) {
            // 对手机号码进行校验
            const { mobile, sms_code } = this.shopAssistantPhoneForm
            API_Auth.valiPhone(mobile, { sms_code }).then((response) => {
              this.member_role = response.result === 'exist' ? 1 : 0
              this.cur_step = 2
              this.shopAddAssistantForm.mobile = response.mobile
            }).catch()
          } else {
            this.$message.error('表单填写有误，请核对！')
            return false
          }
        })
      },

      /** 编辑店员 */
      handleEditShopAssistant(index, row) {
        this.shopAssistantForm = this.MixinClone(row)
        this.editDialogVisible = true
        // 设置编辑模式
        this.isEdit = true
      },

      /** 删除店员 */
      handleDeleteShopAssistant(index, row) {
        this.$confirm('确定要禁用这个店员吗？', '提示', { type: 'warning' }).then(() => {
          API_Auth.deleteShopAssistant(row.clerk_id).then(() => {
            this.$message.success('禁用成功！')
            this.GET_ShopAssistantList()
          })
        }).catch(() => {})
      },

      /** 恢复被禁用店员 */
      handleRecoveryShopAssistant(index, row) {
        this.$confirm('确定要恢复这个店员吗？', '提示', { type: 'warning' }).then(() => {
          API_Auth.recoveryShopAssistant(row.clerk_id).then(() => {
            this.$message.success('恢复成功！')
            this.GET_ShopAssistantList()
          })
        }).catch(() => {})
      },

      /** dialog打开后重置form表单校验结果 */
      handleDialogOpen() {
        if (this.isEdit) {
          setTimeout(() => { this.$refs['shopAssistantForm'].clearValidate() })
        } else {
          setTimeout(() => { this.$refs['shopAssistantPhoneForm'].clearValidate() })
          setTimeout(() => { this.$refs['shopAssistantForm'].clearValidate() })
          this.cur_step = 1
        }
      },

      /** 添加店员表单 */
      addShopAssistantForm() {
        this.$refs['shopAddAssistantForm'].validate((valid) => {
          if (valid) {
            const params = this.MixinClone(this.shopAddAssistantForm)
            if (params.password) params.password = md5(params.password)
            if (this.member_role === 1) { // 老会员
              API_Auth.addOldMember(params).then(() => {
                this.dialogVisible = false
                this.$message.success('添加成功！')
                this.GET_ShopAssistantList()
                this.isStop = false
              })
            } else { // 新会员
              API_Auth.addNewMember(params).then(() => {
                this.dialogVisible = false
                this.$message.success('添加成功！')
                this.GET_ShopAssistantList()
                this.isStop = false
              })
            }
          } else {
            this.$message.error('表单填写有误，请核对！')
            return false
          }
        })
      },

      /** 编辑店员表单 */
      editShopAssistantForm() {
        this.$refs['shopAssistantForm'].validate((valid) => {
          if (valid) {
            const { clerk_id } = this.shopAssistantForm
            const params = this.MixinClone(this.shopAssistantForm)
            if (params.password) params.password = md5(params.password)
            API_Auth.editShopAssistant(clerk_id, params).then(() => {
              this.editDialogVisible = false
              this.$message.success('修改成功！')
              this.GET_ShopAssistantList()
            })
          } else {
            this.$message.error('表单填写有误，请核对！')
            return false
          }
        })
      },

      /** 获取店员列表 */
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
