<template>
  <div>
    <en-table-layout
      toolbar
      :tableData="tableData"
      pagination
      :loading="loading">
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="addPerAccomplishmentTpl">new</el-button>
        </div>
      </div>
      <template slot="table-columns">
        <!--The template name-->
        <el-table-column prop="tpl_name" label="The template name" width="200"/>
        <!--instructions-->
        <el-table-column prop="tpl_describe" label="instructions"/>
        <!--Operation-->
        <el-table-column label="Operation" width="280">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editPerAccomplishmentTpl(scope.row)">edit</el-button>
            <el-button type="danger" size="mini" @click="delPerAccomplishmentTpl(scope.row)">delete</el-button>
            <el-button type="danger" size="mini" @click="seePerAccomplishmentTpl(scope.row)">See template</el-button>
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
    <el-dialog :title="isEdit ? 'Edit and distribute commission templates' : 'Add distribution commission templates'" :visible.sync="isShowTplDialog" width="40%">
      <el-form :model="tplForm" ref="tplForm" :rules="rules">
        <el-form-item label="Whether the default" :label-width="formLabelWidth">
          <el-radio-group v-model="tplForm.is_default">
            <el-radio :label="0">no</el-radio>
            <el-radio :label="1">is</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="The template name" :label-width="formLabelWidth" prop="tpl_name">
          <el-input v-model="tplForm.tpl_name" placeholder="Please enter content"></el-input>
        </el-form-item>
        <el-form-item label="instructions" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="tplForm.tpl_describe" placeholder="Please enter content"></el-input>
        </el-form-item>
        <el-form-item label="Commission set" :label-width="formLabelWidth">
          <el-form-item label="1level" :label-width="formInLabelWidth" prop="grade1">
            <el-input placeholder="0.00" v-model="tplForm.grade1">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="2level" :label-width="formInLabelWidth" prop="grade2">
            <el-input placeholder="0.00" v-model="tplForm.grade2">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-form-item>
        <!--<el-form-item label="Switch Settings" :label-width="formLabelWidth">-->
          <!--<el-radio-group v-model="tplForm.switch_model">-->
            <!--<el-radio label="AUTOMATIC">Automatic switch</el-radio>-->
            <!--<el-radio label="MANUAL">The manual switch</el-radio>-->
          <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="profits" :label-width="formLabelWidth" prop="profit">-->
          <!--<el-input placeholder="Please enter content" v-model="tplForm.profit">-->
            <!--<template slot="prepend">¥</template>-->
          <!--</el-input>-->
        <!--</el-form-item>-->
        <!-- <el-form-item label="The number of referrals" :label-width="formLabelWidth" prop="num">
          <el-input placeholder="Please enter content" v-model="tplForm.num">
            <template slot="append">people</template>
          </el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowTplDialog = false">cancel</el-button>
        <el-button type="primary" :loading="btnloading" @click="handleConfirmTpl">save</el-button>
      </div>
    </el-dialog>
    <el-dialog title="Level of details" :visible.sync="isShowTplInfoDialog" width="30%">
      <el-form :model="tplForm" >
        <el-form-item label="The template name" :label-width="formLabelWidth">
          <el-input disabled v-model="tplForm.tpl_name"></el-input>
        </el-form-item>
      </el-form>
      <el-table :data="tplSimpleInfo">
        <el-table-column property="label" label="level" align="center"></el-table-column>
        <el-table-column property="value" label="rebates" align="center"></el-table-column>
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
            callback(new Error('Please enter a positive integer or two decimal places'))
          } else if (parseFloat(value) > 100) {
            callback(new Error('Please enter a positive integer or two decimal places'))
          } else {
            callback()
          }
        }, 1000)
      }
      const checkMoney = (rule, value, callback) => {
        setTimeout(() => {
          if (!RegExp.money.test(value)) {
            callback(new Error('Please enter a positive integer or two decimal places'))
          } else {
            callback()
          }
        }, 1000)
      }
      const checkNum = (rule, value, callback) => {
        setTimeout(() => {
          if (!RegExp.integer.test(value) && value !== 0) {
            callback(new Error('Please enter a positive integer'))
          } else {
            callback()
          }
        }, 1000)
      }
      return {
        // List loading status
        loading: false,

        // A list of parameters
        params: {
          page_no: 1,
          page_size: 10
        },

        // The list of data
        tableData: [],

        pageData: [],

        /** Whether to modify*/
        isEdit: false,

        /** Whether to display the edit popup*/
        isShowTplDialog: false,

        /** Whether to display a view message popup*/
        isShowTplInfoDialog: false,

        /** formForm distance*/
        formLabelWidth: '130px',

        formInLabelWidth: '35px',

        /** Template form*/
        tplForm: {
          /**  1By default,0 default*/
          is_default: 0,

          /** Template name*/
          tpl_name: '',

          /** Template description*/
          tpl_describe: '',

          /** level1 */
          grade1: 0.00,

          /** level2 */
          grade2: 0.00,

          /** Switch Mode Settings*/
          switch_model: 'AUTOMATIC',

          /** profits*/
          profit: 0,

          /** The number of referrals*/
          num: 0
        },

        rules: {
          tpl_name: [
            { required: true, message: 'The template name cannot be empty', trigger: 'blur' }
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

        /** Button to load*/
        btnloading: false,

        /** Individual template level information*/
        tplSimpleInfo: []
      }
    },
    mounted() {
      this.GET_PerAccomplishmentTpl()
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_PerAccomplishmentTpl()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_PerAccomplishmentTpl()
      },

      /** Gets a list of commission templates*/
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

      /** The new template*/
      addPerAccomplishmentTpl() {
        this.isShowTplDialog = true
        this.isEdit = false
        /** Template form*/
        this.tplForm = {
          /**  1By default,0 default*/
          is_default: 0,

          /** Template name*/
          tpl_name: '',

          /** Template description*/
          tpl_describe: '',

          /** level1 */
          grade1: 0.00,

          /** level2 */
          grade2: 0.00,

          /** Switch Mode Settings*/
          switch_model: 'AUTOMATIC',

          /** profits*/
          profit: 0,

          /** The number of referrals*/
          num: 0
        }
      },

      /** Modify the template template form*/
      editPerAccomplishmentTpl(row) {
        this.isShowTplDialog = true
        this.isEdit = true
        this.tplForm = { ...row }
      },

      /** To delete a template*/
      delPerAccomplishmentTpl(row) {
        this.$confirm('Verify that this template is deleted?', { type: 'warning' }).then(() => {
          if (row.is_default === 1) {
            this.$message.error('The default template does not allow deletion')
            return
          }
          API_distribution.delPerTpl(row.id).then(() => {
            this.$message.success('Delete the success')
            this.GET_PerAccomplishmentTpl()
          })
        })
      },

      /** See template*/
      seePerAccomplishmentTpl(row) {
        API_distribution.getPerTpl(row.id).then(response => {
          this.isShowTplInfoDialog = true
          this.tplForm = { ...response }
          this.tplSimpleInfo = [{
            label: '1level',
            value: response.grade1
          }, {
            label: '2level',
            value: response.grade2
          }]
        })
      },

      /** Template validation operation*/
      handleConfirmTpl() {
        this.btnloading = true
        this.$refs['tplForm'].validate((valid) => {
          if (valid) {
            if (this.isEdit) {
              API_distribution.editPerTpl(this.tplForm).then(() => {
                this.$message.success('Edit success')
                this.isShowTplDialog = false
                this.btnloading = false
                this.GET_PerAccomplishmentTpl()
              })
            } else {
              API_distribution.addPerTpl(this.tplForm).then(() => {
                this.$message.success('New success')
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


