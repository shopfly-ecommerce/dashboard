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
            placeholder="Please input product name or consultation content">
            <template slot="advanced-content">
              <el-form ref="advancedForm" :model="advancedForm" label-width="80px">
                <el-form-item label="Member name">
                  <el-input v-model="advancedForm.member_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="Name">
                  <el-input v-model="advancedForm.goods_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="Consulting content">
                  <el-input v-model="advancedForm.content" clearable></el-input>
                </el-form-item>
                <el-form-item label="Reply to state">
                  <el-select v-model="advancedForm.reply_status" placeholder="Please select" clearable>
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
          <th>consulting</th>
          <th>Operation</th>
        </tr>
        </thead>
        <tbody v-for="(item, index) in tableData" :key="index">
          <tr class="bg-order">
            <td colspan="2" class="base-info">
              <!--Name-->
              <a :href="`${MixinBuyerDomain}/goods/${item.goods_id}`" target="_blank" class="goods-name">{{ item.goods_name }}</a>
              Consulting the user：<span class="member-name">{{ item.member_name}} </span>
              Consultation time：<span>{{ item.create_time | unixToDate('yyyy-MM-dd hh:mm') }}</span>
            </td>
          </tr>
          <tr>
            <!--consulting-->
            <td>
              <h4>Ask questions：</h4>
              <p>{{ item.content }}</p>
            </td>
            <!--Operation-->
            <td class="opera-btn" v-if="item.reply_status === 1">
              <h4>Reply to consulting：</h4>
              <p>{{ item.reply }}</p>
            </td>
            <td class="opera-btn" v-if="item.reply_status === 0">
              <el-button type="primary" @click="handleReply(item)">reply</el-button>
            </td>
          </tr>
        </tbody>
        <div v-if="tableData.length === 0 " class="empty-block">
          no data
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
    <el-dialog title="Reply to consulting"  :visible.sync="isReplyShow" width="30%">
      <div align="center">
        <el-form :model="replyForm" ref="replyForm" label-position="right" label-width="100px">
          <el-form-item label="Consulting content:" prop="content" >
            <span class="desc-span">{{ replyForm.content }}</span>
          </el-form-item>
          <el-form-item
            label="Reply content:"
            prop="reply"
            :rules="{ required: true, message: 'Please fill in the reply' ,trigger: 'blur' }">
            <el-input type="textarea" :maxlength="500" rows="5" placeholder="Most replies500A word" v-model="replyForm.reply"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="isReplyShow = false">cancel</el-button>
        <el-button type="primary" @click="confirmReply">save</el-button>
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
        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10
        },

        /** The list of data*/
        tableData: [],

        /** List paging data*/
        pageData: [],

        /** Advanced search data*/
        advancedForm: {
          member_name: '',

          goods_name: '',

          content: '',

          reply_status: ''
        },

        /** Reply status list*/
        replyStatusList: [
          { label: 'Have to reply', value: 1 },
          { label: 'Did not return', value: 0 }
        ],

        /** Table maximum height*/
        tableMaxHeight: (document.body.clientHeight - 54 - 34 - 50 - 15),

        /** Reply whether the action box is displayed*/
        isReplyShow: false,

        /** Reply form*/
        replyForm: {
          /** Ask questions*/
          content: '',

          /** Reply content*/
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
      /** Calculate height*/
      countTableHeight() {
        this.tableHeight = (document.body.clientHeight - 54 - 35 - 50)
      },

      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_ConsultationList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_ConsultationList()
      },

      /** Search Event Trigger*/
      searchEvent(data) {
        this.params = {
          ...this.params,
          keyword: data
        }
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        this.GET_ConsultationList()
      },

      /** Advanced search event triggered*/
      advancedSearchEvent() {
        delete this.params.keyword
        this.params = {
          ...this.params,
          ...this.advancedForm
        }
        this.GET_ConsultationList()
      },

      /** Get a consultation list*/
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

      /** Reply to the operation*/
      handleReply(item) {
        this.isReplyShow = true
        this.replyForm = {
          ask_id: item.ask_id,
          /** Ask questions*/
          content: item.content,

          /** Reply content*/
          reply: item.reply
        }
      },

      /** Confirmation reply*/
      confirmReply() {
        this.$refs['replyForm'].validate((valid) => {
          if (valid) {
            const _params = {
              reply_content: this.replyForm.reply
            }
            API_consultation.replyConsultationList(this.replyForm.ask_id, _params).then(() => {
              this.$message.success('Reply to success')
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
  /* The toolbar*/
  .inner-toolbar {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 0 20px;
  }

  /*A pattern in the absence of data*/
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

  /*Form information*/
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

        /*Name*/
        a.goods-name {
          color: #337ab7 ;
          display: inline-block;
          margin: 0 20px 0 0;
        }

        /*Member name*/
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

  /*The paging information*/
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

  /** Bounced message*/
  .desc-span {
    display: block;
    text-align: left;
    width: 100%;
  }
</style>


