<template>
  <el-dialog :visible.sync="logisticsModelShow" :closeOnClickModal="closeOnClickModal" @close="closed" width="50%">
    <en-table-layout
    :tableData="logisticsTableData"
    :loading="loading">
    <template slot="table-columns">
      <!--物流公司-->
      <el-table-column prop="name" label="物流公司"/>
      <!--公司状态-->
      <el-table-column label="公司状态">
        <template slot-scope="scope">
          <span v-if="!scope.row.shop_id">未选择</span>
          <span v-if="scope.row.shop_id" class="company-choosed">已选择</span>
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
        /** 列表loading状态 */
        loading: false,

        /** 物流公司列表参数 */
        logisticsParams: {},

        /** 物流公司列表数据 */
        logisticsTableData: [],

        closeOnClickModal: false,

        /** 物流公司弹框显示 */
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
      /** 获取物流公司信息*/
      GET_logisticsList() {
        this.loading = true
        API_logistics.getExpressCompanyList({}).then(response => {
          this.loading = false
          this.logisticsTableData = response.data
        })
      },

      /** 监听弹框关闭 */
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
