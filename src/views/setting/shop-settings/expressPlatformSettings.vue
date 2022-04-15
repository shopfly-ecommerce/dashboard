<template>
  <div>
    <en-table-layout
      :toolbar="false"
      :tableData="tableData.data"
      :loading="loading"
    >
      <template slot="table-columns">
        <el-table-column prop="name" label="The name of the platform"/>
        <el-table-column label="enabled">
          <template slot-scope="scope">
            {{ scope.row.open === 1 ? 'Has been open' : 'closed' }}
            <el-button v-if="scope.row.open === 0" type="text" @click="handleOpenExpressPlatform(scope.$index, scope.row)">open</el-button>
          </template>
        </el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditExpressPlatform(scope.$index, scope.row)">edit</el-button>
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
      :title="'Modify the express delivery platform- ' + expressForm.name"
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
        <el-button @click="dialogVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitExpressForm">save</el-button>
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
        // List loading status
        loading: false,
        // A list of parameters
        params: {
          page_no: 1,
          page_size: 10
        },
        // The list of data
        tableData: '',
        // Form of express platform
        expressForm: {},
        // Modify delivery platform Dialog
        dialogVisible: false
      }
    },
    mounted() {
      this.GET_ExpressPlatformList()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_ExpressPlatformList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_ExpressPlatformList()
      },

      /** Open express delivery platform*/
      handleOpenExpressPlatform(index, row) {
        API_ExpressPlatform.openExpressPlatformById(row.bean).then(response => {
          this.$message.success('Open the success！')
          this.GET_ExpressPlatformList()
        })
      },

      /** Edit express platform*/
      handleEditExpressPlatform(index, row) {
        this.expressForm = this.MixinClone(row)
        this.dialogVisible = true
      },

      /** Submit the form of Courier platform*/
      submitExpressForm() {
        const { bean } = this.expressForm
        API_ExpressPlatform.editExpressPlatform(bean, this.expressForm).then(response => {
          this.dialogVisible = false
          this.$message.success('Modify the success！')
          this.MixinSetTableData(this.tableData, 'bean', bean, response)
        })
      },

      /** Get a list of delivery platforms*/
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
