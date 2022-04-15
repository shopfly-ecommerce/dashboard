<template>
  <div>
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddGroupBuy">add</el-button>
          <el-button type="primary" @click="handleAddGroupBuyGoods" >New group purchase products</el-button>
        </div>
      </div>

      <template slot="table-columns">
        <el-table-column prop="act_name" label="The name of the event"/>
        <el-table-column label="The start time">
          <template slot-scope="scope">{{ scope.row.start_time | unixToDate }}</template>
        </el-table-column>
        <el-table-column label="The end of time">
          <template slot-scope="scope">{{ scope.row.end_time | unixToDate }}</template>
        </el-table-column>
        <el-table-column prop="status_text" label="Active state"/>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status_text !== 'Not at the'"
              size="mini"
              type="primary"
            @click="handleViewGroupBuy(scope.$index, scope.row)">To view</el-button>
            <el-button
              v-if="scope.row.status_text === 'Not at the'"
              size="mini"
              type="primary"
              @click="handleOperateGroupBuy(scope.$index, scope.row)">management</el-button>
            <el-button
              v-if="scope.row.status_text === 'Not at the'"
              size="mini"
              type="primary"
              @click="handleEditGroupBuy(scope.$index, scope.row)">edit</el-button>
            <el-button
              v-if="scope.row.status_text === 'Not at the'"
              size="mini"
              type="danger"
              @click="handleDeleteGroupBuy(scope.$index, scope.row)">delete</el-button>
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

    <!--Add a coupondialog-->
    <el-dialog
      :title="groupBuyForm.act_id ? 'Editing group purchase' : 'Add a coupon'"
      :visible.sync="dialogGroupBuyVisible"
      width="650px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="groupBuyForm" :rules="groupBuyRules" ref="groupBuyForm" label-width="120px">
        <el-form-item label="The name of the event" prop="act_name">
          <el-input v-model="groupBuyForm.act_name" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="Deadline for registration" prop="join_end_time">
          <el-date-picker
            v-model="groupBuyForm.join_end_time"
            type="datetime"
            :editable="false"
            value-format="timestamp"
            placeholder="Deadline for registration"
            :default-time="MixinDefaultTime"
            :picker-options="{disabledDate(time) { return time.getTime() < Date.now() - 8.64E7 }}">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Activity period" prop="time_range">
          <el-date-picker
            v-model="groupBuyForm.time_range"
            type="datetimerange"
            range-separator="-"
            start-placeholder="The start time"
            end-placeholder="The end of time"
            :editable="false"
            value-format="timestamp"
            :default-time="[MixinDefaultTime, MixinDefaultTime]"
            :picker-options="{disabledDate(time) { return time.getTime() < Date.now() - 8.64E7 }}">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGroupBuyVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitAddGroupBuyForm('groupBuyForm')">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_Promotion from '@/api/groupBuy'

  export default {
    name: 'groupBuyList',
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
        tableData: '',

        /** Add a group purchase form*/
        groupBuyForm: {},

        /** Add group purchase form rules*/
        groupBuyRules: {
          act_name: [this.MixinRequired('Please enter the activity name！')],
          time_range: [
            this.MixinRequired('Please select a period of activity！'),
            { validator: (rule, value, callback) => {
              const { join_end_time } = this.groupBuyForm
              if (!join_end_time) {
                callback()
              } else {
                value[0] > join_end_time ? callback() : callback(new Error('The start time must be longer than the deadline for registration！'))
              }
            } }
          ],
          join_end_time: [
            this.MixinRequired('Please select the deadline for registration！'),
            { validator: (rule, value, callback) => {
              const { time_range } = this.groupBuyForm
              if (!time_range) {
                callback()
              } else {
                value < time_range[0] ? callback() : callback(new Error('The deadline for registration must be less than the start time！'))
              }
            } }
          ]
        },

        /** Add a coupondialog */
        dialogGroupBuyVisible: false
      }
    },
    mounted() {
      this.GET_GroupBuyList()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_GroupBuyList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_GroupBuyList()
      },

      /** Add group purchase merchandise merchandise*/
      handleAddGroupBuyGoods() {
        this.$router.push({ name: 'groupBuyGoods', query: { group_name: 'new' }, params: { callback: this.GET_GroupBuyList }})
      },
      /** Add a coupon*/
      handleAddGroupBuy() {
        this.groupBuyForm = {}
        this.dialogGroupBuyVisible = true
      },

      /** Modify the group-buying*/
      handleEditGroupBuy(index, row) {
        const params = this.MixinClone(row)
        params.join_end_time *= 1000
        params.time_range = [
          params.start_time *= 1000,
          params.end_time *= 1000
        ]
        this.groupBuyForm = params
        this.dialogGroupBuyVisible = true
      },

      /** Management group*/
      handleOperateGroupBuy(index, row) {
        const params = { status_text: row.status_text, id: row.act_id }
        this.$router.push({ name: `groupBuyActivityManage`, params })
      },

      /** Check out group-buying activities*/
      handleViewGroupBuy(index, row) {
        const params = { status_text: row.status_text, id: row.act_id }
        this.$router.push({ name: `viewGroupBuyList`, params })
      },
      /** Delete the group purchase*/
      handleDeleteGroupBuy(index, row) {
        this.$confirm('Are you sure you want to delete this deal？', 'prompt', { type: 'warning' }).then(() => {
          API_Promotion.deleteGroupBuyActivity(row.act_id).then(response => {
            this.$message.success('Delete the success！')
            this.GET_GroupBuyList()
          })
        }).catch(() => {})
      },

      /** Add a group purchase submission form*/
      submitAddGroupBuyForm(formName) {
        const _time_range = this.groupBuyForm.time_range
        this.$refs[formName].validate((valid) => {
          const params = this.MixinClone(this.groupBuyForm)
          if (valid) {
            const { act_id } = params
            params.join_end_time /= 1000
            params.start_time = _time_range[0] / 1000
            params.end_time = _time_range[1] / 1000
            if (act_id) {
              API_Promotion.editGroupBuyActivity(act_id, params).then(response => {
                this.dialogGroupBuyVisible = false
                this.$message.success('Modify the success！')
                this.GET_GroupBuyList()
              })
            } else {
              API_Promotion.addGrouBuyActivity(params).then(response => {
                this.dialogGroupBuyVisible = false
                this.GET_GroupBuyList()
                this.$message.success('Add a success！')
              })
            }
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },

      /** Get membership list*/
      GET_GroupBuyList() {
        this.loading = true
        API_Promotion.getGroupBuyActives(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>
