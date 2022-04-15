<template>
  <div>
    <en-table-layout
      pagination
      :tableData="tableData"
      :loading="loading">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns"></div>
        <div class="toolbar-search">
          <en-table-search @search="searchEvent"  placeholder="Please enter the name of the member" />
        </div>
      </div>
      <template slot="table-columns">
        <!--The name-->
        <el-table-column prop="name" label="The name"/>
        <!--The number of-->
        <el-table-column prop="downline"  label="The number of"/>
        <!--The sales amount-->
        <el-table-column label="The sales amount">
          <template slot-scope="scope">{{ scope.row.turnover_price | unitPrice('￥') }}</template>
        </el-table-column>
        <!--Profit margin-->
        <el-table-column label="Profit margin">
          <template slot-scope="scope">{{ scope.row.rebate_total | unitPrice('￥') }}</template>
        </el-table-column>
        <!--orders-->
        <el-table-column prop="order_num" label="orders"/>
        <!--Royalty template-->
        <el-table-column prop="current_tpl_name" label="Royalty template"/>
        <!--Registration time-->
        <el-table-column prop="create_time" :formatter="MixinUnixToDate" label="Registration time"/>
        <!--Modify the model-->
        <el-table-column label="Modify the template" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEditTpl(scope.row)">Modify the model</el-button>
          </template>
        </el-table-column>
        <!--Turnover statistics-->
        <el-table-column label="Turnover statistics" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleTurnoverStatistics(scope.row)">Turnover statistics</el-button>
          </template>
        </el-table-column>
        <!--Profit statistics-->
        <el-table-column label="Profit statistics" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleProfitStatistics(scope.row)">Profit statistics</el-button>
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
    <el-dialog :title="`${currentRow.name}Modify mode of`" width="40%" :visible.sync="isShowModifyModel" class="modify-model">
      <en-table-layout
        pagination
        border
        :tableData="gridData"
        style="overflow: hidden"
        >
        <template slot="table-columns">
          <el-table-column label="The templateID" width="150">
            <template slot-scope="scope">
              <el-radio :label="scope.row.id" v-model="currentRow.current_tpl_id"></el-radio>
            </template>
          </el-table-column>
          <el-table-column property="tpl_name" label="The template name"></el-table-column>
          <el-table-column property="tpl_describe" label="instructions"></el-table-column>
        </template>
        <el-pagination
          v-if="gridData"
          slot="pagination"
          @size-change="handleGridPageSizeChange"
          @current-change="handleGridPageCurrentChange"
          :current-page="pageGridData.page_no"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageGridData.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageGridData.data_total">
        </el-pagination>
      </en-table-layout>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="reserveTpl">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_distribution from '@/api/distribution'
  export default {
    name: 'distributor-list',
    data() {
      return {
        // List loading status
        loading: false,

        // A list of parameters
        params: {
          page_no: 1,
          page_size: 10
        },
        // The list of data
        tableData: [],

        /** The paging information*/
        pageData: {},

        /** Whether to display modify mode*/
        isShowModifyModel: false,

        /** Modify the pattern template list*/
        gridData: [],

        /** Modify schema paging*/
        pageGridData: {},

        /** Current Operating Distributor*/
        currentRow: {},

        /** parameter*/
        gridParams: {}
      }
    },
    mounted() {
      this.GET_DistributorList()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_DistributorList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_DistributorList()
      },

      /** Search Event Trigger*/
      searchEvent(data) {
        this.params = {
          page_no: 1,
          page_size: 10,
          member_name: data
        }
        this.GET_DistributorList()
      },

      /** Get a list of individual distributors*/
      GET_DistributorList() {
        this.loading = true
        API_distribution.getDistributorList(this.params).then(response => {
          this.loading = false
          this.tableData = response.data
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
        })
      },

      /** Modify the model*/
      handleEditTpl(row) {
        this.isShowModifyModel = true
        this.currentRow = row
        this.GET_PerAccomplishmentTpl()
      },

      /** Get a list of templates*/
      GET_PerAccomplishmentTpl() {
        API_distribution.getPerAccomplishmentTpl(this.gridParams).then(response => {
          this.gridData = response.data
          this.pageGridData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
        })
      },

      /** Modify mode The page size has changed*/
      handleGridPageSizeChange(size) {
        this.params.page_size = size
        this.GET_PerAccomplishmentTpl()
      },

      /** The number of pages in the modified mode has changed*/
      handleGridPageCurrentChange(page) {
        this.params.page_no = page
        this.GET_PerAccomplishmentTpl()
      },

      /** Save Modify Mode*/
      reserveTpl() {
        const _params = {
          member_id: this.currentRow.id,
          tpl_id: this.currentRow.current_tpl_id
        }
        API_distribution.modifyTpl(_params).then(() => {
          this.$message.success('Modify the success')
          this.isShowModifyModel = false
          this.GET_DistributorList()
        })
      },

      /** Turnover statistics*/
      handleTurnoverStatistics(row) {
        this.$router.push({ path: '/distribution/distributor/distributor-statistics',
          query: { member_id: row.id, member_name: row.name, isAmount: 1 }})
      },

      /** Profit statistics*/
      handleProfitStatistics(row) {
        this.$router.push({ path: '/distribution/distributor/distributor-statistics',
          query: { member_id: row.id, member_name: row.name, isAmount: 2 }})
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
  /deep/ .modify-model {
    div.toolbar {
      display: none;
    }
  }
</style>




