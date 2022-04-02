<template>
  <div>
    <el-tabs type="border-card" @tab-click="changeTabs">
      <el-tab-pane label="未读消息" name="0">
        <en-table-layout
          toolbar
          pagination
          :tableData="tableData"
          :loading="loading"
          :selectionChange="handleSelectionChange">
          <div slot="toolbar" class="inner-toolbar">
            <div class="toolbar-btns">
              <div class="conditions">
                <span>消息类型:</span>
                <el-select v-model="params.type" placeholder="请选择"  @change="handleChangeMsgCategory">
                  <el-option
                    v-for="item in msg_categorys"
                    :key="item.msg_category_id"
                    :label="item.msg_category_label"
                    :value="item.msg_category_id">
                  </el-option>
                </el-select>
              </div>
              <el-button @click="handleDeleteAllMsgs" type="danger">全部删除</el-button>
              <el-button @click="handleSignReadAllMsgs" v-if="isAllRead" type="primary">标记为已读</el-button>
            </div>
          </div>
          <template slot="table-columns">
            <el-table-column type="selection" width="55"/>
            <el-table-column prop="notice_content" label="内容"/>
            <el-table-column label="发送时间" width="200" >
              <template slot-scope="scope">{{ scope.row.send_time | unixToDate('yyyy-MM-dd hh:mm') }}</template>
            </el-table-column>
            <el-table-column label="操作" width="200" class="opera-btn">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  @click="handleDeleteMsg(scope.row)">删除
                </el-button>
                <el-button
                  type="primary"
                  v-if="scope.row.is_read === 0"
                  @click="handleSignRead(scope.row)">标记为已读
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
      <el-tab-pane label="已读消息" name="1">
        <en-table-layout
          toolbar
          pagination
          :tableData="tableData"
          :loading="loading"
          :selectionChange="handleSelectionChange">
          <div slot="toolbar" class="inner-toolbar">
            <div class="toolbar-btns">
              <div class="conditions">
                <span>消息类型:</span>
                <el-select v-model="params.type" placeholder="请选择"  @change="handleChangeMsgCategory">
                  <el-option
                    v-for="item in msg_categorys"
                    :key="item.msg_category_id"
                    :label="item.msg_category_label"
                    :value="item.msg_category_id">
                  </el-option>
                </el-select>
              </div>
              <el-button @click="handleDeleteAllMsgs" type="danger">全部删除</el-button>
            </div>
          </div>
          <template slot="table-columns">
            <el-table-column type="selection" width="55"/>
            <el-table-column prop="notice_content" label="内容"/>
            <el-table-column label="发送时间" width="200" >
              <template slot-scope="scope">{{ scope.row.send_time | unixToDate('yyyy-MM-dd hh:mm') }}</template>
            </el-table-column>
            <el-table-column label="操作" width="200" class="opera-btn">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  @click="handleDeleteMsg(scope.row)">删除
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
        /** 列表loading状态 */
        loading: false,

        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10,
          data_total: 0,
          is_read: 0,
          type: ''
        },

        /** 列表数据 */
        tableData: null,

        /** 列表分页数据 */
        pageData: null,

        /** 选中项的ids */
        selectionids: [],

        /** 是否全部已读 */
        isAllRead: false,

        /** 消息类型列表 */
        msg_categorys: [
          {
            msg_category_id: '',
            msg_category_label: '所有'
          }, {
            msg_category_id: 'GOODS',
            msg_category_label: '商品相关消息'
          }, {
            msg_category_id: 'ORDER',
            msg_category_label: '订单相关消息'
          }, {
            msg_category_id: 'AFTERSALE',
            msg_category_label: '售后相关消息'
          }
        ]

      }
    },
    created() {
      this.GET_MsgsList()
    },
    methods: {

      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_MsgsList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_MsgsList()
      },

      /** 切换tab */
      changeTabs(tab) {
        this.params = {
          ...this.params,
          page_no: 1,
          is_read: parseInt(tab.name)
        }
        this.GET_MsgsList()
      },

      /** 获取消息列表*/
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

      /** 改变分类*/
      handleChangeMsgCategory(val) {
        this.params = {
          ...this.params,
          page_no: 1,
          type: val
        }
        this.GET_MsgsList()
      },

      /** 获取选中项*/
      handleSelectionChange(val) {
        this.selectionids = val.map(item => item.id)
      },

      /** 删除消息 */
      handleDeleteMsg(row) {
        this.$confirm('确认删除此消息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.Delete_messages(row.id)
        })
      },

      /** 全部删除*/
      handleDeleteAllMsgs() {
        if (this.selectionids.length <= 0) {
          this.$message.warning('请选择要删除的项')
          return
        }
        const _ids = this.selectionids.toString()
        this.Delete_messages(_ids)
      },

      /** 执行删除*/
      Delete_messages(ids) {
        API_Messages.deleteMsgs(ids, {}).then(() => {
          this.$message.success('删除成功！')
          this.params.page_no = 1
          this.GET_MsgsList()
        })
      },

      /** 标记为已读 */
      handleSignRead(row) {
        this.signReadMsgs(row.id)
      },

      /** 标记为已读 批量*/
      handleSignReadAllMsgs() {
        if (this.selectionids.length <= 0) {
          this.$message.warning('请选择要标记的项')
          return
        }
        const _ids = this.selectionids.toString()
        this.signReadMsgs(_ids)
      },

      /** 执行标记为已读*/
      signReadMsgs(ids) {
        API_Messages.signMsgs(ids, {}).then(() => {
          this.$message.success('标记成功')
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

