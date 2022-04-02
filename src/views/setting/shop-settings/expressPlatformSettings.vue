<template>
  <div>
    <en-table-layout
      :toolbar="false"
      :tableData="tableData.data"
      :loading="loading"
    >
      <template slot="table-columns">
        <el-table-column prop="name" label="平台名称"/>
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
              @click="handleEditExpressPlatform(scope.$index, scope.row)">修改</el-button>
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
      :title="'修改快递平台 - ' + expressForm.name"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form :model="expressForm" label-width="120px">
        <template v-for="(config, index) in expressForm.config_items">
          <el-form-item :label="config.text" prop="desc">
            <el-input v-if="config.type === 'text'" type="textarea" v-model="config.value" :autosize="{ minRows: 1, maxRows: 4}"></el-input>
            <el-radio-group v-else-if="config.type === 'radio'" v-model="config.value">
              <el-radio v-for="option in config.options" :key="option.value" :label="option.value">{{ option.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitExpressForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_ExpressPlatform from '@/api/expressPlatform'

  export default {
    name: 'expressPlatformSettings',
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
        // 快递平台表单
        expressForm: {},
        // 修改快递平台 dialog
        dialogVisible: false
      }
    },
    mounted() {
      this.GET_ExpressPlatformList()
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_ExpressPlatformList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_ExpressPlatformList()
      },

      /** 开启快递平台 */
      handleOpenExpressPlatform(index, row) {
        API_ExpressPlatform.openExpressPlatformById(row.bean).then(response => {
          this.$message.success('开启成功！')
          this.GET_ExpressPlatformList()
        })
      },

      /** 编辑快递平台 */
      handleEditExpressPlatform(index, row) {
        this.expressForm = this.MixinClone(row)
        this.dialogVisible = true
      },

      /** 提交快递平台表单 */
      submitExpressForm() {
        const { bean } = this.expressForm
        API_ExpressPlatform.editExpressPlatform(bean, this.expressForm).then(response => {
          this.dialogVisible = false
          this.$message.success('修改成功！')
          this.MixinSetTableData(this.tableData, 'bean', bean, response)
        })
      },

      /** 获取快递平台列表 */
      GET_ExpressPlatformList() {
        this.loading = true
        API_ExpressPlatform.getExpressPlatformList(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ .el-form-item__content{
    width: 60%;
  }
</style>
