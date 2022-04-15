<template>
  <div>
    <en-table-layout
      :toolbar="false"
      :tableData="tableData.data"
      :loading="loading"
    >
      <template slot="table-columns">
        <el-table-column prop="create_time" :formatter="MixinUnixToDate" label="The date"/>
        <el-table-column prop="content" label="Consulting content" width="500"/>
        <el-table-column label="Review the status">
          <template slot-scope="scope">{{ scope.row.auth_status | statusFilter }}</template>
        </el-table-column>
        <el-table-column label="Operation" width="150">
          <template slot-scope="scope">
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
      title="See consulting details"
      :visible.sync="dialogReviewVisible"
      width="50%"
    >
      <el-form :model="reviewAsk">
        <el-form-item label="Consulting content：">
          <br>
          <span style="color: #409EFF">{{ reviewAsk.content }}</span>
        </el-form-item>
        <template v-if="reviewAsk.reply_status === 1">
          <el-form-item :label="replyLabel(reviewAsk)">
            <br>
            <span style="color: #FF5722">{{ reviewAsk.reply }}</span>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogReviewVisible = false">save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_Member from '@/api/member'
  import { Foundation } from '~/ui-utils'

  export default {
    name: 'memberListAsk',
    props: ['member-id'],
    data() {
      return {
        // List loading status
        loading: false,
        // A list of parameters
        params: {
          page_no: 1,
          page_size: 10,
          member_id: this.memberId
        },
        // The list of data
        tableData: '',
        // View Consultation Dialog
        dialogReviewVisible: false,
        // View details
        reviewAsk: {}
      }
    },
    mounted() {
      this.GET_MemberListAsk()
    },
    watch: {
      memberId() {
        this.params.member_id = this.memberId
        this.GET_MemberListAsk()
      }
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
        this.GET_MemberListAsk()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_MemberListAsk()
      },

      /** Check the consulting*/
      handleViewAsk(index, row) {
        this.reviewAsk = row
        this.dialogReviewVisible = true
      },

      /** Delete the consulting*/
      handleDeleteAsk(index, row) {
        this.$confirm('Are you sure you want to delete this consultation？', 'prompt', { type: 'warning' }).then(() => {
          API_Member.deleteMemberAsk(row.ask_id).then(() => {
            this.$message.success('Delete the success！')
            this.GET_MemberListAsk()
          })
        }).catch(() => {})
      },

      /** Recovery time*/
      replyLabel() {
        const ask = this.reviewAsk
        return `Businesses in[${Foundation.unixToDate(ask.reply_time)}]${ask.reply_status === 1 ? 'approved' : 'The audit is not approved.'}And the reply：`
      },

      /** Get a list of member inquiries*/
      GET_MemberListAsk() {
        this.loading = true
        API_Member.getMemberAsks(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>
