<template>
  <div>
    <en-table-layout
      pagination
      :tableData="tableData"
      :loading="loading">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
            <!--状态查询-->
            <div class="conditions">
              <span>状态：</span>
              <el-select
                class="choose-machine"
                v-model="params.status"
                placeholder="请选择"
                @change="changeStatus"
              clearable>
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
        <div class="toolbar-search">
          <en-table-search
            @search="searchEvent"
            @advancedSearch="advancedSearchEvent"
            advanced
            :showSearch="false"
            advancedWidth="465"
            placeholder="请输入关键字">
            <template slot="advanced-content">
              <el-form ref="advancedForm" :model="advancedForm" label-width="80px">
                <el-form-item label="会员姓名">
                  <el-input v-model="advancedForm.uname" clearable></el-input>
                </el-form-item>
                <el-form-item label="申请时间">
                  <el-date-picker
                    v-model="advancedForm.putforward_time_range"
                    type="daterange"
                    align="center"
                    :editable="false"
                    unlink-panels
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
        <!--ID-->
        <el-table-column prop="id" label="ID"/>
        <!--申请时间-->
        <el-table-column prop="apply_time" :formatter="MixinUnixToDate" label="申请时间"/>
        <!--申请金额-->
        <el-table-column label="申请金额">
          <template slot-scope="scope">{{ scope.row.apply_money | unitPrice('￥') }}</template>
        </el-table-column>
        <!--会员-->
        <el-table-column prop="member_name" label="会员"/>
        <!--提现状态-->
        <el-table-column prop="status" label="提现状态" :formatter="withDrawStatus"/>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleNext(scope.row)">查看</el-button>
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
    <!--查看提现记录-->
    <el-dialog title="查看提现记录" :visible.sync="isShowPutForwardRecoreds" width="55%" align="center">
      <div align="center">
        <div class="d-header"> 提现基本信息 </div>
        <table class="putforawrd-baseinfo">
          <tr>
            <td>申请金额</td>
            <td>{{ currentRow.apply_money  | unitPrice('￥') }}</td>
          </tr>
          <tr>
            <td>申请时间</td>
            <td>{{ currentRow.apply_time | unixToDate }}</td>
          </tr>
          <tr>
            <td>申请备注</td>
            <td>{{ currentRow.apply_remark || '无' }}</td>
          </tr>
          <tr v-if="currentRow.status === 'VIA_AUDITING' || currentRow.status === 'APPLY'">
            <td>操作</td>
            <td>
              <el-button v-if="currentRow.status === 'VIA_AUDITING'" type="success"  size="mini" @click="handleOpera('TRANSFER_ACCOUNTS')">设为已转账</el-button>
              <el-button v-if="currentRow.status === 'APPLY'" type="success"  size="mini" @click="handleOpera('VIA_AUDITING')">通过审核</el-button>
              <el-button v-if="currentRow.status === 'APPLY'" type="danger" size="mini" @click="handleOpera('FAIL_AUDITING')">不能通过</el-button>
            </td>
          </tr>
        </table>
        <div class="d-header"> 银行卡信息 </div>
        <table class="putforawrd-baseinfo">
          <tr>
            <td>户名</td>
            <td>{{bank.member_name}}</td>
          </tr>
          <tr>
            <td>所属银行</td>
            <td>{{bank.bank_name}}</td>
          </tr>
          <tr>
            <td>开户行号</td>
            <td>{{bank.opening_num}}</td>
          </tr>
          <tr>
            <td>银行卡号</td>
            <td>{{bank.bank_card}}</td>
          </tr>
        </table>
        <!--提现日志-->
        <div class="d-header"> 提现日志 </div>
        <en-table-layout :tableData="putforwardLogs" class="pop-table" border v-if="putforwardLogs[0]">
          <template slot="table-columns">
            <el-table-column v-if="putforwardLogs[0].apply_time"  prop="apply_time" :formatter="MixinUnixToDate" label="申请时间"/>
            <el-table-column v-if="putforwardLogs[0].apply_time"  prop="apply_remark" label="申请备注"/>
            <el-table-column v-if="putforwardLogs[0].inspect_time" prop="inspect_time" :formatter="MixinUnixToDate" label="审核时间"/>
            <el-table-column v-if="putforwardLogs[0].inspect_time"  prop="inspect_remark" label="审核备注"/>
            <el-table-column v-if="putforwardLogs[0].transfer_time"  prop="transfer_time" :formatter="MixinUnixToDate" label="转账时间"/>
            <el-table-column v-if="putforwardLogs[0].transfer_time" prop="transfer_remark" label="转账备注"/>
            <el-table-column  prop="status" label="状态" :formatter="withDrawStatus" />
          </template>
        </en-table-layout>
      </div>
    </el-dialog>
    <!--审核备注-->
    <el-dialog title="审核备注" :visible.sync="isShowAuthRemarks" width="23%" align="center">
      <el-form>
        <el-form-item label="审核备注" label-width="80px">
          <el-input 
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入审核备注(120字以内)"
            :maxlength="120"
            v-model="authRemarks"
            clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAuthRemarks = false">取 消</el-button>
        <el-button type="primary" @click="handleRefusedAudit()">确 定</el-button>
      </div>
    </el-dialog>
    <!--转账备注-->
    <el-dialog title="转账备注" :visible.sync="isShowTransRemarks" width="23%" align="center">
      <el-form>
        <el-form-item label="转账备注" label-width="80px">
          <el-input 
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入转账备注(120字以内)"
            :maxlength="120"
            v-model="transRemarks"
            clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowTransRemarks = false">取 消</el-button>
        <el-button type="primary" @click="handleTrans()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_distribution from '@/api/distribution'
  export default {
    name: 'put-forward-apply',
    data() {
      return {
        // 列表loading状态
        loading: false,

        // 列表参数
        params: {
          page_no: 1,
          page_size: 10,
          uname: ''
        },

        /** 高级搜索参数 */
        advancedForm: {
          uname: '',
          start_time: '',
          end_time: '',
          putforward_time_range: ''
        },

        // 列表数据
        tableData: [],

        // 分页数据
        pageData: [],

        /** 状态列表 */
        statusList: [
          { label: '审核失败', value: 'FAIL_AUDITING' },
          { label: '审核通过', value: 'VIA_AUDITING' },
          { label: '已转账', value: 'TRANSFER_ACCOUNTS' },
          { label: '申请中', value: 'APPLY' }
        ],

        /** 是否显示提现记录 */
        isShowPutForwardRecoreds: false,

        /** 当前操作行 */
        currentRow: {},

        /** 银行信息 */
        bank: {},

        /** 提现日志 */
        putforwardLogs: [],

        /** 是否显示审核备注 */
        isShowAuthRemarks: false,

        /** 审核备注 */
        authRemarks: '',

        /** 是否显示转账备注 */
        isShowTransRemarks: false,

        /** 转账备注 */
        transRemarks: '',

        /** 当前操作名称 */
        operaName: ''
      }
    },
    mounted() {
      this.GET_WithdrawApplyList()
    },
    methods: {
      /** 状态格式化 */
      withDrawStatus(row) {
        switch (row.status) {
          case 'FAIL_AUDITING': return '审核失败'
          case 'VIA_AUDITING': return '审核通过'
          case 'TRANSFER_ACCOUNTS': return '已转账'
          case 'APPLY': return '申请中'
        }
      },

      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_WithdrawApplyList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_WithdrawApplyList()
      },

      /** 获取提现申请列表 */
      GET_WithdrawApplyList() {
        this.loading = true
        API_distribution.getWithdrawApplyList(this.params).then(response => {
          this.loading = false
          this.tableData = response.data
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
        })
      },

      /** 改变状态 */
      changeStatus(val) {
        this.params = {
          ...this.params,
          status: val
        }
        this.GET_WithdrawApplyList()
      },

      /** 搜索事件触发 */
      searchEvent(data) {
        this.params = {
          ...this.params,
          keywords: data
        }
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        this.GET_WithdrawApplyList()
      },

      /** 高级搜索事件触发 */
      advancedSearchEvent() {
        this.params = {
          ...this.params,
          ...this.advancedForm
        }
        delete this.params.start_time
        delete this.params.end_time
        if (this.advancedForm.putforward_time_range) {
          this.params.start_time = this.advancedForm.putforward_time_range[0].getTime() / 1000
          this.params.end_time = this.advancedForm.putforward_time_range[1].getTime() / 1000
        }
        delete this.params.keywords
        delete this.params.putforward_time_range
        this.GET_WithdrawApplyList()
      },

      /** 下一步操作 */
      handleNext(row) {
        this.isShowPutForwardRecoreds = true
        this.currentRow = row
        this.bank = this.currentRow.bank_params_vo
        console.log(this.currentRow)
        this.putforwardLogs = [{
          'apply_time': row.apply_time,
          'apply_remark': row.apply_remark,
          'inspect_time': row.inspect_time,
          'inspect_remark': row.inspect_remark,
          'transfer_time': row.transfer_time,
          'transfer_remark': row.transfer_remark,
          'status': row.status
        }]
      },

      /** 下一步操作 */
      handleOpera(operaName) {
        if (operaName === 'TRANSFER_ACCOUNTS') { // 转账
          this.isShowTransRemarks = true
        } else { // 审核
          this.isShowAuthRemarks = true
          this.operaName = operaName
        }
      },

      /** 转账 */
      handleTrans() {
        API_distribution.setTransferAccounts({
          apply_id: this.currentRow.id, remark: this.transRemarks }).then(() => {
          this.$message.success('转账成功')
          this.isShowTransRemarks = false
          this.GET_WithdrawApplyList()
        })
      },

      /** 审核 */
      handleRefusedAudit() {
        const _params = {
          apply_id: this.currentRow.id,
          audit_result: this.operaName,
          remark: this.authRemarks
        }
        API_distribution.authWithdrawApply(_params).then(() => {
          this.$message.success('已保存审核结果')
          this.GET_WithdrawApplyList()
          this.isShowAuthRemarks = false
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
    padding: 0 20px;
  }
  .conditions {
    span {
      font-size: 14px;
      color: #666;
    }
  }

  /*提现基本信息*/
  .putforawrd-baseinfo {
    width: 100%;
    border: 1px solid #ddd;
    border-collapse: collapse;
    tr, td {
      border: 1px solid #ddd;
      border-collapse: collapse;
      line-height: 40px;
      padding: 0 15px;
      word-break: break-all;
    }
    td:first-child {
      width: 200px;
    }
  }
  /*提现日志*/
  div.d-header {
    width: 100%;
    line-height: 40px;
    background-color: #eee;
    text-align: left;
    padding:0 15px;
    & + .container {
      padding: 0;
      /deep/ .toolbar {
        display: none;
      }
    }
  }

</style>










