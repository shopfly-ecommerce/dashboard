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
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddSeckill">添加</el-button>
        </div>
        <div class="toolbar-search">
          <en-table-search @search="searchEvent"></en-table-search>
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column prop="seckill_name" label="活动名称"/>
        <el-table-column label="活动时间" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.start_day | unixToDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报名截止时间" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.apply_end_time | unixToDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="seckill_status_text" />
        <el-table-column prop="seckill_rule" label="报名条件"/>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              v-if="scope.row.is_apply === 0"
              @click="handleSignUpTimeLimt(scope.row)">报名
            </el-button>
            <el-button
              v-if="scope.row.seckill_status === 'EDITING'"
              size="mini"
              type="primary"
              @click="handleEditSeckill(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="primary"
              @click="activityGoodsInfo(scope.row)">查看商品
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
        <el-form-item label="活动名称" prop="seckill_name">
          <el-input v-model="seckillForm.seckill_name" :maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="报名截止时间" prop="apply_end_time">
          <el-date-picker
            v-model="seckillForm.apply_end_time"
            type="datetime"
            placeholder="选择报名截止时间"
            :editable="false"
            :default-time="MixinDefaultTime"
            value-format="timestamp"
            :picker-options="{disabledDate(time) { return time.getTime() < Date.now() - 8.64E7 }}">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动时间" prop="start_day">
          <el-date-picker
            v-model="seckillForm.start_day"
            type="date"
            :editable="false"
            :default-time="MixinDefaultTime"
            placeholder="选择活动日期"
            value-format="timestamp"
            :picker-options="{disabledDate(time) { return time.getTime() < Date.now() - 8.64E7 }}">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="抢购阶段" prop="range_list">
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
          <el-button v-else class="button-new-tag" size="small" @click="showTagInput">+ 添加时间段</el-button>
        </el-form-item>
        <el-form-item label="申请规则" prop="seckill_rule">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入申请规则"
            v-model="seckillForm.seckill_rule"
            :maxlength="200"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSeckillVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSeckillForm('release')">立即发布</el-button>
        <el-button type="primary" @click="submitSeckillForm('save')">保 存</el-button>
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
        /** 列表loading状态 */
        loading: false,

        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10
        },

        /** 列表数据 */
        tableData: [],

        /** 添加、编辑限时抢购 dialog */
        dialogSeckillVisible: false,

        /** 添加、编辑限时抢购 表单 */
        seckillForm: {},

        /** 添加、编辑限时抢购 表单规则 */
        seckillRules: {
          seckill_name: [this.MixinRequired('请输入活动名称！')],
          apply_end_time: [this.MixinRequired('请选择截止报名时间！')],
          start_day: [this.MixinRequired('请选择活动日期！')],
          range_list: [{ type: 'array', required: true, message: '请至少添加一个时间段', trigger: 'change' }],
          seckill_rule: [this.MixinRequired('申请规则不能为空！')]
        },

        /** 列表分页数据 */
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
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_LimitActivityList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_LimitActivityList()
      },

      /** 搜索事件触发 */
      searchEvent(data) {
        delete this.params.keywords
        this.params = {
          ...this.params,
          keywords: data
        }
        this.GET_LimitActivityList()
      },

      /** 获取限时活动列表*/
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

      /** 报名 */
      handleSignUpTimeLimt(row) {
        this.$router.push({ name: 'addTimeLimit', params: { id: row.seckill_id, callback: this.GET_LimitActivityList }})
      },

      /** 编辑限时抢购 */
      handleEditSeckill(index, row) {
        API_limitTime.getLimitTimeActivityDetails(row.seckill_id).then(response => {
          this.seckillForm = response
          this.seckillForm.apply_end_time *= 1000
          this.seckillForm.start_day *= 1000
        })
        this.timeLimitDialogTital = '编辑限时抢购'
        this.dialogSeckillVisible = true
      },

      /** 添加限时抢购 */
      handleAddSeckill() {
        this.seckillForm = { range_list: [] }
        this.timeLimitDialogTital = '添加限时抢购'
        this.dialogSeckillVisible = true
      },

      // 显示时间段Tag输入框
      showTagInput() {
        this.inputVisible = true
        this.$nextTick(_ => {
          // 定时器 为了解决火狐浏览器对focus的兼容性问题
          setTimeout(() => this.$refs.saveTagInput.$refs.input.focus(), 50)
        })
      },

      // 时间段Tag输入确认事件
      handleTagInputConfirm() {
        let inputValue = this.inputValue
        const { range_list } = this.seckillForm
        if (inputValue !== undefined && inputValue !== '') {
          if (inputValue < 0 || inputValue > 23) {
            this.$message.error('时间段应在0-23之间！')
            this.$refs.saveTagInput.$refs.input.focus()
            return false
          }
          if (inputValue <= range_list[range_list.length - 1]) {
            this.$message.error('不能小于或等于上一时间段！')
            this.$refs.saveTagInput.$refs.input.focus()
            return false
          }
          range_list.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
      },

      /** 提交限时抢购表单 */
      submitSeckillForm(type) {
        this.$refs['seckillForm'].validate((valid) => {
          if (valid) {
            let { seckill_id } = this.seckillForm
            const params = this.MixinClone(this.seckillForm)
            params.apply_end_time /= 1000
            params.start_day /= 1000
            if (params.apply_end_time >= params.start_day) {
              this.$message.error('报名截止时间不能大于活动开始时间！')
              return
            }
            if (type === 'save') {
              if (!seckill_id) {
                API_limitTime.addSeckill(params).then(response => {
                  this.dialogSeckillVisible = false
                  this.$message.success('添加成功！')
                  this.GET_LimitActivityList()
                })
              } else {
                API_limitTime.editSeckill(seckill_id, params).then(response => {
                  this.dialogSeckillVisible = false
                  this.$message.success('编辑成功！')
                  this.GET_LimitActivityList()
                })
              }
            } else {
              if (!seckill_id) seckill_id = 0
              API_limitTime.releaseSeckill(seckill_id, params).then(() => {
                this.dialogSeckillVisible = false
                this.$message.success('发布成功！')
                this.GET_LimitActivityList()
              })
            }
          } else {
            this.$message.error('表单填写有误，请检查！')
            return false
          }
        })
      },

      /** 活动商品信息 已报名*/
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
