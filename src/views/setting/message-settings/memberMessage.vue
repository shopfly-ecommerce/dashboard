<template>
  <div>
    <en-table-layout
      :toolbar="false"
      :tableData="tableData.data"
      :loading="loading"
    >
      <template slot="table-columns">
        <el-table-column prop="tpl_code" label="Message template code"/>
        <el-table-column prop="tpl_name" label="Message template name"/>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditSiteMessage(scope.$index, scope.row)">Stand inside letter</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleEditSmsMessage(scope.$index, scope.row)">SMS</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleEditEmailMessage(scope.$index, scope.row)">mail</el-button>
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
      title="Modify the message template"
      :visible.sync="dialogVisible" width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="messageForm" label-width="130px">
        <template v-if="type === 'SITE'">
          <el-form-item label="Station message open status">
            <el-radio v-model="messageForm.notice_state" label="OPEN">open</el-radio>
            <el-radio v-model="messageForm.notice_state" label="CLOSED">close</el-radio>
          </el-form-item>
          <el-form-item label="Content of the message template within the site">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              v-model="messageForm.content"
              :maxlength="225"
            ></el-input>
          </el-form-item>
        </template>
        <template v-if="type === 'SMS'">
          <el-form-item label="SMS enabled status">
            <el-radio v-model="messageForm.sms_state" label="OPEN">open</el-radio>
            <el-radio v-model="messageForm.sms_state" label="CLOSED">close</el-radio>
          </el-form-item>
          <el-form-item label="Text message template content">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              v-model="messageForm.sms_content"
              :maxlength="225"
            ></el-input>
          </el-form-item>
        </template>
        <template v-if="type === 'EMAILL'">
          <el-form-item label="Email open status">
            <el-radio v-model="messageForm.email_state" label="OPEN">open</el-radio>
            <el-radio v-model="messageForm.email_state" label="CLOSED">close</el-radio>
          </el-form-item>
          <el-form-item label="Mail template content">
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
        <el-button @click="dialogVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitMessageTemplate">save</el-button>
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
        // List loading status
        loading: false,
        // A list of parameters
        params: {
          page_no: 1,
          page_size: 10,
          type: 'MEMBER'
        },
        // Modify the type
        type: 'SITE',
        // The list of data
        tableData: '',
        // Message template form
        messageForm: {},
        // Message template dialog
        dialogVisible: false
      }
    },
    mounted() {
      this.GET_MessageSettingList()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_MessageSettingList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_MessageSettingList()
      },

      /** Set up the station message*/
      handleEditSiteMessage(index, row) {
        this.type = 'SITE'
        this.messageForm = this.MixinClone(row)
        this.dialogVisible = true
      },
      /** Set the message*/
      handleEditSmsMessage(index, row) {
        this.type = 'SMS'
        this.messageForm = this.MixinClone(row)
        this.dialogVisible = true
      },
      /** Set up the mail*/
      handleEditEmailMessage(index, row) {
        this.type = 'EMAILL'
        this.messageForm = this.MixinClone(row)
        this.dialogVisible = true
      },

      /** Submit the message template form*/
      submitMessageTemplate() {
        const { id } = this.messageForm
        API_Message.editMessageTemplate(id, this.messageForm).then(response => {
          this.dialogVisible = false
          this.$message.success('Message template modified successfully！')
          this.MixinSetTableData(this.tableData, 'id', id, response)
        })
      },

      /** Gets the list of SMS gateways*/
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
