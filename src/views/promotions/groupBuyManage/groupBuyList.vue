<template>
  <div>
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddGroupBuy">添加</el-button>
          <el-button type="primary" @click="handleAddGroupBuyGoods" >新增团购商品</el-button>
        </div>
      </div>

      <template slot="table-columns">
        <el-table-column prop="act_name" label="活动名称"/>
        <el-table-column label="开始时间">
          <template slot-scope="scope">{{ scope.row.start_time | unixToDate }}</template>
        </el-table-column>
        <el-table-column label="结束时间">
          <template slot-scope="scope">{{ scope.row.end_time | unixToDate }}</template>
        </el-table-column>
        <el-table-column prop="status_text" label="活动状态"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status_text !== '未开始'"
              size="mini"
              type="primary"
            @click="handleViewGroupBuy(scope.$index, scope.row)">查看</el-button>
            <el-button
              v-if="scope.row.status_text === '未开始'"
              size="mini"
              type="primary"
              @click="handleOperateGroupBuy(scope.$index, scope.row)">管理</el-button>
            <el-button
              v-if="scope.row.status_text === '未开始'"
              size="mini"
              type="primary"
              @click="handleEditGroupBuy(scope.$index, scope.row)">修改</el-button>
            <el-button
              v-if="scope.row.status_text === '未开始'"
              size="mini"
              type="danger"
              @click="handleDeleteGroupBuy(scope.$index, scope.row)">删除</el-button>
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

    <!--添加团购 dialog-->
    <el-dialog
      :title="groupBuyForm.act_id ? '编辑团购' : '添加团购'"
      :visible.sync="dialogGroupBuyVisible"
      width="650px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="groupBuyForm" :rules="groupBuyRules" ref="groupBuyForm" label-width="120px">
        <el-form-item label="活动名称" prop="act_name">
          <el-input v-model="groupBuyForm.act_name" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="报名截止时间" prop="join_end_time">
          <el-date-picker
            v-model="groupBuyForm.join_end_time"
            type="datetime"
            :editable="false"
            value-format="timestamp"
            placeholder="报名截止时间"
            :default-time="MixinDefaultTime"
            :picker-options="{disabledDate(time) { return time.getTime() < Date.now() - 8.64E7 }}">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动时间段" prop="time_range">
          <el-date-picker
            v-model="groupBuyForm.time_range"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :editable="false"
            value-format="timestamp"
            :default-time="[MixinDefaultTime, MixinDefaultTime]"
            :picker-options="{disabledDate(time) { return time.getTime() < Date.now() - 8.64E7 }}">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGroupBuyVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddGroupBuyForm('groupBuyForm')">确 定</el-button>
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
        /** 列表loading状态 */
        loading: false,
        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10
        },

        /** 列表数据 */
        tableData: '',

        /** 添加团购 表单 */
        groupBuyForm: {},

        /** 添加团购 表单规则 */
        groupBuyRules: {
          act_name: [this.MixinRequired('请输入活动名称！')],
          time_range: [
            this.MixinRequired('请选择活动时间段！'),
            { validator: (rule, value, callback) => {
              const { join_end_time } = this.groupBuyForm
              if (!join_end_time) {
                callback()
              } else {
                value[0] > join_end_time ? callback() : callback(new Error('活动开始时间必须大于报名截止时间！'))
              }
            } }
          ],
          join_end_time: [
            this.MixinRequired('请选择截止报名时间！'),
            { validator: (rule, value, callback) => {
              const { time_range } = this.groupBuyForm
              if (!time_range) {
                callback()
              } else {
                value < time_range[0] ? callback() : callback(new Error('报名截止时间必须小于活动开始时间！'))
              }
            } }
          ]
        },

        /** 添加团购 dialog */
        dialogGroupBuyVisible: false
      }
    },
    mounted() {
      this.GET_GroupBuyList()
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_GroupBuyList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_GroupBuyList()
      },

      /** 新增团购商品商品 */
      handleAddGroupBuyGoods() {
        this.$router.push({ name: 'groupBuyGoods', query: { group_name: '新增' }, params: { callback: this.GET_GroupBuyList }})
      },
      /** 添加团购 */
      handleAddGroupBuy() {
        this.groupBuyForm = {}
        this.dialogGroupBuyVisible = true
      },

      /** 修改团购 */
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

      /** 管理团购 */
      handleOperateGroupBuy(index, row) {
        const params = { status_text: row.status_text, id: row.act_id }
        this.$router.push({ name: `groupBuyActivityManage`, params })
      },

      /** 查看团购活动 */
      handleViewGroupBuy(index, row) {
        const params = { status_text: row.status_text, id: row.act_id }
        this.$router.push({ name: `viewGroupBuyList`, params })
      },
      /** 删除团购 */
      handleDeleteGroupBuy(index, row) {
        this.$confirm('确定要删除这个团购活动吗？', '提示', { type: 'warning' }).then(() => {
          API_Promotion.deleteGroupBuyActivity(row.act_id).then(response => {
            this.$message.success('删除成功！')
            this.GET_GroupBuyList()
          })
        }).catch(() => {})
      },

      /** 添加团购 提交表单 */
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
                this.$message.success('修改成功！')
                this.GET_GroupBuyList()
              })
            } else {
              API_Promotion.addGrouBuyActivity(params).then(response => {
                this.dialogGroupBuyVisible = false
                this.GET_GroupBuyList()
                this.$message.success('添加成功！')
              })
            }
          } else {
            this.$message.error('表单填写有误，请检查！')
            return false
          }
        })
      },

      /** 获取会员列表 */
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
