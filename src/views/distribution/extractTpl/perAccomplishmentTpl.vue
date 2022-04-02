<template>
  <div>
    <en-table-layout
      toolbar
      :tableData="tableData"
      pagination
      :loading="loading">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="addPerAccomplishmentTpl">新增</el-button>
        </div>
      </div>
      <template slot="table-columns">
        <!--模板名-->
        <el-table-column prop="tpl_name" label="模板名" width="200"/>
        <!--说明-->
        <el-table-column prop="tpl_describe" label="说明"/>
        <!--操作-->
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editPerAccomplishmentTpl(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="delPerAccomplishmentTpl(scope.row)">删除</el-button>
            <el-button type="danger" size="mini" @click="seePerAccomplishmentTpl(scope.row)">查看模板</el-button>
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
    <el-dialog :title="isEdit ? '编辑分销提成模板' : '添加分销提成模板'" :visible.sync="isShowTplDialog" width="40%">
      <el-form :model="tplForm" ref="tplForm" :rules="rules">
        <el-form-item label="是否默认" :label-width="formLabelWidth">
          <el-radio-group v-model="tplForm.is_default">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="模板名" :label-width="formLabelWidth" prop="tpl_name">
          <el-input v-model="tplForm.tpl_name" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="说明" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="tplForm.tpl_describe" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="提成设置" :label-width="formLabelWidth">
          <el-form-item label="1级" :label-width="formInLabelWidth" prop="grade1">
            <el-input placeholder="0.00" v-model="tplForm.grade1">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="2级" :label-width="formInLabelWidth" prop="grade2">
            <el-input placeholder="0.00" v-model="tplForm.grade2">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-form-item>
        <!--<el-form-item label="切换设置" :label-width="formLabelWidth">-->
          <!--<el-radio-group v-model="tplForm.switch_model">-->
            <!--<el-radio label="AUTOMATIC">自动切换</el-radio>-->
            <!--<el-radio label="MANUAL">手动切换</el-radio>-->
          <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="利润" :label-width="formLabelWidth" prop="profit">-->
          <!--<el-input placeholder="请输入内容" v-model="tplForm.profit">-->
            <!--<template slot="prepend">¥</template>-->
          <!--</el-input>-->
        <!--</el-form-item>-->
        <!-- <el-form-item label="下线人数" :label-width="formLabelWidth" prop="num">
          <el-input placeholder="请输入内容" v-model="tplForm.num">
            <template slot="append">人</template>
          </el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowTplDialog = false">取 消</el-button>
        <el-button type="primary" :loading="btnloading" @click="handleConfirmTpl">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="等级详情" :visible.sync="isShowTplInfoDialog" width="30%">
      <el-form :model="tplForm" >
        <el-form-item label="模板名" :label-width="formLabelWidth">
          <el-input disabled v-model="tplForm.tpl_name"></el-input>
        </el-form-item>
      </el-form>
      <el-table :data="tplSimpleInfo">
        <el-table-column property="label" label="等级" align="center"></el-table-column>
        <el-table-column property="value" label="返点" align="center"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import { RegExp } from '~/ui-utils'
  import * as API_distribution from '@/api/distribution'
  export default {
    name: 'perAccomplishmentTpl',
    data() {
      const checkGrade = (rule, value, callback) => {
        setTimeout(() => {
          if (!RegExp.money.test(value)) {
            callback(new Error('请输入正整数或者两位小数'))
          } else if (parseFloat(value) > 100) {
            callback(new Error('请输入正整数或者两位小数'))
          } else {
            callback()
          }
        }, 1000)
      }
      const checkMoney = (rule, value, callback) => {
        setTimeout(() => {
          if (!RegExp.money.test(value)) {
            callback(new Error('请输入正整数或者两位小数'))
          } else {
            callback()
          }
        }, 1000)
      }
      const checkNum = (rule, value, callback) => {
        setTimeout(() => {
          if (!RegExp.integer.test(value) && value !== 0) {
            callback(new Error('请输入的正整数'))
          } else {
            callback()
          }
        }, 1000)
      }
      return {
        // 列表loading状态
        loading: false,

        // 列表参数
        params: {
          page_no: 1,
          page_size: 10
        },

        // 列表数据
        tableData: [],

        pageData: [],

        /** 是否修改 */
        isEdit: false,

        /** 是否显示编辑弹框 */
        isShowTplDialog: false,

        /** 是否显示查看信息弹框 */
        isShowTplInfoDialog: false,

        /** form表单的距离 */
        formLabelWidth: '130px',

        formInLabelWidth: '35px',

        /** 模板表单 */
        tplForm: {
          /**  1默认，0非默认 */
          is_default: 0,

          /** 模板名称 */
          tpl_name: '',

          /** 模板描述 */
          tpl_describe: '',

          /** 等级1 */
          grade1: 0.00,

          /** 等级2 */
          grade2: 0.00,

          /** 切换模式设置 */
          switch_model: 'AUTOMATIC',

          /** 利润 */
          profit: 0,

          /** 下线人数 */
          num: 0
        },

        rules: {
          tpl_name: [
            { required: true, message: '模板名称不能为空', trigger: 'blur' }
          ],

          grade1: [
            { validator: checkGrade, trigger: 'blur' }
          ],

          grade2: [
            { validator: checkGrade, trigger: 'blur' }
          ],

          profit: [
            { validator: checkMoney, trigger: 'blur' }
          ],

          num: [
            { validator: checkNum, trigger: 'blur' }
          ]
        },

        /** 按钮加载 */
        btnloading: false,

        /** 单个模板等级信息 */
        tplSimpleInfo: []
      }
    },
    mounted() {
      this.GET_PerAccomplishmentTpl()
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_PerAccomplishmentTpl()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_PerAccomplishmentTpl()
      },

      /** 获取提成模板列表 */
      GET_PerAccomplishmentTpl() {
        this.loading = true
        API_distribution.getPerAccomplishmentTpl(this.params).then(response => {
          this.loading = false
          this.tableData = response.data
          this.pageData = {
            page_no: response.page_no,
            page_size: response.page_size,
            data_total: response.data_total
          }
        })
      },

      /** 新增模板 */
      addPerAccomplishmentTpl() {
        this.isShowTplDialog = true
        this.isEdit = false
        /** 模板表单 */
        this.tplForm = {
          /**  1默认，0非默认 */
          is_default: 0,

          /** 模板名称 */
          tpl_name: '',

          /** 模板描述 */
          tpl_describe: '',

          /** 等级1 */
          grade1: 0.00,

          /** 等级2 */
          grade2: 0.00,

          /** 切换模式设置 */
          switch_model: 'AUTOMATIC',

          /** 利润 */
          profit: 0,

          /** 下线人数 */
          num: 0
        }
      },

      /** 修改模板 模板表单*/
      editPerAccomplishmentTpl(row) {
        this.isShowTplDialog = true
        this.isEdit = true
        this.tplForm = { ...row }
      },

      /** 删除模板 */
      delPerAccomplishmentTpl(row) {
        this.$confirm('确认删除此模板?', { type: 'warning' }).then(() => {
          if (row.is_default === 1) {
            this.$message.error('默认模版不允许删除')
            return
          }
          API_distribution.delPerTpl(row.id).then(() => {
            this.$message.success('删除成功')
            this.GET_PerAccomplishmentTpl()
          })
        })
      },

      /** 查看模板 */
      seePerAccomplishmentTpl(row) {
        API_distribution.getPerTpl(row.id).then(response => {
          this.isShowTplInfoDialog = true
          this.tplForm = { ...response }
          this.tplSimpleInfo = [{
            label: '1级',
            value: response.grade1
          }, {
            label: '2级',
            value: response.grade2
          }]
        })
      },

      /** 模板确认操作 */
      handleConfirmTpl() {
        this.btnloading = true
        this.$refs['tplForm'].validate((valid) => {
          if (valid) {
            if (this.isEdit) {
              API_distribution.editPerTpl(this.tplForm).then(() => {
                this.$message.success('编辑成功')
                this.isShowTplDialog = false
                this.btnloading = false
                this.GET_PerAccomplishmentTpl()
              })
            } else {
              API_distribution.addPerTpl(this.tplForm).then(() => {
                this.$message.success('新增成功')
                this.isShowTplDialog = false
                this.btnloading = false
                this.GET_PerAccomplishmentTpl()
              })
            }
          } else {
            this.btnloading = false
          }
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
  .el-form-item {
    width: 75%;
  }
</style>


