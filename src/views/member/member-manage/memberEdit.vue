<template>
  <div class="">
    <el-tabs type="border-card">
      <el-tab-pane label="编辑会员">
        <el-form :model="editMemberForm" :rules="editMemberRules" ref="editForm" inline label-width="100px">
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="editMemberForm.nickname" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="editMemberForm.password" placeholder="不填则不更改" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="地区" class="form-item-region">
            <en-region-picker :api="MixinRegionApi" :default="defaultRegion" @changed="(object) => { editMemberForm.region = object.last_id }"/>
          </el-form-item>
          <el-form-item label="会员备注">
            <el-input placeholder="请输入会员备注" v-model="editMemberForm.remark" clearable></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editMemberForm.email" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editMemberForm.mobile" :maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker
              v-model="editMemberForm.birthday"
              type="date"
              :editable="false"
              value-format="timestamp"
              placeholder="选择生日"
              :picker-options="{disabledDate(time) { return time.getTime() > Date.now() }}">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="性别" class="form-item-sex">
            <el-radio v-model="editMemberForm.sex" :label="1">男</el-radio>
            <el-radio v-model="editMemberForm.sex" :label="0">女</el-radio>
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input v-model="editMemberForm.address" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="邮编">
            <el-input v-model="editMemberForm.zip" :maxlength="6"></el-input>
          </el-form-item>
          <el-form-item label="固定电话">
            <el-input v-model="editMemberForm.tel"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="submitEditMemberForm('editForm')" class="save">保存修改</el-button>
      </el-tab-pane>
      <el-tab-pane label="TA的订单">
        <member-list-order :member-id="member_id"/>
      </el-tab-pane>
      <el-tab-pane label="消费积分">
        <el-form :model="editPointForm" ref="editPointForm" label-width="100px">
          <el-form-item label="当前消费积分">
            {{ editPointForm.currentPoint }}
          </el-form-item>
          <el-form-item label="调整消费积分">
            <el-input-number v-model="editPointForm.changedPoint" :max="99999999" class="myNumber"></el-input-number>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="handleSavePoint" class="save">保存修改</el-button>
      </el-tab-pane>
      <el-tab-pane label="TA的积分">
        <member-list-points :member-id="member_id"/>
      </el-tab-pane>
      <el-tab-pane label="TA的咨询">
        <member-list-ask :member-id="member_id"/>
      </el-tab-pane>
      <el-tab-pane label="TA的评论">
        <member-list-comments :member-id="member_id"/>
      </el-tab-pane>
      <el-tab-pane label="TA的收货地址">
        <member-list-address :member-id="member_id"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import * as API_Member from '@/api/member'
  import { RegExp } from '~/ui-utils'
  import MemberListAddress from './memberListAddress'
  import memberListPoints from './memberListPoints'
  import MemberListAsk from './memberListAsk'
  import MemberListComments from './memberListComments'
  import memberListOrder from './memberListOrder'

  export default {
    name: 'memberEdit',
    components: {
      MemberListAddress,
      memberListPoints,
      MemberListAsk,
      MemberListComments,
      memberListOrder
    },
    data() {
      return {
        member_id: this.$route.params.id,
        // 编辑会员 表单
        editMemberForm: {},
        // 编辑会员 表单规则
        editMemberRules: {
          nickname: [
            this.MixinRequired('请输入昵称！'),
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
            { validator: (rule, value, callback) => {
              if (!RegExp.userName.test(value)) {
                callback(new Error('只支持汉字、字母、数字、“-”、“_”的组合！'))
              } else {
                callback()
              }
            } }
          ],
          mobile: [
            this.MixinRequired('请输入手机号！'),
            { validator: (rule, value, callback) => {
              if (!RegExp.mobile.test(value)) {
                callback(new Error('手机格式有误！'))
              } else {
                callback()
              }
            } }
          ],
          email: [
            { validator: (rule, value, callback) => {
              if (value !== 0 && !value) {
                callback()
              } else if (!RegExp.email.test(value)) {
                callback(new Error('邮箱格式有误！'))
              } else {
                callback()
              }
            } }
          ],
          password: [
            { validator: (rule, value, callback) => {
              if (value !== 0 && !value) {
                callback()
              } else if (!RegExp.password.test(value)) {
                callback(new Error('密码应为6-20位英文或数字！'))
              } else {
                callback()
              }
            } }
          ]
        },
        // 地区id数组
        defaultRegion: null,
        // 编辑积分 表单
        editPointForm: {
          currentPoint: 0,
          changedPoint: 0
        }
      }
    },
    mounted() {
      this.GET_MemberDetail()
    },
    beforeRouteUpdate(to, from, next) {
      this.member_id = to.params.id
      next()
    },
    activated() {
      this.member_id = this.$route.params.id
    },
    watch: {
      member_id: function() {
        this.GET_MemberDetail()
        this.editMemberForm = {}
      }
    },
    methods: {
      /** 提交修改会员表单 */
      submitEditMemberForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const params = this.MixinClone(this.editMemberForm)
            params.birthday /= 1000
            API_Member.editMember(params.member_id, params).then(response => {
              this.$message.success('修改成功！')
            })
          } else {
            this.$message.error('表单填写有误，请检查！')
            return false
          }
        })
      },
      /** 保存积分 */
      handleSavePoint() {
        const { changedPoint } = this.editPointForm
        API_Member.editMemberConsumPoint(this.member_id, changedPoint).then(() => {
          this.$message.success('修改成功！')
          this.editPointForm.currentPoint = changedPoint
        })
      },
      /** 获取会员详情 */
      GET_MemberDetail() {
        API_Member.getMemberDetail(this.member_id).then(response => {
          response.birthday *= 1000
          response.region = response.town_id || response.county_id
          this.editMemberForm = response
          this.editPointForm.currentPoint = response.consum_point
          this.editPointForm.changedPoint = response.consum_point
          if (response.province_id) {
            this.defaultRegion = [response.province_id, response.city_id, response.county_id || -1, response.town_id || -1]
          }
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .el-date-editor.el-input {
    width: 180px;
  }
  /deep/ .form-item-sex .el-form-item__content{
    width: 180px;
  }
  /deep/ .form-item-region .el-form-item__content {
    min-width: 180px;
  }
  /deep/ .el-form-item__error {
    min-width: 240px;
  }
  /deep/ .el-tabs__content {
    overflow: initial;
  }
  /deep/ .el-tab-pane .el-button.save {
    margin-left: 100px;
  }
  .myNumber{
    width:160px;
  }
</style>
