<template>
  <div>
    <en-table-layout
      toolbar
      pagination
      :tableData="tableData"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddSeckill">add</el-button>
        </div>
        <div class="toolbar-search">
          <en-table-search @search="searchEvent"></en-table-search>
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column prop="seckill_name" label="The name of the event"/>
        <el-table-column label="The activity time" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.start_day | unixToDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Deadline for registration" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.apply_end_time | unixToDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Status" prop="seckill_status_text" />
        <el-table-column prop="seckill_rule" label="Application conditions"/>
        <el-table-column label="Operation" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              v-if="scope.row.is_apply === 0"
              @click="handleSignUpTimeLimt(scope.row)">To sign up
            </el-button>
            <el-button
              v-if="scope.row.seckill_status === 'EDITING'"
              size="mini"
              type="primary"
              @click="handleEditSeckill(scope.$index, scope.row)"
            >edit</el-button>
            <el-button
              type="primary"
              @click="activityGoodsInfo(scope.row)">To check the goods
            </el-button>
          </template>
        </el-table-column>
      </template>
      <el-pagination
        slot="pagination"
        v-if="pageData"
        @size-change="handlePageSizeChange"
        @current-change="handlePageCurrentChange"
        :current-page="pageData.page_no"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageData.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.data_total">
      </el-pagination>
    </en-table-layout>
    <el-dialog
      :title="timeLimitDialogTital"
      :visible.sync="dialogSeckillVisible"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="seckillForm" :rules="seckillRules" ref="seckillForm" label-width="120px">
        <el-form-item label="The name of the event" prop="seckill_name">
          <el-input v-model="seckillForm.seckill_name" :maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="Deadline for registration" prop="apply_end_time">
          <el-date-picker
            v-model="seckillForm.apply_end_time"
            type="datetime"
            placeholder="Select the deadline for registration"
            :editable="false"
            :default-time="MixinDefaultTime"
            value-format="timestamp"
            :picker-options="{disabledDate(time) { return time.getTime() < Date.now() - 8.64E7 }}">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="The activity time" prop="start_day">
          <el-date-picker
            v-model="seckillForm.start_day"
            type="date"
            :editable="false"
            :default-time="MixinDefaultTime"
            placeholder="Select activity date"
            value-format="timestamp"
            :picker-options="{disabledDate(time) { return time.getTime() < Date.now() - 8.64E7 }}">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Snap up stage" prop="range_list">
          <el-tag
            :key="tag"
            v-for="tag in seckillForm.range_list"
            closable
            :disable-transitions="false"
            class="time-tag"
            @close="() => { seckillForm.range_list.splice(seckillForm.range_list.indexOf(tag), 1) }">
            {{ tag < 10 ? '0' + tag : tag }} : 00
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model.number="inputValue"
            type="number"
            autofocus
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleTagInputConfirm"
            @blur="handleTagInputConfirm"
            :min="0" :max="23"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showTagInput">+ Add time period</el-button>
        </el-form-item>
        <el-form-item label="Apply the rules" prop="seckill_rule">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="Please enter application rules"
            v-model="seckillForm.seckill_rule"
            :maxlength="200"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSeckillVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitSeckillForm('release')">Immediately release</el-button>
        <el-button type="primary" @click="submitSeckillForm('save')">save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_limitTime from '@/api/limitTime'
  import { CategoryPicker } from '@/components'

  export default {
    name: 'timeLimit',
    components: {
      [CategoryPicker.name]: CategoryPicker
    },
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
        tableData: [],

        /** add、Edit flash salesdialog */
        dialogSeckillVisible: false,

        /** add、Edit the flash sale form*/
        seckillForm: {},

        /** add、Edit the flash sale form rules*/
        seckillRules: {
          seckill_name: [this.MixinRequired('Please enter the activity name！')],
          apply_end_time: [this.MixinRequired('Please select the deadline for registration！')],
          start_day: [this.MixinRequired('Please select the event date！')],
          range_list: [{ type: 'array', required: true, message: 'Please add at least one time period', trigger: 'change' }],
          seckill_rule: [this.MixinRequired('The application rule cannot be null！')]
        },

        /** List paging data*/
        pageData: [],

        timeLimitDialogTital: '',

        inputVisible: false,

        inputValue: ''
      }
    },
    mounted() {
      this.GET_LimitActivityList()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_LimitActivityList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_LimitActivityList()
      },

      /** Search Event Trigger*/
      searchEvent(data) {
        delete this.params.keywords
        this.params = {
          ...this.params,
          keywords: data
        }
        this.GET_LimitActivityList()
      },

      /** Gets a list of time-limited activities*/
      GET_LimitActivityList() {
        this.loading = true
        API_limitTime.getLimitTimeActivityList(this.params).then(response => {
          this.loading = false
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
          this.tableData = response.data
        })
      },

      /** To sign up*/
      handleSignUpTimeLimt(row) {
        this.$router.push({ name: 'addTimeLimit', params: { id: row.seckill_id, callback: this.GET_LimitActivityList }})
      },

      /** Edit flash sales*/
      handleEditSeckill(index, row) {
        API_limitTime.getLimitTimeActivityDetails(row.seckill_id).then(response => {
          this.seckillForm = response
          this.seckillForm.apply_end_time *= 1000
          this.seckillForm.start_day *= 1000
        })
        this.timeLimitDialogTital = 'Edit flash sales'
        this.dialogSeckillVisible = true
      },

      /** Add flash sales*/
      handleAddSeckill() {
        this.seckillForm = { range_list: [] }
        this.timeLimitDialogTital = 'Add flash sales'
        this.dialogSeckillVisible = true
      },

      // Displays the time period Tag input box
      showTagInput() {
        this.inputVisible = true
        this.$nextTick(_ => {
          // The timer was designed to solve the firefox compatibility problem with the Focus
          setTimeout(() => this.$refs.saveTagInput.$refs.input.focus(), 50)
        })
      },

      // Time period Tag input confirmation event
      handleTagInputConfirm() {
        let inputValue = this.inputValue
        const { range_list } = this.seckillForm
        if (inputValue !== undefined && inputValue !== '') {
          if (inputValue < 0 || inputValue > 23) {
            this.$message.error('The time period should be0-23between！')
            this.$refs.saveTagInput.$refs.input.focus()
            return false
          }
          if (inputValue <= range_list[range_list.length - 1]) {
            this.$message.error('It cant be less than or equal to the last period！')
            this.$refs.saveTagInput.$refs.input.focus()
            return false
          }
          range_list.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
      },

      /** Submit a flash sale form*/
      submitSeckillForm(type) {
        this.$refs['seckillForm'].validate((valid) => {
          if (valid) {
            let { seckill_id } = this.seckillForm
            const params = this.MixinClone(this.seckillForm)
            params.apply_end_time /= 1000
            params.start_day /= 1000
            if (params.apply_end_time >= params.start_day) {
              this.$message.error('The deadline for registration should not be longer than the start time of the activity！')
              return
            }
            if (type === 'save') {
              if (!seckill_id) {
                API_limitTime.addSeckill(params).then(response => {
                  this.dialogSeckillVisible = false
                  this.$message.success('Add a success！')
                  this.GET_LimitActivityList()
                })
              } else {
                API_limitTime.editSeckill(seckill_id, params).then(response => {
                  this.dialogSeckillVisible = false
                  this.$message.success('Edit success！')
                  this.GET_LimitActivityList()
                })
              }
            } else {
              if (!seckill_id) seckill_id = 0
              API_limitTime.releaseSeckill(seckill_id, params).then(() => {
                this.dialogSeckillVisible = false
                this.$message.success('Release success！')
                this.GET_LimitActivityList()
              })
            }
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },

      /** Activity commodity information has been registered*/
      activityGoodsInfo(row) {
        this.$router.push({ path: `/promotions/activity-goods-data/${row.seckill_id}` })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ div.toolbar {
    height: 70px;
    padding: 20px 0;
  }

  /deep/ .el-table td:not(.is-left) {
    text-align: center;
  }

  .inner-toolbar {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  .toolbar-search {
    margin-right: 10px;
  }

  .goods-image {
    width: 50px;
    height: 50px;
  }

</style>
