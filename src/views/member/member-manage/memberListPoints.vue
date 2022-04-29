<template>
  <en-table-layout
    :toolbar="false"
    :tableData="tableData.data"
    :loading="loading"
  >
    <template slot="table-columns">
      <el-table-column prop="time" :formatter="MixinUnixToDate" label="The date of"/>
      <el-table-column prop="operator" label="The operator"></el-table-column>
      <el-table-column prop="reason" label="The detail"></el-table-column>
      <el-table-column label="Level score">
        <template slot-scope="{ row }">
          <span v-if="row.grade_point === 0">{{ row.grade_point }}</span>
          <span v-else-if="row.grade_point_type === 0">
                -{{ row.grade_point }}
              </span>
          <span v-else>+{{ row.grade_point }}</span>
        </template>
      </el-table-column>
      <el-table-column label="consumption score">
        <template slot-scope="{ row }">
          <span v-if="row.consum_point === 0">{{ row.consum_point }}</span>
          <span v-else-if="row.consum_point_type === 0">
                -{{ row.consum_point }}
              </span>
          <span v-else>+{{ row.consum_point }}</span>
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
</template>

<script>
  import * as API_Member from '@/api/member'

  export default {
    name: 'memberListPoints',
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
        tableData: '',
        // View Consultation Dialog
        dialogReviewVisible: false,
        // View details
        reviewAsk: {}
      }
    },
    mounted() {
      this.GET_MemberListPoints()
    },
    watch: {
      memberId() {
        this.params.member_id = this.memberId
        this.GET_MemberListPoints()
      }
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_MemberListPoints()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_MemberListPoints()
      },

      /** Get a list of member credits*/
      GET_MemberListPoints() {
        this.loading = true
        API_Member.getMemberPointList(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>
