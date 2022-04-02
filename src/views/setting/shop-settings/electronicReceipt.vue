<template>
  <div>
    <en-table-layout
      :toolbar="false"
      :tableData="tableData.data"
      :loading="loading"
    >
      <template slot="table-columns">
        <el-table-column prop="name" label="电子面单公司"/>
        <el-table-column label="启用状态">
          <template slot-scope="scope">
            {{ scope.row.open === 1 ? '已开启' : '已关闭' }}
            <el-button v-if="scope.row.open === 0" type="text" @click="handleOpenExpressPlatform(scope.$index, scope.row)">开启</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditElectronicReceipt(scope.$index, scope.row)">设置</el-button>
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
    <el-dialog
      title="电子面单设置"
      :visible.sync="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="electronicReceiptForm" label-width="100px">
        <el-form-item
          v-for="config in electronicReceiptForm.config_items"
          :key="config.name"
          :label="config.text"
        >
          <el-input v-model="config.value"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitElectronicReceiptForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_ElectronicReceipt from '@/api/electronicReceipt'

  export default {
    name: 'electronicReceipt',
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
        // 电子面单设置 dialog
        dialogVisible: false,
        // 电子面单设置 表单
        electronicReceiptForm: {}
      }
    },
    mounted() {
      this.GET_ElectronicReceiptList()
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_ElectronicReceiptList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_ElectronicReceiptList()
      },

      /** 修改电子面单设置 */
      handleEditElectronicReceipt(index, row) {
        this.electronicReceiptForm = this.MixinClone(row)
        this.dialogVisible = true
      },

      /** 设置电子面单 表单提交 */
      submitElectronicReceiptForm() {
        const { bean } = this.electronicReceiptForm
        API_ElectronicReceipt.editElectronicReceipt(bean, this.electronicReceiptForm).then(response => {
          this.dialogVisible = false
          this.MixinSetTableData(this.tableData, 'bean', bean, response)
          this.$message.success('修改成功！')
        })
      },

      /** 获取电子面单列表 */
      GET_ElectronicReceiptList() {
        this.loading = true
        API_ElectronicReceipt.getElectronicReceiptList(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>
