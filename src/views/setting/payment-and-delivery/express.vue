<template>
  <div>
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddExpress">add</el-button>
        </div>
      </div>
      <template slot="table-columns">
        <el-table-column prop="name" label="The name of the company"/>
        <el-table-column prop="code" label="Company code"/>
        <el-table-column prop="kdcode" label="Express bird code"/>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditExpress(scope.$index, scope.row)">edit</el-button>
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
      title="Logistics company"
      :visible.sync="dialogExpressVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="expressForm" :rules="Object.keys(expressRules).length ?{ ...baseExpressFormRules, ...expressRules } : baseExpressFormRules" ref="expressForm" label-width="120px">
        <el-form-item label="Name of logistics Company" prop="name">
          <el-input v-model="expressForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Logistics Company Code" prop="code">
          <el-input v-model="expressForm.code"></el-input>
        </el-form-item>
        <el-form-item label="Express bird logistics code" prop="kdcode">
          <el-input v-model="expressForm.kdcode"></el-input>
        </el-form-item>
        <el-form-item label="Electronic surface single" prop="is_waybill">
          <el-radio-group v-model="expressForm.is_waybill">
            <el-radio :label="1">support</el-radio>
            <el-radio :label="0">Does not support</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="expressForm.is_waybill">
          <el-row v-for="(item, index) in expressForm.formItems" :key="index">
            <el-col :span="11">
              <el-form-item label="The field type"  :prop="`formItems[${index}].code`" label-width="80px">
                <el-select v-model="item.code" placeholder="The field type" style="width:150px;">
                  <el-option label="customer_name" value="customer_name"></el-option>
                  <el-option label="customer_pwd" value="customer_pwd"></el-option>
                  <el-option label="month_code" value="month_code"></el-option>
                  <el-option label="send_site" value="send_site"></el-option>
                  <el-option label="send_staff" value="send_staff"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="The field names" :prop="`formItems[${index}].name`" label-width="80px">
                <el-input v-model="item.name" placeholder="The field names" style="width:130px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="text-align: center;">
              <el-button type="primary" @click="removeFromList(index)">delete</el-button>
            </el-col>
          </el-row>
          <el-row v-if="expressForm.formItems.length < 5">
            <el-col :span="24" style="text-align: center;">
                <el-button type="primary" @click="addFormList">increase</el-button>
            </el-col>
          </el-row>
        </template>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogExpressVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitExpressForm('expressForm')">save</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_Express from '@/api/express'

  export default {
    name: 'expressSettings',
    data() {
      console.log(this.expressForm)
      return {
        /** The list ofloadingStatus*/
        loading: false,
        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10
        },
        /** The list of data*/
        tableData: '',
        /** Express Company Form*/
        expressForm: { formItems: [] },
        baseExpressFormRules: {
          name: [this.MixinRequired('Please enter the logistics company name！')],
          code: [this.MixinRequired('Please enter the logistics company code！')],
          kdcode: [{}],
          customer_name: [this.MixinRequired('Please enter the logistics company customer number！')],
          customer_pwd: [this.MixinRequired('Please enter the password of the electronic leaflet of the logistics company！')]
        },
        /** Courier companydialog */
        dialogExpressVisible: false
      }
    },
    computed: {
      /** Express company form rules*/
      expressRules() {
        let validate = {
          // Name: [this.mixinRequired ( Please enter name of logistics company! )],
          // Code: [this.mixinRequired ( Please enter logistics company code! )],
          // Kdcode: [this.expressform.is_waybill? This.mixinRequired ( Please enter the Delivery Bird Logistics Code! ) : {}],
          // Customer_name: [this.mixinRequired ( Please enter logistics company customer number! )],
          // Customer_pwd: [this.mixinRequired ( Please enter password for logistics company electronic order! )]
        }
        this.expressForm.formItems.forEach((item, index) => {
          validate[`formItems[${index}].name`] = [{
            validator: (rule, value, callback) => {
              let { formItems } = this.expressForm
              if (value === '') {
                callback(new Error('Please enter the field name！'))
              } else if (formItems.filter(i => i.name === value).length > 1) {
                callback(new Error('The field name has been repeated！'))
              } else {
                callback()
              }
            }
          }]
          validate[`formItems[${index}].code`] = [{
            validator: (rule, value, callback) => {
              let { formItems } = this.expressForm
              if (value === '') {
                callback(new Error('Please enter the field type！'))
              } else if (formItems.filter(i => i.code === value).length > 1) {
                callback(new Error('The field type has been repeated！'))
              } else {
                callback()
              }
            }
          }]
        })
        console.log(validate)
        return validate
      }
    },
    watch: {
      'expressForm.is_waybill': function waybillChange(newVal) {
        // this.expressRules.kdcode[0].required = !!newVal
        // this.expressRules.customer_name[0].required = !!newVal
        // this.expressRules.customer_pwd[0].required = !!newVal
        console.log(this.expressForm)
        this.baseExpressFormRules.kdcode = [newVal ? this.MixinRequired('Please enter the express bird logistics code！') : {}]
        this.$refs.expressForm && this.$refs.expressForm.validateField('kdcode', err => err)
      }
    },
    mounted() {
      this.GET_ExpressList()
    },
    methods: {
      addFormList() {
        /** Electronic side single form validation*/
        let { formItems } = this.expressForm
        let isContainue = true
        if (!formItems.length) {
          this.expressForm.formItems.push({
            name: '',
            code: ''
          })
          return
        }
        let last = formItems[formItems.length - 1]
        if (!last.code || !last.code) {
          this.$message.error('Please fill in the complete before adding！')
          return
        }
        formItems.forEach(item => {
          let current = formItems.filter(j => (j.code === item.code || j.name === item.name))
          current.length > 1 ? isContainue = false : null
        })
        if (!isContainue) {
          this.$message.error('Duplicate field types or field names already exist！')
          return
        }

        this.expressForm.formItems.push({
          name: '',
          code: ''
        })
      },
      removeFromList(payload) {
        this.expressForm.formItems.splice(payload, 1)
      },
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_ExpressList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_ExpressList()
      },

      /** Add a Courier company*/
      handleAddExpress() {
        this.expressForm = { is_waybill: 0, formItems: [] }
        this.dialogExpressVisible = true
        this.$nextTick(() => this.$refs.expressForm.clearValidate())
      },

      /** Edit Logistics Company*/
      handleEditExpress(index, row) {
        const params = JSON.parse(JSON.stringify(row))
        if (typeof params.is_waybill !== 'number') {
          params.is_waybill = 0
        }

        this.expressForm = {
          name: params.name,
          code: params.code,
          is_waybill: params.is_waybill,
          kdcode: params.kdcode,
          id: params.id,
          formItems: params.form || []
        }

        this.dialogExpressVisible = true
        this.$nextTick(() => this.$refs.expressForm.clearValidate())
      },

      /** The delivery company submits the form*/
      submitExpressForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const { id } = this.expressForm
            let expressForm = JSON.parse(JSON.stringify(this.expressForm))
            if (!id) {
              API_Express.addExpress(expressForm).then(response => {
                this.dialogExpressVisible = false
                this.$message.success('Add a success！')
                this.GET_ExpressList()
              })
            } else {
              API_Express.editExpress(id, expressForm).then(response => {
                this.dialogExpressVisible = false
                this.$message.success('Save success！')
                this.MixinSetTableData(this.tableData, 'id', id, response)
              })
            }
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },
      /** Get a list of logistics companies*/
      GET_ExpressList() {
        this.loading = true
        API_Express.getExpressList(this.params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
</script>
