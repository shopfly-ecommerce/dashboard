<template>
  <div>
    <en-table-layout
      toolbar
      pagination
      :tableData="tableData"
      :loading="loading">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns"></div>
        <div class="toolbar-search">
          <en-table-search
            @search="searchEvent"
            @advancedSearch="advancedSearchEvent"
            advanced>
            <template slot="advanced-content">
              <el-form ref="advancedForm" :model="advancedForm" label-width="80px">
                <el-form-item label="操作者">
                  <el-select v-model="advancedForm.operator" placeholder="请选择">
                    <el-option
                      v-for="item in operators"
                      :key="item.operator_id"
                      :label="item.operator_name"
                      :value="item.operator_id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="类型">
                  <el-select v-model="advancedForm.log_type" placeholder="请选择">
                    <el-option
                      v-for="item in operaTypes"
                      :key="item.opera_id"
                      :label="item.opera_name"
                      :value="item.opera_id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="时间">
                  <el-date-picker
                    style="width: 280px;"
                    v-model="advancedForm.opera_time"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-form>
            </template>
          </en-table-search>
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column label="序号" type="index" width="50"/>
        <el-table-column prop="log_type" label="类型" />
        <el-table-column prop="opera_name" label="操作"/>
        <el-table-column prop="operator" label="操作者" />
        <el-table-column label="时间">
          <template slot-scope="scope">
            {{ scope.row.opera_time | unixToDate }}
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
  </div>
</template>

<script>
  import * as API_logs from '@/api/logsManage'
  import { CategoryPicker } from '@/components'

  export default {
    name: 'logManage',
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
        tableData: null,

        /** 列表分页数据 */
        pageData: null,

        /** 高级搜索数据 */
        advancedForm: {
          /** 日志类型*/
          log_type: '',

          /** 日志操作 */
          opera_name: '',

          /** 操作者 */
          operator: '',

          /** 操作时间 */
          opera_time: ''
        },

        /** 操作类型列表*/
        operaTypes: [
          { opera_id: 0, opera_name: '删除' },
          { opera_id: 1, opera_name: '增加' },
          { opera_id: 2, opera_name: '修改更新' },
          { opera_id: 3, opera_name: '浏览' }
        ],

        /** 操作者列表*/
        operators: [
          { operator_id: 0, operator_name: '小兰' },
          { operator_id: 1, operator_name: '小明' },
          { operator_id: 2, operator_name: '小红' },
          { operator_id: 3, operator_name: '小冰' }
        ]
      }
    },
    mounted() {
      this.GET_LogsList()
    },
    methods: {

      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_LogsList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_LogsList()
      },

      /** 销售状态格式化 */
      marketStatus(row, column, cellValue) {
        return row.market_enable === 1 ? '售卖中' : '已下架'
      },

      /** 搜索事件触发 */
      searchEvent(data) {
        this.params = {
          ...this.params,
          goods_status: data
        }
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        this.GET_LogsList()
      },

      /** 高级搜索事件触发 */
      advancedSearchEvent() {
        this.params = {
          ...this.params,
          ...this.advancedForm
        }
        delete this.params.keyword
        this.GET_LogsList()
      },

      GET_LogsList() {
        this.loading = true
        API_logs.getLogsList(this.params).then(response => {
          this.loading = false
          this.pageData = {
            page_no: response.draw,
            page_size: 10,
            data_total: response.recordsFiltered
          }
          this.tableData = response.data
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ .el-table td:not(.is-left) {
    text-align: center;
  }

  .inner-toolbar {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  .toolbar-btns {

  }

  .toolbar-search {
    margin-right: 10px;
  }

  .goods-image {
    width: 50px;
    height: 50px;
  }

</style>
