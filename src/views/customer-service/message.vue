<template>
  <div>
    <el-tabs type="border-card" @tab-click="changeTabs">
      <el-tab-pane label="Unread messages" name="0">
        <en-table-layout
          toolbar
          pagination
          :tableData="tableData"
          :loading="loading"
          :selectionChange="handleSelectionChange">
          <div slot="toolbar" class="inner-toolbar">
            <div class="toolbar-btns">
              <div class="conditions">
                <span>Message type:</span>
                <el-select v-model="params.type" placeholder="Please select"  @change="handleChangeMsgCategory">
                  <el-option
                    v-for="item in msg_categorys"
                    :key="item.msg_category_id"
                    :label="item.msg_category_label"
                    :value="item.msg_category_id">
                  </el-option>
                </el-select>
              </div>
              <el-button @click="handleDeleteAllMsgs" type="danger">Delete all</el-button>
              <el-button @click="handleSignReadAllMsgs" v-if="isAllRead" type="primary">Mark as read</el-button>
            </div>
          </div>
          <template slot="table-columns">
            <el-table-column type="selection" width="55"/>
            <el-table-column prop="notice_content" label="content"/>
            <el-table-column label="Send time" width="200" >
              <template slot-scope="scope">{{ scope.row.send_time | unixToDate('yyyy-MM-dd hh:mm') }}</template>
            </el-table-column>
            <el-table-column label="Operation" width="200" class="opera-btn">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  @click="handleDeleteMsg(scope.row)">delete
                </el-button>
                <el-button
                  type="primary"
                  v-if="scope.row.is_read === 0"
                  @click="handleSignRead(scope.row)">Mark as read
                </el-button>
              </template>
            </el-table-column>
          </template>
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
        </en-table-layout>
      </el-tab-pane>
      <el-tab-pane label="Read the message" name="1">
        <en-table-layout
          toolbar
          pagination
          :tableData="tableData"
          :loading="loading"
          :selectionChange="handleSelectionChange">
          <div slot="toolbar" class="inner-toolbar">
            <div class="toolbar-btns">
              <div class="conditions">
                <span>Message type:</span>
                <el-select v-model="params.type" placeholder="Please select"  @change="handleChangeMsgCategory">
                  <el-option
                    v-for="item in msg_categorys"
                    :key="item.msg_category_id"
                    :label="item.msg_category_label"
                    :value="item.msg_category_id">
                  </el-option>
                </el-select>
              </div>
              <el-button @click="handleDeleteAllMsgs" type="danger">Delete all</el-button>
            </div>
          </div>
          <template slot="table-columns">
            <el-table-column type="selection" width="55"/>
            <el-table-column prop="notice_content" label="content"/>
            <el-table-column label="Send time" width="200" >
              <template slot-scope="scope">{{ scope.row.send_time | unixToDate('yyyy-MM-dd hh:mm') }}</template>
            </el-table-column>
            <el-table-column label="Operation" width="200" class="opera-btn">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  @click="handleDeleteMsg(scope.row)">delete
                </el-button>
              </template>
            </el-table-column>
          </template>
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
        </en-table-layout>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import * as API_Messages from '@/api/message'
  import { CategoryPicker } from '@/components'

  export default {
    name: 'message',
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
          page_size: 10,
          data_total: 0,
          is_read: 0,
          type: ''
        },

        /** The list of data*/
        tableData: null,

        /** List paging data*/
        pageData: null,

        /** The selected itemids */
        selectionids: [],

        /** Whether all have been read*/
        isAllRead: false,

        /** Message type list*/
        msg_categorys: [
          {
            msg_category_id: '',
            msg_category_label: 'all'
          }, {
            msg_category_id: 'GOODS',
            msg_category_label: 'Commodity related news'
          }, {
            msg_category_id: 'ORDER',
            msg_category_label: 'Order related message'
          }, {
            msg_category_id: 'AFTERSALE',
            msg_category_label: 'After-sale related information'
          }
        ]

      }
    },
    created() {
      this.GET_MsgsList()
    },
    methods: {

      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_MsgsList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_MsgsList()
      },

      /** switchtab */
      changeTabs(tab) {
        this.params = {
          ...this.params,
          page_no: 1,
          is_read: parseInt(tab.name)
        }
        this.GET_MsgsList()
      },

      /** Get message list*/
      GET_MsgsList() {
        this.loading = true
        API_Messages.getMsgsList(this.params).then(response => {
          this.loading = false
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
          this.tableData = response.data
          this.isAllRead = this.tableData.some(key => {
            return key.is_read === 0
          })
        })
      },

      /** Change the classification*/
      handleChangeMsgCategory(val) {
        this.params = {
          ...this.params,
          page_no: 1,
          type: val
        }
        this.GET_MsgsList()
      },

      /** Get the selected item*/
      handleSelectionChange(val) {
        this.selectionids = val.map(item => item.id)
      },

      /** Delete the message*/
      handleDeleteMsg(row) {
        this.$confirm('Confirm that this message is deleted, Whether or not to continue?', 'prompt', {
          confirmButtonText: 'save',
          cancelButtonText: 'cancel',
          type: 'warning'
        }).then(() => {
          this.Delete_messages(row.id)
        })
      },

      /** Delete all*/
      handleDeleteAllMsgs() {
        if (this.selectionids.length <= 0) {
          this.$message.warning('Select the item to delete')
          return
        }
        const _ids = this.selectionids.toString()
        this.Delete_messages(_ids)
      },

      /** To delete*/
      Delete_messages(ids) {
        API_Messages.deleteMsgs(ids, {}).then(() => {
          this.$message.success('Delete the success！')
          this.params.page_no = 1
          this.GET_MsgsList()
        })
      },

      /** Mark as read*/
      handleSignRead(row) {
        this.signReadMsgs(row.id)
      },

      /** Mark as read batches*/
      handleSignReadAllMsgs() {
        if (this.selectionids.length <= 0) {
          this.$message.warning('Select the item you want to mark')
          return
        }
        const _ids = this.selectionids.toString()
        this.signReadMsgs(_ids)
      },

      /** Execution marks as read*/
      signReadMsgs(ids) {
        API_Messages.signMsgs(ids, {}).then(() => {
          this.$message.success('Marked success')
          this.params.page_no = 1
          this.GET_MsgsList()
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

  /deep/ .el-table td:not(.is-left) {
    text-align: center;
  }

  .inner-toolbar {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  div.toolbar-btns {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    div {
      span {
        display: inline-block;
        font-size: 14px;
        color: #606266;
      }
    }
    .conditions {
      margin-right: 30px;
    }
  }

  .toolbar-search {
    margin-right: 10px;
  }

  .goods-image {
    width: 50px;
    height: 50px;
  }

  /deep/.opera-btn {
    div.cell {
      text-align: left;
    }
  }
</style>

