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
                <el-form-item label="回复状态">
                  <el-select v-model="advancedForm.reply_status" placeholder="请选择" clearable>
                    <el-option label="已回复" value="1"/>
                    <el-option label="未回复" value="0"/>
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
        <el-table-column prop="create_time" :formatter="MixinUnixToDate" label="咨询日期"/>
        <el-table-column prop="content" label="咨询内容" width="350"/>
        <el-table-column label="审核状态">
          <template slot-scope="scope">{{ scope.row.auth_status | statusFilter }}</template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.auth_status === 'WAIT_AUDIT'"
              size="mini"
              type="primary"
              @click="handleExamine(scope.$index, scope.row)">审核</el-button>
            <el-button
              v-if="scope.row.auth_status === 'PASS_AUDIT'"
              size="mini"
              type="primary"
              :disabled="scope.row.reply_status === 1"
              @click="handleReply(scope.$index, scope.row)">回复</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleViewAsk(scope.$index, scope.row)">查看</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteAsk(scope.$index, scope.row)">删除</el-button>
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
      title="提示"
      :visible.sync="dialogReviewVisible"
      width="50%"
    >
      <el-form ref="reviewAskForm" :model="reviewAsk">
        <el-form-item label="咨询内容：">
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
        <el-button type="primary" @click="dialogReviewVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="回复咨询"
      :visible.sync="dialogReplyVisible"
      width="50%"
    >
      <el-form ref="replyForm" :model="replyForm">
        <el-form-item label="咨询内容：">
          <br>
          <span style="color: #409EFF;overflow:hidden;word-break: break-word;">{{ replyForm.content }}</span>
        </el-form-item>
        <el-form-item
          label="回复内容:"
          prop="reply"
          :rules="{ required: true, message: '请填写回复内容' ,trigger: 'blur' }">
          <el-input type="textarea" :maxlength="500" rows="5" placeholder="回复内容最多500个字" v-model="replyForm.reply"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogReplyVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmReply">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="审核"
      :visible.sync="dialogConsultationAudit"
      width="50%"
    >
      <el-form :model="auditInformation">
        <el-form-item label="咨询人名称：">
          <span>{{auditInformation.member_name}}</span>
        </el-form-item>
        <el-form-item label="商品名称：">
          <a :href="MixinBuyerDomain + '/goods/' + auditInformation.goods_id" class="goods-name" target="_blank">{{auditInformation.goods_name}}</a>
        </el-form-item>
        <el-form-item label="咨询日期">
          <span>{{auditInformation.create_time | unixToDate}}</span>
        </el-form-item>
        <el-form-item label="咨询内容">
          <span style="word-break:break-all;">{{auditInformation.content}}</span>
        </el-form-item>
        <el-form-item label="审核：">
          <el-radio v-model="auth_status" label="PASS_AUDIT">审核通过</el-radio>
          <el-radio v-model="auth_status" label="REFUSE_AUDIT">审核拒绝</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitExamine" >审核</el-button>
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
        // 列表loading状态
        loading: false,
        // 列表参数
        params: {
          page_no: 1,
          page_size: 10
        },
        // 列表数据
        tableData: '',
        // 查看的详情
        reviewAsk: {},
        /** 回复表单 */
        replyForm: {
          /** 咨询问题 */
          content: '',

          /** 回复内容 */
          reply: ''
        },
        // 查看详情 dialog
        dialogReviewVisible: false,
        // 回复框操作 dialog
        dialogReplyVisible: false,
        // 关键字
        keyword: '',
        // 高级搜索
        advancedForm: {},
        // 审核 dialog
        dialogConsultationAudit: false,
        // 审核信息
        auditInformation: {},
        // 审核状态
        auth_status: 'PASS_AUDIT'
      }
    },
    mounted() {
      this.GET_AskList()
    },
    filters: {
      statusFilter(val) {
        switch (val) {
          case 'WAIT_AUDIT': return '审核中'
          case 'PASS_AUDIT': return '审核通过'
          case 'REFUSE_AUDIT': return '审核未通过'
        }
      }
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_AskList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_AskList()
      },

      /** 查看咨询详情 */
      handleViewAsk(index, row) {
        this.reviewAsk = row
        this.dialogReviewVisible = true
      },

      /** 回复 */
      handleReply(index, row) {
        this.dialogReplyVisible = true
        this.replyForm = {
          ask_id: row.ask_id,
          /** 咨询问题 */
          content: row.content,

          /** 回复内容 */
          reply: row.reply
        }
      },

      /** 确认回复 */
      confirmReply() {
        this.$refs['replyForm'].validate((valid) => {
          if (valid) {
            const _params = {
              reply_content: this.replyForm.reply
            }
            API_Member.replyConsultationList(this.replyForm.ask_id, _params).then(() => {
              this.$message.success('回复成功')
              this.dialogReplyVisible = false
              this.GET_AskList()
            })
          }
        })
      },
      /** 查看审核 */
      handleExamine(index, row) {
        this.auditInformation = row
        this.dialogConsultationAudit = true
      },
      /** 提交咨询审核 */
      submitExamine() {
        API_Member.examineConsultation(this.auditInformation.ask_id, this.auth_status).then(respone => {
          this.$message.success('审核成功！')
          this.dialogConsultationAudit = false
          this.GET_AskList()
        }).catch(() => {})
      },
      /** 删除咨询 */
      handleDeleteAsk(index, row) {
        this.$confirm('确定要删除这条咨询吗？', '提示', { type: 'warning' }).then(() => {
          API_Member.deleteMemberAsk(row.ask_id).then(() => {
            this.$message.success('删除成功！')
            this.GET_AskList()
          })
        }).catch(() => {})
      },

      /** 回复时间 */
      replyLabel() {
        const ask = this.reviewAsk
        return `商家于[${Foundation.unixToDate(ask.reply_time)}]${ask.reply_status === 1 ? '审核通过' : '审核未通过'}并回复：`
      },

      /** 搜索事件触发 */
      searchEvent(keyword) {
        this.params.keyword = keyword
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        this.params.page_no = 1
        this.GET_AskList()
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
        this.GET_AskList()
      },

      /** 获取咨询列表 */
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
