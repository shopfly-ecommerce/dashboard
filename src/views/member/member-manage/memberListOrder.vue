<template>
  <en-table-layout
    :toolbar="false"
    :tableData="tableData.data"
    :loading="loading"
  >
    <template slot="table-columns">
      <el-table-column prop="sn" label="The order number"/>
      <el-table-column prop="order_status_text" label="Status"></el-table-column>
      <el-table-column prop="pay_status_text" label="Payment status"></el-table-column>
      <el-table-column prop="create_time" :formatter="MixinUnixToDate" label="Create time"></el-table-column>
      <!--<el-table-column label="Operation" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            >To view</el-button>
          <el-button
            size="mini"
            type="danger"
            >delete</el-button>
        </template>
      </el-table-column>-->
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
</template>

<script>
  import * as API_Order from '@/api/order'

  export default {
    name: 'memberListOrder',
    props: ['member-id'],
    data() {
      return {
        // List loading status
        loading: false,
        // A list of parameters
        params: {
          page_no: 1,
          page_size: 10,
          member_id: this.memberId
        },
        // The list of data
        tableData: ''
      }
    },
    mounted() {
      this.GET_MemberListOrder()
    },
    watch: {
      memberId() {
        this.params.member_id = this.memberId
        this.GET_MemberListOrder()
      }
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_MemberListOrder()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_MemberListOrder()
      },

      /** Get a list of member orders*/
      GET_MemberListOrder() {
        this.loading = true
        API_Order.getOrderList(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>
