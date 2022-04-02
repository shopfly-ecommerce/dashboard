<template>
  <div>
    <en-table-layout
      :toolbar="false"
      :tableData="tableData.data"
      :loading="loading"
    >
      <template slot="table-columns">
        <el-table-column prop="tpl_code" label="消息模板代码"/>
        <el-table-column prop="tpl_name" label="消息模板名称"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditSiteMessage(scope.$index, scope.row)">站内信</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleEditSmsMessage(scope.$index, scope.row)">短信</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleEditEmailMessage(scope.$index, scope.row)">邮件</el-button>
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
      title="修改消息模板"
      :visible.sync="dialogVisible" width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="messageForm" label-width="130px">
        <template v-if="type === 'SITE'">
          <el-form-item label="站内消息开启状态">
            <el-radio v-model="messageForm.notice_state" label="OPEN">开启</el-radio>
            <el-radio v-model="messageForm.notice_state" label="CLOSED">关闭</el-radio>
          </el-form-item>
          <el-form-item label="站内消息模板内容">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              v-model="messageForm.content"
              :maxlength="225"
            ></el-input>
          </el-form-item>
        </template>
        <template v-if="type === 'SMS'">
          <el-form-item label="短信开启状态">
            <el-radio v-model="messageForm.sms_state" label="OPEN">开启</el-radio>
            <el-radio v-model="messageForm.sms_state" label="CLOSED">关闭</el-radio>
          </el-form-item>
          <el-form-item label="短信模板内容">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              v-model="messageForm.sms_content"
              :maxlength="225"
            ></el-input>
          </el-form-item>
        </template>
        <template v-if="type === 'EMAILL'">
          <el-form-item label="邮件开启状态">
            <el-radio v-model="messageForm.email_state" label="OPEN">开启</el-radio>
            <el-radio v-model="messageForm.email_state" label="CLOSED">关闭</el-radio>
          </el-form-item>
          <el-form-item label="邮件模板内容">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              v-model="messageForm.email_content"
              :maxlength="225"
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitMessageTemplate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_Message from '@/api/message'

  export default {
    name: 'memberMessage',
    data() {
      return {
        // 列表loading状态
        loading: false,
        // 列表参数
        params: {
          page_no: 1,
          page_size: 10,
          type: 'MEMBER'
        },
        // 修改类型
        type: 'SITE',
        // 列表数据
        tableData: '',
        // 消息模板 表单
        messageForm: {},
        // 消息模板 dialog
        dialogVisible: false
      }
    },
    mounted() {
      this.GET_MessageSettingList()
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_MessageSettingList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_MessageSettingList()
      },

      /** 设置站内信 */
      handleEditSiteMessage(index, row) {
        this.type = 'SITE'
        this.messageForm = this.MixinClone(row)
        this.dialogVisible = true
      },
      /** 设置短信 */
      handleEditSmsMessage(index, row) {
        this.type = 'SMS'
        this.messageForm = this.MixinClone(row)
        this.dialogVisible = true
      },
      /** 设置邮件 */
      handleEditEmailMessage(index, row) {
        this.type = 'EMAILL'
        this.messageForm = this.MixinClone(row)
        this.dialogVisible = true
      },

      /** 提交消息模板表单 */
      submitMessageTemplate() {
        const { id } = this.messageForm
        API_Message.editMessageTemplate(id, this.messageForm).then(response => {
          this.dialogVisible = false
          this.$message.success('消息模板修改成功！')
          this.MixinSetTableData(this.tableData, 'id', id, response)
        })
      },

      /** 获取短信网关列表 */
      GET_MessageSettingList() {
        this.loading = true
        API_Message.getMessageTemplate(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>
