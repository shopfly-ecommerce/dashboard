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
                <el-form-item label="The operator">
                  <el-select v-model="advancedForm.operator" placeholder="Please select">
                    <el-option
                      v-for="item in operators"
                      :key="item.operator_id"
                      :label="item.operator_name"
                      :value="item.operator_id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="type">
                  <el-select v-model="advancedForm.log_type" placeholder="Please select">
                    <el-option
                      v-for="item in operaTypes"
                      :key="item.opera_id"
                      :label="item.opera_name"
                      :value="item.opera_id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="time">
                  <el-date-picker
                    style="width: 280px;"
                    v-model="advancedForm.opera_time"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="Start date"
                    end-placeholder="End date">
                  </el-date-picker>
                </el-form-item>
              </el-form>
            </template>
          </en-table-search>
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column label="The serial number" type="index" width="50"/>
        <el-table-column prop="log_type" label="type" />
        <el-table-column prop="opera_name" label="Operation"/>
        <el-table-column prop="operator" label="The operator" />
        <el-table-column label="time">
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
        /** The list ofloadingStatus*/
        loading: false,

        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10
        },

        /** The list of data*/
        tableData: null,

        /** List paging data*/
        pageData: null,

        /** Advanced search data*/
        advancedForm: {
          /** Log type*/
          log_type: '',

          /** Log operation*/
          opera_name: '',

          /** The operator*/
          operator: '',

          /** Operating time*/
          opera_time: ''
        },

        /** List of operation types*/
        operaTypes: [
          { opera_id: 0, opera_name: 'delete' },
          { opera_id: 1, opera_name: 'increase' },
          { opera_id: 2, opera_name: 'Modify the update' },
          { opera_id: 3, opera_name: 'browse' }
        ],

        /** Operator list*/
        operators: [
          { operator_id: 0, operator_name: 'Xiao LAN' },
          { operator_id: 1, operator_name: 'Xiao Ming' },
          { operator_id: 2, operator_name: 'The little red' },
          { operator_id: 3, operator_name: 'The little ice' }
        ]
      }
    },
    mounted() {
      this.GET_LogsList()
    },
    methods: {

      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_LogsList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_LogsList()
      },

      /** Sales status formatting*/
      marketStatus(row, column, cellValue) {
        return row.market_enable === 1 ? 'In the sale' : 'unsold'
      },

      /** Search Event Trigger*/
      searchEvent(data) {
        this.params = {
          ...this.params,
          goods_status: data
        }
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        this.GET_LogsList()
      },

      /** Advanced search event triggered*/
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
