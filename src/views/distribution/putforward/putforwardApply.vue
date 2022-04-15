<template>
  <div>
    <en-table-layout
      pagination
      :tableData="tableData"
      :loading="loading">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
            <!--State of the query-->
            <div class="conditions">
              <span>Status：</span>
              <el-select
                class="choose-machine"
                v-model="params.status"
                placeholder="Please select"
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
            placeholder="Please enter the keywords">
            <template slot="advanced-content">
              <el-form ref="advancedForm" :model="advancedForm" label-width="80px">
                <el-form-item label="Member name">
                  <el-input v-model="advancedForm.uname" clearable></el-input>
                </el-form-item>
                <el-form-item label="To apply for time">
                  <el-date-picker
                    v-model="advancedForm.putforward_time_range"
                    type="daterange"
                    align="center"
                    :editable="false"
                    unlink-panels
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
        <!--ID-->
        <el-table-column prop="id" label="ID"/>
        <!--To apply for time-->
        <el-table-column prop="apply_time" :formatter="MixinUnixToDate" label="To apply for time"/>
        <!--To apply for the amount-->
        <el-table-column label="To apply for the amount">
          <template slot-scope="scope">{{ scope.row.apply_money | unitPrice('￥') }}</template>
        </el-table-column>
        <!--members-->
        <el-table-column prop="member_name" label="members"/>
        <!--Withdrawal state-->
        <el-table-column prop="status" label="Withdrawal state" :formatter="withDrawStatus"/>
        <el-table-column label="Operation" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleNext(scope.row)">To view</el-button>
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
    <!--View withdrawal records-->
    <el-dialog title="View withdrawal records" :visible.sync="isShowPutForwardRecoreds" width="55%" align="center">
      <div align="center">
        <div class="d-header"> Withdraw basic information</div>
        <table class="putforawrd-baseinfo">
          <tr>
            <td>To apply for the amount</td>
            <td>{{ currentRow.apply_money  | unitPrice('￥') }}</td>
          </tr>
          <tr>
            <td>To apply for time</td>
            <td>{{ currentRow.apply_time | unixToDate }}</td>
          </tr>
          <tr>
            <td>Application note</td>
            <td>{{ currentRow.apply_remark || 'There is no' }}</td>
          </tr>
          <tr v-if="currentRow.status === 'VIA_AUDITING' || currentRow.status === 'APPLY'">
            <td>Operation</td>
            <td>
              <el-button v-if="currentRow.status === 'VIA_AUDITING'" type="success"  size="mini" @click="handleOpera('TRANSFER_ACCOUNTS')">Set as transferred</el-button>
              <el-button v-if="currentRow.status === 'APPLY'" type="success"  size="mini" @click="handleOpera('VIA_AUDITING')">Through the review</el-button>
              <el-button v-if="currentRow.status === 'APPLY'" type="danger" size="mini" @click="handleOpera('FAIL_AUDITING')">Cant pass</el-button>
            </td>
          </tr>
        </table>
        <div class="d-header"> Bank card information</div>
        <table class="putforawrd-baseinfo">
          <tr>
            <td>Account name</td>
            <td>{{bank.member_name}}</td>
          </tr>
          <tr>
            <td>Belongs to the bank</td>
            <td>{{bank.bank_name}}</td>
          </tr>
          <tr>
            <td>Bank no.</td>
            <td>{{bank.opening_num}}</td>
          </tr>
          <tr>
            <td>Bank card number</td>
            <td>{{bank.bank_card}}</td>
          </tr>
        </table>
        <!--Withdrawal log-->
        <div class="d-header"> Withdrawal log</div>
        <en-table-layout :tableData="putforwardLogs" class="pop-table" border v-if="putforwardLogs[0]">
          <template slot="table-columns">
            <el-table-column v-if="putforwardLogs[0].apply_time"  prop="apply_time" :formatter="MixinUnixToDate" label="To apply for time"/>
            <el-table-column v-if="putforwardLogs[0].apply_time"  prop="apply_remark" label="Application note"/>
            <el-table-column v-if="putforwardLogs[0].inspect_time" prop="inspect_time" :formatter="MixinUnixToDate" label="Audit time"/>
            <el-table-column v-if="putforwardLogs[0].inspect_time"  prop="inspect_remark" label="Review the note"/>
            <el-table-column v-if="putforwardLogs[0].transfer_time"  prop="transfer_time" :formatter="MixinUnixToDate" label="Transfer time"/>
            <el-table-column v-if="putforwardLogs[0].transfer_time" prop="transfer_remark" label="Transfer note"/>
            <el-table-column  prop="status" label="Status" :formatter="withDrawStatus" />
          </template>
        </en-table-layout>
      </div>
    </el-dialog>
    <!--Review the note-->
    <el-dialog title="Review the note" :visible.sync="isShowAuthRemarks" width="23%" align="center">
      <el-form>
        <el-form-item label="Review the note" label-width="80px">
          <el-input 
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="Please enter audit remarks(120characters)"
            :maxlength="120"
            v-model="authRemarks"
            clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAuthRemarks = false">cancel</el-button>
        <el-button type="primary" @click="handleRefusedAudit()">save</el-button>
      </div>
    </el-dialog>
    <!--Transfer note-->
    <el-dialog title="Transfer note" :visible.sync="isShowTransRemarks" width="23%" align="center">
      <el-form>
        <el-form-item label="Transfer note" label-width="80px">
          <el-input 
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="Please enter transfer notes(120characters)"
            :maxlength="120"
            v-model="transRemarks"
            clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowTransRemarks = false">cancel</el-button>
        <el-button type="primary" @click="handleTrans()">save</el-button>
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
        // List loading status
        loading: false,

        // A list of parameters
        params: {
          page_no: 1,
          page_size: 10,
          uname: ''
        },

        /** Advanced search parameter*/
        advancedForm: {
          uname: '',
          start_time: '',
          end_time: '',
          putforward_time_range: ''
        },

        // The list of data
        tableData: [],

        // Paging data
        pageData: [],

        /** State list*/
        statusList: [
          { label: 'Audit failure', value: 'FAIL_AUDITING' },
          { label: 'approved', value: 'VIA_AUDITING' },
          { label: 'Have transfer', value: 'TRANSFER_ACCOUNTS' },
          { label: 'In the application', value: 'APPLY' }
        ],

        /** Whether to display the withdrawal record*/
        isShowPutForwardRecoreds: false,

        /** Current line of operation*/
        currentRow: {},

        /** The bank information*/
        bank: {},

        /** Withdrawal log*/
        putforwardLogs: [],

        /** Whether to display audit notes*/
        isShowAuthRemarks: false,

        /** Review the note*/
        authRemarks: '',

        /** Whether to display transfer notes*/
        isShowTransRemarks: false,

        /** Transfer note*/
        transRemarks: '',

        /** Name of current operation*/
        operaName: ''
      }
    },
    mounted() {
      this.GET_WithdrawApplyList()
    },
    methods: {
      /** State formatting*/
      withDrawStatus(row) {
        switch (row.status) {
          case 'FAIL_AUDITING': return 'Audit failure'
          case 'VIA_AUDITING': return 'approved'
          case 'TRANSFER_ACCOUNTS': return 'Have transfer'
          case 'APPLY': return 'In the application'
        }
      },

      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_WithdrawApplyList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_WithdrawApplyList()
      },

      /** Get the withdrawal request list*/
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

      /** Change state*/
      changeStatus(val) {
        this.params = {
          ...this.params,
          status: val
        }
        this.GET_WithdrawApplyList()
      },

      /** Search Event Trigger*/
      searchEvent(data) {
        this.params = {
          ...this.params,
          keywords: data
        }
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        this.GET_WithdrawApplyList()
      },

      /** Advanced search event triggered*/
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

      /** Next step*/
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

      /** Next step*/
      handleOpera(operaName) {
        if (operaName === 'TRANSFER_ACCOUNTS') { // transfer
          this.isShowTransRemarks = true
        } else { // audit
          this.isShowAuthRemarks = true
          this.operaName = operaName
        }
      },

      /** transfer*/
      handleTrans() {
        API_distribution.setTransferAccounts({
          apply_id: this.currentRow.id, remark: this.transRemarks }).then(() => {
          this.$message.success('Transfer success')
          this.isShowTransRemarks = false
          this.GET_WithdrawApplyList()
        })
      },

      /** audit*/
      handleRefusedAudit() {
        const _params = {
          apply_id: this.currentRow.id,
          audit_result: this.operaName,
          remark: this.authRemarks
        }
        API_distribution.authWithdrawApply(_params).then(() => {
          this.$message.success('The audit results have been saved')
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

  /*Withdraw basic information*/
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
  /*Withdrawal log*/
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










