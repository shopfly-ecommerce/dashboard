<template>
  <div>
    <en-table-layout
      :pagination="true"
      :tableData="tableData.data"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleReleaseMessage">发送</el-button>
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column prop="title" label="消息标题"/>
        <el-table-column prop="send_type" label="发送类型"/>
        <el-table-column prop="send_time" :formatter="MixinUnixToDate" label="发送时间"/>
        <el-table-column prop="content" label="消息内容" width="500"/>
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
      title="发送站内消息"
      :visible.sync="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="messageForm" :rules="messageRules" ref="messageForm" label-width="100px">
        <el-form-item label="消息标题" prop="title">
          <el-input v-model="messageForm.title" :maxlength="20" placeholder="标题在20字以内"></el-input>
        </el-form-item>
        <el-form-item label="消息内容" prop="content">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入消息内容"
            v-model="messageForm.content"
            :maxlength="2000">
          </el-input>
        </el-form-item>
        <el-form-item label="发送类型">
          <el-radio-group v-model="messageForm.send_type">
            <el-radio :label="0">全站</el-radio>
            <el-radio :label="1">指定会员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="messageForm.send_type === 1" label="已选会员" prop="member_ids">
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
          <el-button v-else size="mini" @click="memberPickerShow = true">选择会员</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitMessageForm('messageForm')">确 定</el-button>
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
        // 列表loading状态
        loading: false,
        // 列表参数
        params: {
          page_no: 1,
          page_size: 10
        },
        // 列表数据
        tableData: '',
        // 发布消息 dialog
        dialogVisible: false,
        // 发布消息 表单
        messageForm: {
          send_type: 0,
          member_ids: []
        },
        // 发布消息 表单规则
        messageRules: {
          title: [this.MixinRequired('请输入消息标题！')],
          content: [this.MixinRequired('请输入消息内容！')],
          member_ids: [{ type: 'array', required: false, message: '请至少选择一个会员！' }]
        },
        // 会员选择器显示
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
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_MessageList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_MessageList()
      },

      /** 发布消息 */
      handleReleaseMessage() {
        this.messageForm = {
          send_type: 0,
          member_ids: []
        }
        this.dialogVisible = true
      },

      /** 选择会员回调 */
      handleMemberPickerConfirm(memberList) {
        this.messageForm.member_ids = memberList
      },
      /** 移除会员 */
      handleRemoveMember(index) {
        const { member_ids } = this.messageForm
        member_ids.splice(index, 1)
        this.$set(this.messageForm, 'member_ids', member_ids)
      },

      /** 发布消息 表单提交 */
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
              this.$message.success('发布成功！')
              this.GET_MessageList()
            })
          } else {
            this.$message.error('表单填写有误，请检查！')
            return false
          }
        })
      },

      /** 获取回收站会员列表 */
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
