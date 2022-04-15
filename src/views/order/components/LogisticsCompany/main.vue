<template>
  <el-dialog :visible.sync="logisticsModelShow" :closeOnClickModal="closeOnClickModal" @close="closed" width="50%">
    <en-table-layout
    :tableData="logisticsTableData"
    :loading="loading">
    <template slot="table-columns">
      <!--Logistics company-->
      <el-table-column prop="name" label="Logistics company"/>
      <!--State of the company-->
      <el-table-column label="State of the company">
        <template slot-scope="scope">
          <span v-if="!scope.row.shop_id">Not to choose</span>
          <span v-if="scope.row.shop_id" class="company-choosed">Has chosen</span>
        </template>
      </el-table-column>
    </template>
  </en-table-layout>
  </el-dialog>
</template>

<script>
  import * as API_logistics from '@/api/expressCompany'
  export default {
    name: 'EnLogisticsCompany',
    props: {
      logisticsShow: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        /** The list ofloadingStatus*/
        loading: false,

        /** Logistics company list parameters*/
        logisticsParams: {},

        /** Logistics company list data*/
        logisticsTableData: [],

        closeOnClickModal: false,

        /** Logistics company pop-up display*/
        logisticsModelShow: false
      }
    },
    watch: {
      logisticsShow() {
        this.logisticsModelShow = this.logisticsShow
        this.GET_logisticsList()
      }
    },
    mounted() {
      this.GET_logisticsList()
    },
    methods: {
      /** Access logistics company information*/
      GET_logisticsList() {
        this.loading = true
        API_logistics.getExpressCompanyList({}).then(response => {
          this.loading = false
          this.logisticsTableData = response.data
        })
      },

      /** The monitor shell is closed*/
      closed() {
        this.$emit('logstictisClosed', false)
      }
    }
  }
</script>

<style lang="scss" type="scss" scoped>
  .company-choosed {
    font-weight: bold;
    color: #e90101;
  }
  /deep/ div.toolbar {
    display: none;
  }
</style>
