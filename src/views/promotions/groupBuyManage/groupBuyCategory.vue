<template>
  <div>
    <en-table-layout
      :tableData="tableData"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddGroupBuy">添加</el-button>
        </div>
      </div>

      <template slot="table-columns">
        <el-table-column prop="cat_name" label="活动名称"/>
        <el-table-column prop="cat_order" label="排序"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditGroupBuy(scope.$index, scope.row)">编辑</el-button>
            <el-button
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

    <!--添加团购分类 dialog-->
    <el-dialog
      title="添加团购分类"
      :visible.sync="dialogGroupBuyVisible"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="groupBuyForm" :rules="groupBuyRules" ref="groupBuyForm" label-width="120px">
        <!--分类名称-->
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="groupBuyForm.cat_name" :maxlength="20" clearable></el-input>
        </el-form-item>
        <!--排序-->
        <el-form-item label="排序" prop="cat_order">
          <el-input-number v-model="groupBuyForm.cat_order" controls-position="right" :min="1" :max="99999999"/>
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
    name: 'groupBuyCategory',
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
        tableData: '',
        // 添加团购分类 表单
        groupBuyForm: {},
        // 添加团购分类 表单规则
        groupBuyRules: {
          cat_name: [this.MixinRequired('请输入团购分类名称！')]
        },
        // 添加团购分类
        dialogGroupBuyVisible: false
      }
    },
    mounted() {
      this.GET_GroupBuyCategoryList()
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_GroupBuyCategoryList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_GroupBuyCategoryList()
      },

      /** 当选择项发生变化 */
      handleSelectionChange(val) {
        this.selectedData = val.map(item => item.id)
      },

      /** 添加团购分类 */
      handleAddGroupBuy() {
        this.groupBuyForm = {
          cat_order: (() => Math.max.apply(null, this.tableData.map(item => item.cat_order)))() + 1
        }
        this.dialogGroupBuyVisible = true
      },

      /** 编辑团购分类 */
      handleEditGroupBuy(index, row) {
        this.groupBuyForm = this.MixinClone(row)
        this.dialogGroupBuyVisible = true
      },

      /** 删除团购分类 */
      handleDeleteGroupBuy(index, row) {
        this.$confirm('确定要删除这个团购分类吗？', '提示', { type: 'warning' }).then(() => {
          API_Promotion.deleteGroupBuyCategory(row.cat_id).then(() => {
            this.GET_GroupBuyCategoryList()
            this.$message.success('删除成功！')
          })
        }).catch(() => {})
      },

      /** 添加团购分类 提交表单 */
      submitAddGroupBuyForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const { cat_id } = this.groupBuyForm
            if (cat_id) {
              API_Promotion.editGroupBuyCategory(cat_id, this.groupBuyForm).then(response => {
                this.dialogGroupBuyVisible = false
                this.$message.success('编辑成功！')
                this.GET_GroupBuyCategoryList()
              })
            } else {
              API_Promotion.addGroupBuyCategory(this.groupBuyForm).then(response => {
                this.dialogGroupBuyVisible = false
                this.$message.success('添加成功！')
                this.GET_GroupBuyCategoryList()
              })
            }
          } else {
            this.$message.error('表单填写有误，请检查！')
            return false
          }
        })
      },

      /** 获取会员列表 */
      GET_GroupBuyCategoryList() {
        this.loading = true
        API_Promotion.getGroupBuyCategory(this.params).then(response => {
          this.loading = false
          this.tableData = response.data
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>
