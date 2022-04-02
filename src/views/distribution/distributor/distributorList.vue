<template>
  <div>
    <en-table-layout
      pagination
      :tableData="tableData"
      :loading="loading">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns"></div>
        <div class="toolbar-search">
          <en-table-search @search="searchEvent"  placeholder="请输入会员名称" />
        </div>
      </div>
      <template slot="table-columns">
        <!--姓名-->
        <el-table-column prop="name" label="姓名"/>
        <!--人数-->
        <el-table-column prop="downline"  label="人数"/>
        <!--销售金额-->
        <el-table-column label="销售金额">
          <template slot-scope="scope">{{ scope.row.turnover_price | unitPrice('￥') }}</template>
        </el-table-column>
        <!--利润额-->
        <el-table-column label="利润额">
          <template slot-scope="scope">{{ scope.row.rebate_total | unitPrice('￥') }}</template>
        </el-table-column>
        <!--订单数	-->
        <el-table-column prop="order_num" label="订单数	"/>
        <!--提成模板	-->
        <el-table-column prop="current_tpl_name" label="提成模板	"/>
        <!--注册时间-->
        <el-table-column prop="create_time" :formatter="MixinUnixToDate" label="注册时间"/>
        <!--修改模式-->
        <el-table-column label="修改模版" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEditTpl(scope.row)">修改模式</el-button>
          </template>
        </el-table-column>
        <!--营业额统计-->
        <el-table-column label="营业额统计" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleTurnoverStatistics(scope.row)">营业额统计</el-button>
          </template>
        </el-table-column>
        <!--利润额统计-->
        <el-table-column label="利润额统计" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleProfitStatistics(scope.row)">利润额统计</el-button>
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
    <el-dialog :title="`${currentRow.name}的修改模式`" width="40%" :visible.sync="isShowModifyModel" class="modify-model">
      <en-table-layout
        pagination
        border
        :tableData="gridData"
        style="overflow: hidden"
        >
        <template slot="table-columns">
          <el-table-column label="模板ID" width="150">
            <template slot-scope="scope">
              <el-radio :label="scope.row.id" v-model="currentRow.current_tpl_id"></el-radio>
            </template>
          </el-table-column>
          <el-table-column property="tpl_name" label="模板名"></el-table-column>
          <el-table-column property="tpl_describe" label="说明"></el-table-column>
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
        <el-button type="primary" @click="reserveTpl">保 存</el-button>
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
        // 列表loading状态
        loading: false,

        // 列表参数
        params: {
          page_no: 1,
          page_size: 10
        },
        // 列表数据
        tableData: [],

        /** 分页信息 */
        pageData: {},

        /** 是否显示修改模式 */
        isShowModifyModel: false,

        /** 修改模式模板列表 */
        gridData: [],

        /** 修改模式分页 */
        pageGridData: {},

        /** 当前操作分销商 */
        currentRow: {},

        /** 参数 */
        gridParams: {}
      }
    },
    mounted() {
      this.GET_DistributorList()
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_DistributorList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_DistributorList()
      },

      /** 搜索事件触发 */
      searchEvent(data) {
        this.params = {
          page_no: 1,
          page_size: 10,
          member_name: data
        }
        this.GET_DistributorList()
      },

      /** 获取个人分销商列表 */
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

      /** 修改模式 */
      handleEditTpl(row) {
        this.isShowModifyModel = true
        this.currentRow = row
        this.GET_PerAccomplishmentTpl()
      },

      /** 获取模板列表 */
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

      /** 修改模式分页大小发生改变 */
      handleGridPageSizeChange(size) {
        this.params.page_size = size
        this.GET_PerAccomplishmentTpl()
      },

      /** 修改模式分页页数发生改变 */
      handleGridPageCurrentChange(page) {
        this.params.page_no = page
        this.GET_PerAccomplishmentTpl()
      },

      /** 保存修改模式 */
      reserveTpl() {
        const _params = {
          member_id: this.currentRow.id,
          tpl_id: this.currentRow.current_tpl_id
        }
        API_distribution.modifyTpl(_params).then(() => {
          this.$message.success('修改成功')
          this.isShowModifyModel = false
          this.GET_DistributorList()
        })
      },

      /** 营业额统计 */
      handleTurnoverStatistics(row) {
        this.$router.push({ path: '/distribution/distributor/distributor-statistics',
          query: { member_id: row.id, member_name: row.name, isAmount: 1 }})
      },

      /** 利润额统计 */
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




