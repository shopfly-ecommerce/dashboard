<template>
  <div>
    <en-table-layout
      toolbar
      pagination
      :tableData="tableData"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns"></div>
        <div class="toolbar-search">
          <en-table-search
            @search="searchEvent"
            @advancedSearch="advancedSearchEvent"
            advanced
            advancedWidth="465"
            placeholder="请输入商品名称或咨询内容">
            <template slot="advanced-content">
              <el-form ref="advancedForm" :model="advancedForm" label-width="80px">
                <el-form-item label="会员名称">
                  <el-input v-model="advancedForm.member_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="商品名称">
                  <el-input v-model="advancedForm.goods_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="咨询内容">
                  <el-input v-model="advancedForm.content" clearable></el-input>
                </el-form-item>
                <el-form-item label="回复状态">
                  <el-select v-model="advancedForm.reply_status" placeholder="请选择" clearable>
                    <el-option
                      v-for="item in replyStatusList"
                      :label="item.label"
                      :value="item.value"
                      :key="item.value"/>
                  </el-select>
                </el-form-item>
              </el-form>
            </template>
          </en-table-search>
        </div>
      </div>
    </en-table-layout>
    <div class="my-table-out" :style="{maxHeight: tableMaxHeight + 'px'}">
      <table class="my-table" v-loading="loading">
        <thead>
        <tr class="bg-order">
          <th>咨询</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody v-for="(item, index) in tableData" :key="index">
          <tr class="bg-order">
            <td colspan="2" class="base-info">
              <!--商品名称-->
              <a :href="`${MixinBuyerDomain}/goods/${item.goods_id}`" target="_blank" class="goods-name">{{ item.goods_name }}</a>
              咨询用户：<span class="member-name">{{ item.member_name}} </span>
              咨询时间：<span>{{ item.create_time | unixToDate('yyyy-MM-dd hh:mm') }}</span>
            </td>
          </tr>
          <tr>
            <!--咨询-->
            <td>
              <h4>咨询问题：</h4>
              <p>{{ item.content }}</p>
            </td>
            <!--操作-->
            <td class="opera-btn" v-if="item.reply_status === 1">
              <h4>回复咨询：</h4>
              <p>{{ item.reply }}</p>
            </td>
            <td class="opera-btn" v-if="item.reply_status === 0">
              <el-button type="primary" @click="handleReply(item)">回复</el-button>
            </td>
          </tr>
        </tbody>
        <div v-if="tableData.length === 0 " class="empty-block">
          暂无数据
        </div>
      </table>
    </div>
    <el-pagination
      slot="pagination"
      v-if="pageData"
      @size-change="handlePageSizeChange"
      @current-change="handlePageCurrentChange"
      :current-page="pageData.page_no"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageData.page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageData.data_total">
    </el-pagination>
    <el-dialog title="回复咨询"  :visible.sync="isReplyShow" width="30%">
      <div align="center">
        <el-form :model="replyForm" ref="replyForm" label-position="right" label-width="100px">
          <el-form-item label="咨询内容:" prop="content" >
            <span class="desc-span">{{ replyForm.content }}</span>
          </el-form-item>
          <el-form-item
            label="回复内容:"
            prop="reply"
            :rules="{ required: true, message: '请填写回复内容' ,trigger: 'blur' }">
            <el-input type="textarea" :maxlength="500" rows="5" placeholder="回复内容最多500个字" v-model="replyForm.reply"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="isReplyShow = false">取 消</el-button>
        <el-button type="primary" @click="confirmReply">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_consultation from '@/api/consultation'
  import { CategoryPicker } from '@/components'

  export default {
    name: 'consultation',
    components: {
      [CategoryPicker.name]: CategoryPicker
    },
    data() {
      return {
        /** 列表loading状态 */
        loading: false,

        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10
        },

        /** 列表数据 */
        tableData: [],

        /** 列表分页数据 */
        pageData: [],

        /** 高级搜索数据 */
        advancedForm: {
          member_name: '',

          goods_name: '',

          content: '',

          reply_status: ''
        },

        /** 回复状态列表 */
        replyStatusList: [
          { label: '已回复', value: 1 },
          { label: '未回复', value: 0 }
        ],

        /** 表格最大高度 */
        tableMaxHeight: (document.body.clientHeight - 54 - 34 - 50 - 15),

        /** 回复操作框是否显示 */
        isReplyShow: false,

        /** 回复表单 */
        replyForm: {
          /** 咨询问题 */
          content: '',

          /** 回复内容 */
          reply: ''
        }
      }
    },
    mounted() {
      this.params = { ...this.params, ...this.$route.query }
      this.GET_ConsultationList()
      window.onresize = this.countTableHeight
    },
    methods: {
      /** 计算高度 */
      countTableHeight() {
        this.tableHeight = (document.body.clientHeight - 54 - 35 - 50)
      },

      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_ConsultationList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_ConsultationList()
      },

      /** 搜索事件触发 */
      searchEvent(data) {
        this.params = {
          ...this.params,
          keyword: data
        }
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        this.GET_ConsultationList()
      },

      /** 高级搜索事件触发 */
      advancedSearchEvent() {
        delete this.params.keyword
        this.params = {
          ...this.params,
          ...this.advancedForm
        }
        this.GET_ConsultationList()
      },

      /** 获取咨询列表*/
      GET_ConsultationList() {
        this.loading = true
        API_consultation.getConsultationList(this.params).then(response => {
          this.loading = false
          this.tableData = response.data
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
        })
      },

      /** 回复操作 */
      handleReply(item) {
        this.isReplyShow = true
        this.replyForm = {
          ask_id: item.ask_id,
          /** 咨询问题 */
          content: item.content,

          /** 回复内容 */
          reply: item.reply
        }
      },

      /** 确认回复 */
      confirmReply() {
        this.$refs['replyForm'].validate((valid) => {
          if (valid) {
            const _params = {
              reply_content: this.replyForm.reply
            }
            API_consultation.replyConsultationList(this.replyForm.ask_id, _params).then(() => {
              this.$message.success('回复成功')
              this.isReplyShow = false
              this.GET_ConsultationList()
            })
          }
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ div.toolbar {
    height: 70px;
    padding: 20px 0;
  }
  /* 工具条*/
  .inner-toolbar {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 0 20px;
  }

  /*暂无数据时的样式*/
  /deep/ .el-table__empty-block {
    display: none;
  }

  .empty-block {
    position: relative;
    min-height: 60px;
    line-height: 60px;
    text-align: center;
    width:  percentage(100 / 66);
    height: 100%;
    font-size: 14px;
    color: #606266;
  }

  /*表格信息*/
  .my-table-out{
    overflow-y: scroll;
    text-overflow: ellipsis;
    width: 100%;
    max-height: 800px;
  }
  .my-table {
    .bg-order {
      background: #FAFAFA;
    }
    width: 100%;
    margin-bottom: 40px;
    background: #ffffff;
    border-collapse: collapse;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    font-size: 14px;
    font-bold: 700;
    thead {
      th {
        padding: 12px 0;
        border: 1px solid #ebeef5;
        border-collapse: collapse;
        color: #909399;
        &:first-child {
          width: 66%;
        }
      }
    }
    tbody {
      margin-top: 10px;
      td {
        border: 1px solid #ebeef5;
        border-collapse: collapse;
        vertical-align: middle;
        text-align: left;
        padding: 10px 20px;
        h4 {
          margin: 10px 0;
          padding: 0;
        }
        p {
          margin: 10px 0;
          padding: 0;
        }
      }
      td.base-info {
        font-weight: bold;
        color: #333;
        font-size: 13px;

        /*商品名称*/
        a.goods-name {
          color: #337ab7 ;
          display: inline-block;
          margin: 0 20px 0 0;
        }

        /*会员名称*/
        span.member-name {
          display: inline-block;
          margin: 0 20px 0 0;
        }
      }

      td.opera-btn {
        color: #f42424;
        line-height: 25px;
      }
    }
  }

  /*分页信息*/
  section>div {
    position: relative;
  }
  .el-pagination {
    text-align: right;
    width: 100%;
    background: #ffffff;
    height: 40px;
    position: absolute;
    bottom: 0;
    right: 0;
    border-top: 1px solid #e5e5e5;
    padding: 5px 20px;
  }

  /** 弹框信息 */
  .desc-span {
    display: block;
    text-align: left;
    width: 100%;
  }
</style>


