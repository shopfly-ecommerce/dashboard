<template>
  <en-table-layout
    :toolbar="false"
    :tableData="tableData.data"
    :loading="loading"
  >
    <template slot="table-columns">
      <el-table-column prop="name" label="The consignee"/>
      <el-table-column :formatter="formatterAddress" label="In the area"/>
      <el-table-column prop="addr" label="Detailed address"/>
      <el-table-column prop="mobile" label="Mobile phone number"/>
      <el-table-column label="default">
        <template slot-scope="scope">{{ scope.row.def_addr ? 'is' : 'no' }}</template>
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
</template>

<script>
  import * as API_Member from '@/api/member'

  export default {
    name: 'memberListAddress',
    props: ['member-id'],
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
        tableData: ''
      }
    },
    mounted() {
      this.GET_MemberListAddress()
    },
    watch: {
      memberId() {
        this.params.member_id = this.memberId
        this.GET_MemberListAddress()
      }
    },
    methods: {
      /** Formatted address*/
      formatterAddress(row, column, cellValue, index) {
        return `${row.province}${row.city}${row.county}${row.town}`
      },
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_MemberListAddress()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_MemberListAddress()
      },

      /** Get membership list*/
      GET_MemberListAddress() {
        this.loading = true
        API_Member.getMemberAddress(this.memberId, this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>
