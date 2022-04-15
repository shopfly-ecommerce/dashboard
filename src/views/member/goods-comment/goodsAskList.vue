<template>
  <div>
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns"></div>
        <div class="toolbar-search">
          <en-table-search
            @search="searchEvent"
            @advancedSearch="advancedSearchEvent"
            advanced
          >
            <template slot="advanced-content">
              <el-form ref="advancedForm" :model="advancedForm" label-width="80px">
                <el-form-item label="Name">
                  <el-input size="medium" v-model="advancedForm.goods_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="Member name">
                  <el-input size="medium" v-model="advancedForm.member_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="Reply to state">
                  <el-select v-model="advancedForm.reply_status" placeholder="Please select" clearable>
                    <el-option label="Have to reply" value="1"/>
                    <el-option label="Did not return" value="0"/>
                  </el-select>
                </el-form-item>
              </el-form>
            </template>
          </en-table-search>
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column prop="member_name" label="Member name"/>
        <el-table-column label="Name">
          <template slot-scope="scope">
            <a :href="MixinBuyerDomain + '/goods/' + scope.row.goods_id" class="goods-name" target="_blank">{{ scope.row.goods_name }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" :formatter="MixinUnixToDate" label="The date"/>
        <el-table-column prop="content" label="Consulting content" width="350"/>
        <el-table-column label="Review the status">
          <template slot-scope="scope">{{ scope.row.auth_status | statusFilter }}</template>
        </el-table-column>
        <el-table-column label="Operation" width="300">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.auth_status === 'WAIT_AUDIT'"
              size="mini"
              type="primary"
              @click="handleExamine(scope.$index, scope.row)">audit</el-button>
            <el-button
              v-if="scope.row.auth_status === 'PASS_AUDIT'"
              size="mini"
              type="primary"
              :disabled="scope.row.reply_status === 1"
              @click="handleReply(scope.$index, scope.row)">reply</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleViewAsk(scope.$index, scope.row)">To view</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteAsk(scope.$index, scope.row)">delete</el-button>
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
      title="prompt"
      :visible.sync="dialogReviewVisible"
      width="50%"
    >
      <el-form ref="reviewAskForm" :model="reviewAsk">
        <el-form-item label="Consulting content：">
          <br>
          <span style="color: #409EFF;overflow:hidden;word-break: break-word;">{{ reviewAsk.content }}</span>
        </el-form-item>
        <template v-if="reviewAsk.reply_status === 1">
          <el-form-item :label="replyLabel()">
            <br>
            <span style="color: #FF5722;overflow:hidden;word-break: break-word;">{{ reviewAsk.reply }}</span>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogReviewVisible = false">save</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Reply to consulting"
      :visible.sync="dialogReplyVisible"
      width="50%"
    >
      <el-form ref="replyForm" :model="replyForm">
        <el-form-item label="Consulting content：">
          <br>
          <span style="color: #409EFF;overflow:hidden;word-break: break-word;">{{ replyForm.content }}</span>
        </el-form-item>
        <el-form-item
          label="Reply content:"
          prop="reply"
          :rules="{ required: true, message: 'Please fill in the reply' ,trigger: 'blur' }">
          <el-input type="textarea" :maxlength="500" rows="5" placeholder="Most replies500A word" v-model="replyForm.reply"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogReplyVisible = false">cancel</el-button>
        <el-button type="primary" @click="confirmReply">save</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="audit"
      :visible.sync="dialogConsultationAudit"
      width="50%"
    >
      <el-form :model="auditInformation">
        <el-form-item label="Name of consultant：">
          <span>{{auditInformation.member_name}}</span>
        </el-form-item>
        <el-form-item label="Name：">
          <a :href="MixinBuyerDomain + '/goods/' + auditInformation.goods_id" class="goods-name" target="_blank">{{auditInformation.goods_name}}</a>
        </el-form-item>
        <el-form-item label="The date">
          <span>{{auditInformation.create_time | unixToDate}}</span>
        </el-form-item>
        <el-form-item label="Consulting content">
          <span style="word-break:break-all;">{{auditInformation.content}}</span>
        </el-form-item>
        <el-form-item label="audit：">
          <el-radio v-model="auth_status" label="PASS_AUDIT">approved</el-radio>
          <el-radio v-model="auth_status" label="REFUSE_AUDIT">Audit refused to</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitExamine" >audit</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_Member from '@/api/member'
  import { Foundation } from '~/ui-utils'

  export default {
    name: 'goodsAskList',
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
        // View details
        reviewAsk: {},
        /** Reply form*/
        replyForm: {
          /** Ask questions*/
          content: '',

          /** Reply content*/
          reply: ''
        },
        // Dialog for details
        dialogReviewVisible: false,
        // The reply box manipulates the dialog
        dialogReplyVisible: false,
        // keyword
        keyword: '',
        // Advanced search
        advancedForm: {},
        // Review the dialog
        dialogConsultationAudit: false,
        // Audit information
        auditInformation: {},
        // Review the status
        auth_status: 'PASS_AUDIT'
      }
    },
    mounted() {
      this.GET_AskList()
    },
    filters: {
      statusFilter(val) {
        switch (val) {
          case 'WAIT_AUDIT': return 'In the review'
          case 'PASS_AUDIT': return 'approved'
          case 'REFUSE_AUDIT': return 'The audit is not approved.'
        }
      }
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_AskList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_AskList()
      },

      /** See consulting details*/
      handleViewAsk(index, row) {
        this.reviewAsk = row
        this.dialogReviewVisible = true
      },

      /** reply*/
      handleReply(index, row) {
        this.dialogReplyVisible = true
        this.replyForm = {
          ask_id: row.ask_id,
          /** Ask questions*/
          content: row.content,

          /** Reply content*/
          reply: row.reply
        }
      },

      /** Confirmation reply*/
      confirmReply() {
        this.$refs['replyForm'].validate((valid) => {
          if (valid) {
            const _params = {
              reply_content: this.replyForm.reply
            }
            API_Member.replyConsultationList(this.replyForm.ask_id, _params).then(() => {
              this.$message.success('Reply to success')
              this.dialogReplyVisible = false
              this.GET_AskList()
            })
          }
        })
      },
      /** View audit*/
      handleExamine(index, row) {
        this.auditInformation = row
        this.dialogConsultationAudit = true
      },
      /** Submit for consultation and review*/
      submitExamine() {
        API_Member.examineConsultation(this.auditInformation.ask_id, this.auth_status).then(respone => {
          this.$message.success('Review the success！')
          this.dialogConsultationAudit = false
          this.GET_AskList()
        }).catch(() => {})
      },
      /** Delete the consulting*/
      handleDeleteAsk(index, row) {
        this.$confirm('Are you sure you want to delete this consultation？', 'prompt', { type: 'warning' }).then(() => {
          API_Member.deleteMemberAsk(row.ask_id).then(() => {
            this.$message.success('Delete the success！')
            this.GET_AskList()
          })
        }).catch(() => {})
      },

      /** Recovery time*/
      replyLabel() {
        const ask = this.reviewAsk
        return `Businesses in[${Foundation.unixToDate(ask.reply_time)}]${ask.reply_status === 1 ? 'approved' : 'The audit is not approved.'}And the reply：`
      },

      /** Search Event Trigger*/
      searchEvent(keyword) {
        this.params.keyword = keyword
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        this.params.page_no = 1
        this.GET_AskList()
      },

      /** Advanced search event triggered*/
      advancedSearchEvent() {
        const { advancedForm } = this
        Object.keys(advancedForm).forEach(key => {
          if (advancedForm[key] !== undefined) {
            this.params[key] = advancedForm[key]
          }
        })
        delete this.params.keyword
        this.params.page_no = 1
        this.GET_AskList()
      },

      /** Get a consultation list*/
      GET_AskList() {
        this.loading = true
        API_Member.getMemberAsks(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .goods-name {
    color: #4183c4;
    &:hover { color: #f42424 }
  }
</style>
