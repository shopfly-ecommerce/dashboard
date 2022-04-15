<template>
  <div>
    <en-table-layout
      :tableData="tableData"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddGroupBuy">add</el-button>
        </div>
      </div>

      <template slot="table-columns">
        <el-table-column prop="cat_name" label="The name of the event"/>
        <el-table-column prop="cat_order" label="sort"/>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditGroupBuy(scope.$index, scope.row)">edit</el-button>
            <el-button
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

    <!--Add group Purchase categorydialog-->
    <el-dialog
      title="Add group Purchase category"
      :visible.sync="dialogGroupBuyVisible"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="groupBuyForm" :rules="groupBuyRules" ref="groupBuyForm" label-width="120px">
        <!--name-->
        <el-form-item label="name" prop="cat_name">
          <el-input v-model="groupBuyForm.cat_name" :maxlength="20" clearable></el-input>
        </el-form-item>
        <!--sort-->
        <el-form-item label="sort" prop="cat_order">
          <el-input-number v-model="groupBuyForm.cat_order" controls-position="right" :min="1" :max="99999999"/>
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
    name: 'groupBuyCategory',
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
        tableData: '',
        // Add the group purchase category form
        groupBuyForm: {},
        // Add group purchase category form rules
        groupBuyRules: {
          cat_name: [this.MixinRequired('Please enter the group purchase category name！')]
        },
        // Add group Purchase category
        dialogGroupBuyVisible: false
      }
    },
    mounted() {
      this.GET_GroupBuyCategoryList()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_GroupBuyCategoryList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_GroupBuyCategoryList()
      },

      /** When the selection changes*/
      handleSelectionChange(val) {
        this.selectedData = val.map(item => item.id)
      },

      /** Add group Purchase category*/
      handleAddGroupBuy() {
        this.groupBuyForm = {
          cat_order: (() => Math.max.apply(null, this.tableData.map(item => item.cat_order)))() + 1
        }
        this.dialogGroupBuyVisible = true
      },

      /** Edit the Group Purchase category*/
      handleEditGroupBuy(index, row) {
        this.groupBuyForm = this.MixinClone(row)
        this.dialogGroupBuyVisible = true
      },

      /** Delete group purchase category*/
      handleDeleteGroupBuy(index, row) {
        this.$confirm('Are you sure you want to delete this group purchase category？', 'prompt', { type: 'warning' }).then(() => {
          API_Promotion.deleteGroupBuyCategory(row.cat_id).then(() => {
            this.GET_GroupBuyCategoryList()
            this.$message.success('Delete the success！')
          })
        }).catch(() => {})
      },

      /** Add group purchase category submission form*/
      submitAddGroupBuyForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const { cat_id } = this.groupBuyForm
            if (cat_id) {
              API_Promotion.editGroupBuyCategory(cat_id, this.groupBuyForm).then(response => {
                this.dialogGroupBuyVisible = false
                this.$message.success('Edit success！')
                this.GET_GroupBuyCategoryList()
              })
            } else {
              API_Promotion.addGroupBuyCategory(this.groupBuyForm).then(response => {
                this.dialogGroupBuyVisible = false
                this.$message.success('Add a success！')
                this.GET_GroupBuyCategoryList()
              })
            }
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },

      /** Get membership list*/
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
