<template>
  <div class="">
    <el-tabs type="border-card">
      <el-tab-pane label="Edit member">
        <el-form :model="editMemberForm" :rules="editMemberRules" ref="editForm" inline label-width="100px">
          <el-form-item label="nickname" prop="nickname">
            <el-input v-model="editMemberForm.nickname" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input v-model="editMemberForm.password" placeholder="Do not fill, do not change" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="region" class="form-item-region">
            <en-region-picker :api="MixinRegionApi" :default="defaultRegion" @changed="(object) => { editMemberForm.region = object.last_id }"/>
          </el-form-item>
          <el-form-item label="Member of the note">
            <el-input placeholder="Please enter membership notes" v-model="editMemberForm.remark" clearable></el-input>
          </el-form-item>
          <el-form-item label="email" prop="email">
            <el-input v-model="editMemberForm.email" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="Mobile phone" prop="mobile">
            <el-input v-model="editMemberForm.mobile" :maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="birthday">
            <el-date-picker
              v-model="editMemberForm.birthday"
              type="date"
              :editable="false"
              value-format="timestamp"
              placeholder="Choose a birthday"
              :picker-options="{disabledDate(time) { return time.getTime() > Date.now() }}">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="gender" class="form-item-sex">
            <el-radio v-model="editMemberForm.sex" :label="1">male</el-radio>
            <el-radio v-model="editMemberForm.sex" :label="0">female</el-radio>
          </el-form-item>
          <el-form-item label="Detailed address">
            <el-input v-model="editMemberForm.address" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="Zip code">
            <el-input v-model="editMemberForm.zip" :maxlength="6"></el-input>
          </el-form-item>
          <el-form-item label="Fixed telephone">
            <el-input v-model="editMemberForm.tel"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="submitEditMemberForm('editForm')" class="save">Save the changes</el-button>
      </el-tab-pane>
      <el-tab-pane label="TAThe order of">
        <member-list-order :member-id="member_id"/>
      </el-tab-pane>
      <el-tab-pane label="consumption score">
        <el-form :model="editPointForm" ref="editPointForm" label-width="100px">
          <el-form-item label="Current consumption score">
            {{ editPointForm.currentPoint }}
          </el-form-item>
          <el-form-item label="Adjusted consumption score">
            <el-input-number v-model="editPointForm.changedPoint" :max="99999999" class="myNumber"></el-input-number>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="handleSavePoint" class="save">Save the changes</el-button>
      </el-tab-pane>
      <el-tab-pane label="TAThe integral of">
        <member-list-points :member-id="member_id"/>
      </el-tab-pane>
      <el-tab-pane label="TAThe consulting">
        <member-list-ask :member-id="member_id"/>
      </el-tab-pane>
      <el-tab-pane label="TAThe comments">
        <member-list-comments :member-id="member_id"/>
      </el-tab-pane>
      <el-tab-pane label="TAReceiving address of">
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
        // Edit the membership form
        editMemberForm: {},
        // Edit membership form rules
        editMemberRules: {
          nickname: [
            this.MixinRequired('Please enter a nickname！'),
            { min: 2, max: 20, message: 'The length of2 to20 A character', trigger: 'blur' },
            { validator: (rule, value, callback) => {
              if (!RegExp.userName.test(value)) {
                callback(new Error('Support only Chinese characters、The letter、digital、“-”、“_The combination of"！'))
              } else {
                callback()
              }
            } }
          ],
          mobile: [
            this.MixinRequired('Please enter your cell phone number！'),
            { validator: (rule, value, callback) => {
              if (!RegExp.mobile.test(value)) {
                callback(new Error('Incorrect phone format！'))
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
                callback(new Error('The mailbox format is incorrect！'))
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
                callback(new Error('The password should be6-20English bits or Numbers！'))
              } else {
                callback()
              }
            } }
          ]
        },
        // Locale ID array
        defaultRegion: null,
        // Edit the points form
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
      /** Submit the modified membership form*/
      submitEditMemberForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const params = this.MixinClone(this.editMemberForm)
            params.birthday /= 1000
            API_Member.editMember(params.member_id, params).then(response => {
              this.$message.success('Modify the success！')
            })
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },
      /** Save the integral*/
      handleSavePoint() {
        const { changedPoint } = this.editPointForm
        API_Member.editMemberConsumPoint(this.member_id, changedPoint).then(() => {
          this.$message.success('Modify the success！')
          this.editPointForm.currentPoint = changedPoint
        })
      },
      /** Obtain Membership details*/
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
