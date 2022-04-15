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
                <el-form-item label="evaluation">
                  <el-select v-model="advancedForm.grade" placeholder="Please select" clearable>
                    <el-option label="Praise" value="good"/>
                    <el-option label="In the evaluation of" value="neutral"/>
                    <el-option label="Bad review" value="bad"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="Reply to state">
                  <el-select v-model="advancedForm.reply_status" placeholder="Please select" clearable>
                    <el-option label="Have to reply" value="1"/>
                    <el-option label="Did not return" value="0"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="If there is a figure">
                  <el-select v-model="advancedForm.have_image" placeholder="Please select" clearable>
                    <el-option label="A figure" :value="true"/>
                    <el-option label="No PIC" :value="false"/>
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
        <el-table-column prop="create_time" :formatter="MixinUnixToDate" label="Comment on the date"/>
        <el-table-column label="evaluation">
          <template slot-scope="scope">{{ scope.row.grade | gradeFilter }}</template>
        </el-table-column>
        <el-table-column prop="content" label="Comment on the content" width="350"/>
        <el-table-column label="Operation" width="250">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.reply_status === 0"
              size="mini"
              type="primary"
              @click="handleReplyComments(scope.$index, scope.row)">reply</el-button>
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
          <span style="color: #409EFF;overflow:hidden;word-break: break-word;">{{ reviewComments.content }}</span>
          <div v-if="reviewComments.images && reviewComments.images.length">
            <a v-for="(image, index) in reviewComments.images" :href="image" :key="index" target="_blank">
              <img :src="image" style="max-width: 150px;height: 80px;display: inline-block;margin-right: 10px">
            </a>
          </div>
        </el-form-item>
        <template v-if="reviewComments.reply_status === 1">
          <el-form-item label="Business reply：">
            <br>
            <span style="color: #FF5722; overflow:hidden;word-break: break-word;">{{ reviewComments.reply.content || 'No reply' }}</span>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogReviewVisible = false">save</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Reply to comment" :visible.sync="replyCommentShow" width="30%">
      <el-form :model="commentForm" :rules="replyRules" ref="commentForm">
        <el-form-item label="Comment on the content" label-width="120px">
          <span style="overflow: hidden;word-break: break-word;">{{commentForm.comment_content}}</span>
        </el-form-item>
        <el-form-item
          label="Review images"
          label-width="120px"
          v-if="commentForm.have_image === 1"
        >
          <el-popover v-for="(imgsrc, index) in commentForm.comment_imgs" :key="index" placement="top" trigger="hover">
            <img slot="reference" :src="imgsrc" style="margin-right:3px;width:50px;height:50px;" />
            <img :src="imgsrc" style="width: 300px;height: 300px;"/>
          </el-popover>
        </el-form-item>
        <el-form-item label="Reply content" label-width="120px" prop="reply_content">
          <el-input
            type="textarea"
            rows="5"
            :maxlength="500"
            v-model="commentForm.reply_content"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="replyCommentShow = false">cancel</el-button>
        <el-button type="primary" @click="saveCommentReply('commentForm')">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_Member from '@/api/member'
  import * as API_comment from '@/api/comment'

  export default {
    name: 'goodsCommentList',
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
        // View comment Dialog
        dialogReviewVisible: false,
        // To view comments
        reviewComments: {},
        // keyword
        keyword: '',
        // Advanced search
        advancedForm: {},
        /** Whether to display a reply（audit）box*/
        replyCommentShow: false,
        /** Bounced form*/
        commentForm: {
          /** commentsid */
          comment_id: '',

          /** If there is a figure*/
          have_image: '',

          /** Comment on the content*/
          comment_content: '',

          /** Array of comment pictures*/
          comment_imgs: [],

          /** Reply content*/
          reply_content: ''
        },
        /** Inspection tools*/
        replyRules: {
          reply_content: [
            { required: true, message: 'The reply must not be empty', trigger: 'blur' },
            { max: 500, message: 'Most replies500A word', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.GET_CommentList()
    },
    filters: {
      gradeFilter(val) {
        switch (val) {
          case 'bad':
            return 'Bad review'
          case 'neutral':
            return 'In the evaluation of'
          default:
            return 'Praise'
        }
      }
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_CommentList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_CommentList()
      },

      /** Search Event Trigger*/
      searchEvent(keyword) {
        this.params.keyword = keyword
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        this.params.page_no = 1
        this.GET_CommentList()
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
        this.GET_CommentList()
      },

      /** See comments for details*/
      handleViewComments(index, row) {
        this.reviewComments = row
        this.dialogReviewVisible = true
      },

      /** Delete the comment*/
      handleDeleteComments(index, row) {
        this.$confirm('Are you sure you want to delete this comment？', 'prompt', { type: 'warning' }).then(() => {
          API_Member.deleteMemberComments(row.comment_id).then(() => {
            this.$message.success('Delete the success！')
            this.GET_CommentList()
          })
        }).catch(() => {})
      },

      /** Reply to comment*/
      handleReplyComments(index, item) {
        this.commentForm = {
          comment_id: item.comment_id,
          isPass: 1,
          have_image: item.have_image,
          comment_content: item.content,
          comment_imgs: item.images,
          reply_content: ''
        }
        this.replyCommentShow = true
      },

      /** Save Comment Reply*/
      saveCommentReply(FormName) {
        this.$refs[FormName].validate(valid => {
          if (valid) {
            API_comment.replyComment(this.commentForm.comment_id, {
              reply: this.commentForm.reply_content
            }).then(() => {
              this.replyCommentShow = false
              this.GET_CommentList()
              this.$message.success('Save success')
            })
          }
        })
      },

      /** Get a comment list*/
      GET_CommentList() {
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
  .goods-name {
    color: #4183c4;
    &:hover { color: #f42424 }
  }
</style>
