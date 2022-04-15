<template>
  <div>
    <en-table-layout
      :pagination="true"
      :tableData="tableData.data"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleReleaseMessage">send</el-button>
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column prop="title" label="News headlines"/>
        <el-table-column prop="send_type" label="Send type"/>
        <el-table-column prop="send_time" :formatter="MixinUnixToDate" label="Send time"/>
        <el-table-column prop="content" label="The message content" width="500"/>
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
      title="Send in-station messages"
      :visible.sync="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="messageForm" :rules="messageRules" ref="messageForm" label-width="100px">
        <el-form-item label="News headlines" prop="title">
          <el-input v-model="messageForm.title" :maxlength="20" placeholder="The title in20characters"></el-input>
        </el-form-item>
        <el-form-item label="The message content" prop="content">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="Please enter the message content"
            v-model="messageForm.content"
            :maxlength="2000">
          </el-input>
        </el-form-item>
        <el-form-item label="Send type">
          <el-radio-group v-model="messageForm.send_type">
            <el-radio :label="0">Total station</el-radio>
            <el-radio :label="1">The specified member</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="messageForm.send_type === 1" label="The selected member" prop="member_ids">
          <template v-if="messageForm.member_ids && messageForm.member_ids.length">
            <el-tag
              v-for="(member, index) in messageForm.member_ids"
              :key="member.member_id"
              closable
              @close="handleRemoveMember(index)"
              type="info">
              {{ member.uname }}
            </el-tag>
          </template>
          <el-button v-else size="mini" @click="memberPickerShow = true">Select the member</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitMessageForm('messageForm')">save</el-button>
      </span>
    </el-dialog>
    <en-member-picker
      :show="memberPickerShow"
      @close="memberPickerShow = false"
      @confirm="handleMemberPickerConfirm"/>
  </div>
</template>

<script>
  import * as API_Message from '@/api/message'

  export default {
    name: 'notificationHistory',
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
        // Publish message dialog
        dialogVisible: false,
        // Publish message form
        messageForm: {
          send_type: 0,
          member_ids: []
        },
        // Publish message form rules
        messageRules: {
          title: [this.MixinRequired('Please enter the message title！')],
          content: [this.MixinRequired('Please enter the message content！')],
          member_ids: [{ type: 'array', required: false, message: 'Please select at least one member！' }]
        },
        // Member selector display
        memberPickerShow: false
      }
    },
    mounted() {
      this.GET_MessageList()
    },
    watch: {
      'messageForm.send_type': function(newVal) {
        this.memberPickerShow = !!newVal
        this.messageRules.member_ids[0].required = !!newVal
        if (newVal === 0) {
          this.messageForm.member_ids = []
        }
      }
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_MessageList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_MessageList()
      },

      /** news*/
      handleReleaseMessage() {
        this.messageForm = {
          send_type: 0,
          member_ids: []
        }
        this.dialogVisible = true
      },

      /** Select the member callback*/
      handleMemberPickerConfirm(memberList) {
        this.messageForm.member_ids = memberList
      },
      /** Remove members*/
      handleRemoveMember(index) {
        const { member_ids } = this.messageForm
        member_ids.splice(index, 1)
        this.$set(this.messageForm, 'member_ids', member_ids)
      },

      /** Publish message form submission*/
      submitMessageForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params = this.MixinClone(this.messageForm)
            if (params.send_type === 1) {
              params.member_ids = params.member_ids.map(item => item.member_id)
            } else {
              delete params.member_ids
            }
            API_Message.releaseMessage(params).then(response => {
              this.dialogVisible = false
              this.$message.success('Release success！')
              this.GET_MessageList()
            })
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },

      /** Get a list of Recycle Bin members*/
      GET_MessageList() {
        this.loading = true
        API_Message.getMessageList(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ .el-tag + .el-tag {
    margin-left: 5px;
  }
</style>
