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
                <el-form-item label="商品名称">
                  <el-input size="medium" v-model="advancedForm.goods_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="会员名称">
                  <el-input size="medium" v-model="advancedForm.member_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="评价">
                  <el-select v-model="advancedForm.grade" placeholder="请选择" clearable>
                    <el-option label="好评" value="good"/>
                    <el-option label="中评" value="neutral"/>
                    <el-option label="差评" value="bad"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="回复状态">
                  <el-select v-model="advancedForm.reply_status" placeholder="请选择" clearable>
                    <el-option label="已回复" value="1"/>
                    <el-option label="未回复" value="0"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否有图">
                  <el-select v-model="advancedForm.have_image" placeholder="请选择" clearable>
                    <el-option label="有图" :value="true"/>
                    <el-option label="无图" :value="false"/>
                  </el-select>
                </el-form-item>
              </el-form>
            </template>
          </en-table-search>
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column prop="member_name" label="会员名称"/>
        <el-table-column label="商品名称">
          <template slot-scope="scope">
            <a :href="MixinBuyerDomain + '/goods/' + scope.row.goods_id" class="goods-name" target="_blank">{{ scope.row.goods_name }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" :formatter="MixinUnixToDate" label="评论日期"/>
        <el-table-column label="评价">
          <template slot-scope="scope">{{ scope.row.grade | gradeFilter }}</template>
        </el-table-column>
        <el-table-column prop="content" label="评论内容" width="350"/>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.reply_status === 0"
              size="mini"
              type="primary"
              @click="handleReplyComments(scope.$index, scope.row)">回复</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleViewComments(scope.$index, scope.row)">查看</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteComments(scope.$index, scope.row)">删除</el-button>
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
      title="查看评论详情"
      :visible.sync="dialogReviewVisible"
      width="50%"
    >
      <el-form :model="reviewComments">
        <el-form-item label="评论内容：">
          <br>
          <span style="color: #409EFF;overflow:hidden;word-break: break-word;">{{ reviewComments.content }}</span>
          <div v-if="reviewComments.images && reviewComments.images.length">
            <a v-for="(image, index) in reviewComments.images" :href="image" :key="index" target="_blank">
              <img :src="image" style="max-width: 150px;height: 80px;display: inline-block;margin-right: 10px">
            </a>
          </div>
        </el-form-item>
        <template v-if="reviewComments.reply_status === 1">
          <el-form-item label="商家回复：">
            <br>
            <span style="color: #FF5722; overflow:hidden;word-break: break-word;">{{ reviewComments.reply.content || '暂无回复' }}</span>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogReviewVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="回复评论" :visible.sync="replyCommentShow" width="30%">
      <el-form :model="commentForm" :rules="replyRules" ref="commentForm">
        <el-form-item label="评论内容" label-width="120px">
          <span style="overflow: hidden;word-break: break-word;">{{commentForm.comment_content}}</span>
        </el-form-item>
        <el-form-item
          label="评论图片"
          label-width="120px"
          v-if="commentForm.have_image === 1"
        >
          <el-popover v-for="(imgsrc, index) in commentForm.comment_imgs" :key="index" placement="top" trigger="hover">
            <img slot="reference" :src="imgsrc" style="margin-right:3px;width:50px;height:50px;" />
            <img :src="imgsrc" style="width: 300px;height: 300px;"/>
          </el-popover>
        </el-form-item>
        <el-form-item label="回复内容" label-width="120px" prop="reply_content">
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
        <el-button @click="replyCommentShow = false">取 消</el-button>
        <el-button type="primary" @click="saveCommentReply('commentForm')">确 定</el-button>
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
        // 列表loading状态
        loading: false,
        // 列表参数
        params: {
          page_no: 1,
          page_size: 10
        },
        // 列表数据
        tableData: '',
        // 查看评论 dialog
        dialogReviewVisible: false,
        // 查看评论
        reviewComments: {},
        // 关键字
        keyword: '',
        // 高级搜索
        advancedForm: {},
        /** 是否显示回复（审核）框*/
        replyCommentShow: false,
        /** 弹框 表单*/
        commentForm: {
          /** 评论id */
          comment_id: '',

          /** 是否有图 */
          have_image: '',

          /** 评论内容 */
          comment_content: '',

          /** 评论图片数组 */
          comment_imgs: [],

          /** 回复内容 */
          reply_content: ''
        },
        /** 检验工具 */
        replyRules: {
          reply_content: [
            { required: true, message: '回复内容不可为空', trigger: 'blur' },
            { max: 500, message: '回复内容最多500个字', trigger: 'blur' }
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
            return '差评'
          case 'neutral':
            return '中评'
          default:
            return '好评'
        }
      }
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_CommentList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_CommentList()
      },

      /** 搜索事件触发 */
      searchEvent(keyword) {
        this.params.keyword = keyword
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        this.params.page_no = 1
        this.GET_CommentList()
      },

      /** 高级搜索事件触发 */
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

      /** 查看评论详情 */
      handleViewComments(index, row) {
        this.reviewComments = row
        this.dialogReviewVisible = true
      },

      /** 删除评论 */
      handleDeleteComments(index, row) {
        this.$confirm('确定要删除这条评论吗？', '提示', { type: 'warning' }).then(() => {
          API_Member.deleteMemberComments(row.comment_id).then(() => {
            this.$message.success('删除成功！')
            this.GET_CommentList()
          })
        }).catch(() => {})
      },

      /** 回复评论 */
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

      /** 保存评论回复*/
      saveCommentReply(FormName) {
        this.$refs[FormName].validate(valid => {
          if (valid) {
            API_comment.replyComment(this.commentForm.comment_id, {
              reply: this.commentForm.reply_content
            }).then(() => {
              this.replyCommentShow = false
              this.GET_CommentList()
              this.$message.success('保存成功')
            })
          }
        })
      },

      /** 获取评论列表 */
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
