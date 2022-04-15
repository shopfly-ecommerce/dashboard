<template>
  <div>
    <en-table-layout
      toolbar
      :tableData="tableData"
      pagination
      :loading="loading">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns"></div>
        <div class="toolbar-search">
          <en-table-search @search="searchEvent" placeholder="Please enter the distributor user name"/>
        </div>
      </div>
      <template slot="table-columns">
        <!--Bill no.-->
        <el-table-column prop="sn" label="Bill no."/>
        <!--Start date-->
        <el-table-column prop="start_time" :formatter="MixinUnixToDate" label="Start date"/>
        <!--End date-->
        <el-table-column prop="end_time" :formatter="MixinUnixToDate" label="End date"/>
        <!--Commission amount-->
        <el-table-column label="Commission amount">
          <template slot-scope="scope">{{ scope.row.push_money | unitPrice('￥') }}</template>
        </el-table-column>
        <!--Amount-->
        <el-table-column label="Amount">
          <template slot-scope="scope">{{ scope.row.order_money | unitPrice('￥') }}</template>
        </el-table-column>
        <!--orders-->
        <el-table-column prop="order_count" label="orders" width="60"/>
        <!--Refund the commission amount-->
        <el-table-column label="Refund the commission amount">
          <template slot-scope="scope">{{ scope.row.return_push_money | unitPrice('￥') }}</template>
        </el-table-column>
        <!--Refund of order amount-->
        <el-table-column label="Refund of order amount">
          <template slot-scope="scope">{{ scope.row.return_order_money | unitPrice('￥') }}</template>
        </el-table-column>
        <!--Return order-->
        <el-table-column prop="return_order_count" label="Return order" width="100"/>
        <!--This should be"-->
        <el-table-column label="This should be"">
          <template slot-scope="scope">{{ scope.row.final_money | unitPrice('￥') }}</template>
        </el-table-column>
        <el-table-column label="Operation" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleSeeBillDetails(scope.row)">To view</el-button>
          </template>
        </el-table-column>
      </template>
      <el-pagination
        v-if="tableData"
        slot="pagination"
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
  import * as API_distribution from '@/api/distribution'
  export default {
    name: 'billList',
    data() {
      return {
        // List loading status
        loading: false,

        // A list of parameters
        params: {
          page_no: 1,
          page_size: 10,
          ...this.$route.query
        },
        // The list of data
        tableData: [],

        pageData: {}
      }
    },
    mounted() {
      this.GET_BillList()
    },
    activated() {
      delete this.params.uname
      this.params = {
        ...this.params,
        ...this.$route.query
      }
      this.GET_BillList()
    },
    beforeRouteUpdate(to, from, next) {
      delete this.params.uname
      this.params = {
        ...this.params,
        ...this.$route.query
      }
      this.GET_BillList()
      next()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_BillList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_BillList()
      },

      /** Search Event Trigger*/
      searchEvent(data) {
        this.params = {
          ...this.params,
          uname: data
        }
        this.GET_BillList()
      },

      /** Get a list of bills*/
      GET_BillList() {
        this.loading = true
        API_distribution.getBillList(this.params).then(response => {
          this.loading = false
          this.tableData = response.data
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
        })
      },

      /** View the statement for details*/
      handleSeeBillDetails(row) {
        this.$router.push({ path: '/distribution/achievement/bill-details', query: { bill_id: row.id, member_id: row.member_id }})
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
    padding: 0 20px;
  }
</style>

