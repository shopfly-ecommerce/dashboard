<template>
  <div>
    <en-table-layout
      :table-data="tableData.data"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddSmtp">add</el-button>
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column prop="host" label="HOST"/>
        <el-table-column prop="username" label="Username"/>
        <el-table-column prop="send_count" label="Number of letters sent today"/>
        <el-table-column prop="max_count" label="Maximum number of messages sent"/>
        <el-table-column prop="mail_from" label="Form"/>
        <el-table-column label="Operation" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditSmtp(scope.$index, scope.row)">edit</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteSmtp(scope.$index, scope.row)">delete</el-button>
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
      :title="smtpForm.id ? 'SMTP Server' : 'SMTP Server'"
      :visible.sync="dialogSmtpVisible"
      @close="handleDialogClosed"
      width="550px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="smtpForm" :rules="smtpRules" ref="smtpForm" size="small" label-width="200px">
        <el-form-item label="HOST" prop="host">
          <el-input v-model="smtpForm.host"/>
        </el-form-item>
        <el-form-item label="PORT" prop="port">
          <el-input v-model="smtpForm.port"/>
        </el-form-item>
        <el-form-item label="EnableSSL" prop="open_ssl">
          <el-radio-group v-model="smtpForm.open_ssl">
            <el-radio :label="1">open</el-radio>
            <el-radio :label="0">close</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Username" prop="username">
          <el-input v-model="smtpForm.username"/>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input type="password" v-model="smtpForm.password"/>
        </el-form-item>
        <el-form-item label="Maximum per day" prop="max_count">
          <el-input v-model="smtpForm.max_count"/>
        </el-form-item>
        <el-form-item label="Sender email" prop="mail_from">
          <el-input v-model="smtpForm.mail_from"/>
        </el-form-item>
        <el-form-item label="test" :error="test_email_error">
          <el-input v-model="test_email">
            <el-button slot="append" @click="handleSendTestEmail">
              <svg-icon icon-class="send" style="margin-right: 2px" />Test
            </el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSmtpVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitSmtpForm('smtpForm')">save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_Smtp from '@/api/smtp'
  import { RegExp } from '~/ui-utils'

  export default {
    name: 'smtpSettings',
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
        /** smtp The form*/
        smtpForm: {},
        /** smtp Rules of the form*/
        smtpRules: {
          host: [this.MixinRequired('Please enter theHOST！')],
          port: [
            this.MixinRequired('Please enter thePORT！'),
            { validator: (rule, value, callback) => {
              RegExp.integer.test(value) ? callback() : callback(new Error('PORTShould be positive integer！'))
            } }
          ],
          username: [this.MixinRequired('Please enter the user name！')],
          password: [this.MixinRequired('Please enter your password.！')],
          max_count: [
            this.MixinRequired('Please enter the maximum number of messages per day！'),
            { validator: (rule, value, callback) => {
              RegExp.integer.test(value) ? callback() : callback(new Error('The number of messages sent should be a positive integer！'))
            } }
          ],
          mail_from: [
            this.MixinRequired('Please enter your email address！'),
            { validator: (rule, value, callback) => {
              RegExp.email.test(value) ? callback() : callback(new Error('The email box is incorrectly formatted！'))
            } }
          ]
        },
        /** smtpThe formdialog */
        dialogSmtpVisible: false,
        /** Test email*/
        test_email: '',
        /** Test mail error messages*/
        test_email_error: ''
      }
    },
    mounted() {
      this.GET_SmtpList()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_SmtpList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_SmtpList()
      },

      /** dialogClose the callback*/
      handleDialogClosed() {
        this.$refs.smtpForm.clearValidate()
      },

      /** addsmtp */
      handleAddSmtp() {
        this.smtpForm = { open_ssl: 1 }
        const { smtpForm } = this.$refs
        smtpForm && smtpForm.resetFields()
        this.dialogSmtpVisible = true
      },

      /** editsmtp */
      handleEditSmtp(index, row) {
        this.smtpForm = this.MixinClone(row)
        this.dialogSmtpVisible = true
      },

      /** deletesmtp */
      handleDeleteSmtp(index, row) {
        this.$confirm('Make sure you delete thisSMTP?？', 'prompt', { type: 'warning' }).then(() => {
          API_Smtp.deleteSmtp(row.id).then(() => {
            this.$message.success('Delete the success！')
            this.GET_SmtpList()
          })
        }).catch(() => {})
      },

      /** Submission issmtpThe form*/
      submitSmtpForm(formName) {
        this.$refs[formName].validate(valid => {
          const { id } = this.smtpForm
          if (valid) {
            if (id) {
              API_Smtp.editSmtp(id, this.smtpForm).then(response => {
                this.dialogSmtpVisible = false
                this.$message.success('Modify the success！')
                this.MixinSetTableData(this.tableData, 'id', id, response)
              })
            } else {
              API_Smtp.addSmtp(this.smtpForm).then(response => {
                this.dialogSmtpVisible = false
                this.$message.success('Save success！')
                this.GET_SmtpList()
              })
            }
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },

      /** Send a test email*/
      handleSendTestEmail() {
        const { test_email, smtpForm } = this
        this.$refs['smtpForm'].validate(valid => {
          if (valid) {
            if (!RegExp.email.test(test_email)) {
              this.test_email_error = 'Incorrect email address format！'
              return false
            }
            this.test_email_error = ''
            const params = { ...smtpForm, email: test_email }
            API_Smtp.sendTestEmail(params).then(response => {
              this.$message.success('The test email has been sent successfully, please check！')
            })
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },

      /** To obtainsmtpThe list of*/
      GET_SmtpList() {
        this.loading = true
        API_Smtp.getSmtpList(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
</script>
