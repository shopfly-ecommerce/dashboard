<template>
  <div>
    <en-table-layout
      :toolbar="false"
      :tableData="tableData.data"
      :loading="loading"
    >
      <template slot="table-columns">
        <el-table-column prop="create_time" :formatter="MixinUnixToDate" label="Comment on the date"/>
        <el-table-column prop="content" label="Comment on the content" width="500"/>
        <!-- <el-table-column label="Review the status">
          <template slot-scope="scope">{{ scope.row.status | statusFilter }}</template>
        </el-table-column> -->
        <el-table-column label="Operation" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleViewComments(scope.$index, scope.row)">To view</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteComments(scope.$index, scope.row)">delete</el-button>
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
      title="See comments for details"
      :visible.sync="dialogReviewVisible"
      width="50%"
    >
      <el-form :model="reviewComments">
        <el-form-item label="Comment on the content：">
          <br>
          <span style="color: #409EFF">{{ reviewComments.content }}</span>
          <div v-if="reviewComments.images && reviewComments.images.length">
            <img v-for="image in reviewComments.images" :src="image.url" class="comments-image">
          </div>
        </el-form-item>
        <template v-if="reviewComments.reply_status === 1">
          <el-form-item label="Business reply：">
            <br>
            <span style="color: #FF5722">{{ reviewComments.reply.content || 'No reply' }}</span>
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

  export default {
    name: 'memberListComments',
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
        // View comment Dialog
        dialogReviewVisible: false,
        // To view comments
        reviewComments: {}
      }
    },
    mounted() {
      this.GET_MemberListComments()
    },
    filters: {
      statusFilter(val) {
        switch (val) {
          case 0: return 'In the review'
          case 1: return 'approved'
          case 2: return 'The audit is not approved.'
        }
      }
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_MemberListComments()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_MemberListComments()
      },

      /** To view comments*/
      handleViewComments(index, row) {
        this.reviewComments = row
        this.dialogReviewVisible = true
      },

      /** Delete the comment*/
      handleDeleteComments(index, row) {
        this.$confirm('Are you sure you want to delete this comment？', 'prompt', { type: 'warning' }).then(() => {
          API_Member.deleteMemberComments(row.comment_id).then(() => {
            this.$message.success('Delete the success！')
            this.GET_MemberListComments()
          })
        }).catch(() => {})
      },

      /** Get a list of member inquiries*/
      GET_MemberListComments() {
        this.loading = true
        API_Member.getMemberComments(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .comments-image {
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 10px;
  }
</style>
