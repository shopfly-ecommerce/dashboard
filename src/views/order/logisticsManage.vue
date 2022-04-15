<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleToggleClick">
      <!--Freight template list-->
      <el-tab-pane label="Express template" name="express">
        <div style="margin-bottom: 10px;">
          <el-button type="primary" @click="handleAddMould">The new template</el-button>
        </div>
        <el-collapse v-for="(item, index) in tableData" :key="index">
          <el-collapse-item>
            <template slot="title">
              <div class="colla-title">
                <span>{{ item.name }}</span>
                <div>
                  <el-button type="text"plain @click="handleEditMould(item)">edit</el-button>
                  <el-button type="text" plain @click="handleDeleteMould(item)">delete</el-button>
                </div>
              </div>
            </template>
            <en-table-layout
              :stripe="false"
              border
              :tableData="item.items"
              :loading="loading">
              <template slot="table-columns">
                <!--Deliverable area-->
                <el-table-column label="Deliverable area" align="left">
                  <template slot-scope="scope">
                    <div class="dispatchingAreas">
                      <span v-for="(item, index) in scope.row.regions">
                        <span style="color: #333;"> {{ item.name }}
                          <span v-if="++index !== scope.row.regions.length">、</span>
                        </span>
                        <span v-if="item.children" style="color: #777;">
                          <span style="color: #aaa;">(</span>
                          <span v-for="(child, _index) in item.children" style="color: #aaa;">
                            {{ child.name }}<span v-if="++_index !== item.children.length">,</span>
                          </span>
                          <span style="color: #aaa;">)</span>
                        </span>
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <!--The first heavy（kg）-->
                <el-table-column prop="first_company" :label="item.type === 1 ? 'The first heavy（kg）': 'The first thing（a）'"  width="200"/>
                <!--freight（USD）-->
                <el-table-column label="freight（USD）" width="200">
                  <template slot-scope="scope">
                    <span>{{ scope.row.first_price | unitPrice('￥') }}</span>
                  </template>
                </el-table-column>
                <!--Continued heavy（kg）-->
                <el-table-column prop="continued_company" :label="item.type === 1 ? 'Continued heavy（kg）': 'To continue a（a）'" width="200"/>
                <!--renewal（USD）-->
                <el-table-column label="renewal（USD）" width="200">
                  <template slot-scope="scope">
                    <span>{{ scope.row.continued_price | unitPrice('￥') }}</span>
                  </template>
                </el-table-column>
              </template>
            </en-table-layout>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <!--The freight template-->
      <el-tab-pane :label="tplOperaName" name="add">
        <el-form
          :model="mouldForm"
          status-icon
          :rules="rules"
          ref="mouldForm"
          label-width="120px"
          class="demo-ruleForm">
          <el-form-item label="Template name:" prop="name" id="tplName">
            <el-input v-model="mouldForm.name" :maxlength="15" @change="()=> { mouldForm.name = mouldForm.name.trim() }"></el-input>
          </el-form-item>
          <el-form-item label="Billing way:" prop="type" v-if="!mouldForm.template_id">
            <el-radio-group v-model="mouldForm.type" >
              <el-radio :label="2">Charge per unit</el-radio>
              <el-radio :label="1">Charge by weight</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Billing way:" v-if="mouldForm.template_id">
            <div style="color: #909399;font-size: 13px;">{{ mouldForm.type | typeStatus }}</div>
          </el-form-item>
          <el-form-item label="Distribution area:" prop="items">
            <el-table
              :data="mouldForm.items"
              style="width: 80%"
              border>
              <el-table-column label="Deliverable area" align="left" >
                <template slot-scope="scope">
                  <div class="dispatchingAreas">
                    <span v-for="levle1 in scope.row.area">
                      <!--level1-->
                      <span v-if="checkSelectAll(levle1)" style="color: #333;">
                        {{ levle1.local_name }}
                        <span v-if="parseInt(levle1.id) !== parseInt(Object.keys(scope.row.area)[Object.keys(scope.row.area).length - 1])">、</span>
                      </span>
                      <!--level2-->
                      <span v-else v-for="levle2 in levle1.children">
                        <span v-if="checkSelectAll(levle2)" style="color: #777;">
                          {{ levle2.local_name }}
                          <span v-if="parseInt(levle2.id) !== parseInt(Object.keys(levle1.children)[Object.keys(levle1.children).length - 1])">、</span>
                        </span>
                        <span v-else style="color: #777;">
                          {{ levle2.local_name }}(
                          <!--level3-->
                          <span v-for="levle3 in levle2.children" style="color: #aaa;">
                            {{ levle3.local_name }}
                            <span v-if="parseInt(levle3.id) !== parseInt(Object.keys(levle2.children)[Object.keys(levle2.children).length - 1])">,</span>
                          </span>)
                        </span>
                      </span>
                    </span>
                    <div style="float: right;">
                      <el-button type="text" plain @click="editArea(scope.row, scope.$index)">edit</el-button>
                      <el-button type="text" plain @click="delArea(scope.$index)">delete</el-button>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="mouldForm.type === 1 ? 'The first heavy（kg）': 'The first thing（a）'" prop="id" align="center" width="200">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.first_company"
                    @blur="intFirstCompany(scope.row)"
                    clearable></el-input>
                </template>
              </el-table-column>
              <el-table-column label="freight（USD）" prop="name" align="center" width="200">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.first_price" @blur="intMoney(scope.row)" clearable></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="mouldForm.type === 1 ? 'Continued heavy（kg）': 'To continue a（a）'" prop="desc" align="center" width="200">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.continued_company" @blur="intContinuedCompany(scope.row)" clearable></el-input>
                </template>
              </el-table-column>
              <el-table-column label="renewal（USD）" prop="desc" align="center" width="200">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.continued_price" @blur="intMoney(scope.row)" clearable></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item prop="area">
            <el-button type="text" plain @click="chooseArea">Specify shipping area and freight</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveMould('mouldForm')">Save the template</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="Select Delivery Area"
      center
      :close-on-click-modal="false"
      :visible.sync="areaDialog"
      width="550px">
      <en-transfer-tree
        :title="title"
        :resolveGrade="2"
        :from_data="fromData"
        :to_data="toData"
        height="400px"
        @from_data_change="fromDataChange"
        @to_data_change="toDataChange"
        @from_load_more="fromLoadMore"
        @to_load_more="toLoadMore"
        @from_selected_all="fromSelectedAll"
        @to_selected_all="toSelectedAll"
      ></en-transfer-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="areaDialog = false">cancel</el-button>
        <el-button type="primary" @click="addTransItem">save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_express from '@/api/expressMould'
  import * as API_logistics from '@/api/expressCompany'
  import { RegExp } from '~/ui-utils'
  import { cloneObj } from '@/utils/index'
  import { AreaSelectorDialog } from '@/plugins/selector/vue'
  import { TransferTree } from '@/components'

  export default {
    name: 'logisticsManage',
    components: {
      [AreaSelectorDialog.name]: AreaSelectorDialog,
      [TransferTree.name]: TransferTree
    },
    data() {
      return {
        /** The name of the current panel*/
        activeName: 'express',

        /** A new template/Modify the template*/
        tplOperaName: 'A new template',

        /** The list ofloadingStatus*/
        loading: false,

        /** Express template list parameters*/
        params: {},

        /** Express template list data*/
        tableData: [],

        /** Template form information*/
        mouldForm: {
          /** The templateid */
          template_id: '',

          /** Template name*/
          name: '',

          /** Template type*/
          type: 1,

          items: []
        },

        /** Whether the locale selector is turned on*/
        areaDialog: false,

        /** All district information*/
        areaData: [],

        /** Edit mode The default mode is Add mode(false) Edit mode(true) */
        isEdit: false,

        /** Operates on the current row index*/
        currentIndex: -1,

        /** Filtering regional data*/
        filterData: [],

        /** Tree locale selector source data*/
        fromData: {},

        /** The source data of the last update*/
        lastFromData: {},

        /** Tree locale selector target data*/
        toData: {},

        /** Tree locale selector static data is used to store raw data for user operations*/
        staticData: {},

        /** Tree locale selector header*/
        title: ['Optional province、The city、county', 'The selected provinces、The city、county'],

        /** Form check rule*/
        rules: {
          name: [
            { required: true, message: 'Please enter the template name', trigger: 'blur' },
            { max: 15, message: 'Most template names15A character', trigger: 'blur' }
          ],
          type: [
            { required: true, message: 'Select the template type', trigger: 'change' }
          ]
        },

        isShow: false,
        configSheet: {},

        /** The list ofloadingStatus*/
        logisticsLoading: false,

        /** A list of parameters*/
        logisticsParams: {
          page_no: 1,
          page_size: 10
        },

        /** The list of data*/
        logisticsTableData: '',

        /** Express Company Form*/
        expressForm: { formItems: [] },

        /** Courier companydialog */
        dialogExpressVisible: false
      }
    },
    filters: {
      typeStatus(type) {
        return type === 1 ? 'Freight by weight' : 'Piece rate'
      }
    },
    mounted() {
      this.GET_ExpressMould()
      this.getAreaList()
      this.GET_ExpressList()
    },
    methods: {
      /** It is easy to use to obtain raw static data that calculates changes in user operations for all regions*/
      getAreaList() {
        API_express.getAreaList().then(response => {
          response.pop()
          this.areaData = response
          // Check the property isSelected Boolean value for each setting
          let stack = []
          let parallel = []
          for (let i = 0, len = this.areaData.length; i < len; i++) {
            stack.push(this.areaData[i])
          }
          let item
          while (stack.length) {
            item = stack.shift()
            // If the node has children, continue adding to the top of the stack
            this.$set(item, 'isSelected', false)
            // Adds the current item to a parallel array
            parallel.push(item)
            if (item.children && item.children.length) {
              stack = item.children.concat(stack)
            }
          }
          // Parallel structure conversion objects can then be rolled for performance optimization, which reduces computation for performance optimization
          this.staticData = this.buildTree(parallel)
          this.initArea()
        })
      },

      /**
       * Converts a one-dimensional flat array to a multilevel object
       * @param  {[type]} list A one-dimensional array containing each element of the arrayidandparent_idTwo attributes
       * @return {[type]} tree Multilevel tree structure
       */
      buildTree(list) {
        let temp = {}
        let tree = {}
        for (let i in list) {
          temp[list[i].id] = list[i]
        }
        for (let i in temp) {
          if (temp[i].parent_id) {
            if (Array.isArray(temp[temp[i].parent_id].children)) {
              temp[temp[i].parent_id].children = {}
            }
            temp[temp[i].parent_id].children[temp[i].id] = temp[i]
          } else {
            tree[temp[i].id] = temp[i]
          }
        }
        return tree
      },

      /** Toggle the label template*/
      handleToggleClick(tab, event) {
        this.activeName = tab.name
        this.tplOperaName = 'A new template'
        if (this.activeName === 'express') {
          this.GET_ExpressMould()
        } else if (this.activeName === 'add') {
          this.mouldForm = {
            /** The templateid */
            template_id: '',

            /** Template name*/
            name: '',

            /** Template type*/
            type: 1,

            items: []
          }
          this.defaultArea = []
        } else {
          this.GET_logisticsList()
          this.isShow = false
        }
      },

      /** Initialize the source data& Target data can only be given each time15The bar is used for rendering and is not used for late performance optimization*/
      initArea() {
        // Initialize the source data
        const init_from = Object.keys(this.staticData).slice(0, 11)
        init_from.forEach(key => {
          this.fromData[key] = this.staticData[key]
        })
        // Initialize target data
        this.toData = {}

        // Load the full data after 2s to speed up the display
        setTimeout(() => {
          this.fromData = JSON.parse(JSON.stringify(this.staticData))
        }, 2000)
      },

      /** Select distribution area*/
      chooseArea() {
        this.areaDialog = true
        if (this.isEdit) this.toData = {}
        this.isEdit = false
      },

      /** The scroll listener triggers to continue loading more source data*/
      fromLoadMore() {
        // Console.log ( Scroll loading source data )
      },

      /** The scroll listener triggers to continue loading more target data*/
      toLoadMore() {
        // Console.log ( Scroll loading target data )
      },

      /** Select all source data*/
      fromSelectedAll(val) {
        let stack = []
        for (let i in this.fromData) {
          stack.push(this.fromData[i])
        }
        let item
        while (stack.length) {
          item = stack.shift()
          // If all the siblings of the current node are the same as the current node, the parent node remains in sync
          item.isSelected = val
          // If the node has children, continue adding to the top of the stack
          if (item && item.children && !Array.isArray(item.children)) {
            for (let i in item.children) {
              stack.push(item.children[i])
            }
          }
        }
      },

      /** Select all target data*/
      toSelectedAll(val) {
        let stack = []
        for (let i in this.toData) {
          stack.push(this.toData[i])
        }
        let item
        while (stack.length) {
          item = stack.shift()
          // If all the siblings of the current node are the same as the current node, the parent node remains in sync
          item.isSelected = val
          // If the node has children, continue adding to the top of the stack
          if (item && item.children && !Array.isArray(item.children)) {
            for (let i in item.children) {
              stack.push(item.children[i])
            }
          }
        }
      },

      /** Source data update*/
      fromDataChange(data, type) {
        if (type) { // iftype for1 Add or remove
          // If the fromData is an empty object, the value is assigned directly. If not, the object is merged
          if (!Object.keys(this.fromData).length) {
            this.fromData = JSON.parse(JSON.stringify(data))
          } else {
            this.objAssign(this.fromData, data)
          }
        } else { // remove
          this.objDel(this.fromData, data)
        }
        this.resetSelected(this.fromData)
      },

      /** Target data update*/
      toDataChange(data, type) {
        if (type) { // iftype for1 Add or remove
          // If toData is an empty object, the value is assigned directly. If not, the object is merged
          if (!Object.keys(this.toData).length) {
            this.toData = JSON.parse(JSON.stringify(data))
          } else {
            this.objAssign(this.toData, data)
          }
        } else { // remove
          this.objDel(this.toData, data)
        }
        this.resetSelected(this.toData)
      },

      // Object merge object with same name object child node added
      objAssign(origins, data) {
        for (let i in data) {
          if (!origins[i]) { // iflevel1In the integrated target data does not exist in the current selected item directly to the currentlevel1For the assignment
            this.$set(origins, i, JSON.parse(JSON.stringify(data[i])))
          } else { // inlevel1中存in被整合的目标数据中不存in当前选中项则进行检测下一级别（level2）
            for (let j in data[i].children) { // iflevel2In the integrated target data does not exist in the current selected item directly to the currentlevel2For the assignment
              if (!origins[i].children[j]) {
                this.$set(origins[i].children, j, JSON.parse(JSON.stringify(data[i].children[j])))
              } else { // inlevel2中存in被整合的目标数据中不存in当前选中项则进行检测下一级别（level3）
                for (let k in data[i].children[j].children) { // iflevel3In the integrated target data does not exist in the current selected item directly to the currentlevel3For the assignment
                  if (!origins[i].children[j].children[k]) {
                    this.$set(origins[i].children[j].children, k, JSON.parse(JSON.stringify(data[i].children[j].children[k])))
                  }
                }
              }
            }
          }
        }
      },

      // Object recursively removed object child node removed
      objDel(origins, data) {
        for (let i in data) {
          if (data[i].isSelected) { // level1Select all
            this.$delete(origins, i)
          } else {
            for (let j in data[i].children) { // level1If the levels are not all selected, the cycle check is performedlevel2
              if (data[i].children[j].isSelected) { // level2Select all
                this.$delete(origins[i].children, j)
              } else { // level2If the levels are not all selected, the cycle check is performedlevel3
                for (let k in data[i].children[j].children) {
                  if (data[i].children[j].children[k].isSelected) {
                    this.$delete(origins[i].children[j].children, k)
                  }
                }
              }
            }
          }
        }
      },

      /** Reset selected dataisSelected forfalse*/
      resetSelected(model) {
        let stack = []
        for (let i in model) {
          stack.push(model[i])
        }
        let item
        while (stack.length) {
          item = stack.shift()
          // If all the siblings of the current node are the same as the current node, the parent node remains in sync
          item.isSelected = false
          // If the node has children, continue adding to the top of the stack
          if (item && item.children && !Array.isArray(item.children)) {
            for (let i in item.children) {
              stack.push(item.children[i])
            }
          }
        }
      },

      /** The tree locale selector confirms the callback*/
      addTransItem() {
        // Close the region selector
        this.areaDialog = false
        // If it is in edit mode, update the corresponding freight template subitem
        if (this.isEdit) {
          // Detects if the target data is empty and, if so, performs deletion
          if (!Object.keys(this.toData).length) {
            this.implementDel(this.currentIndex)
          } else {
            this.mouldForm.items[this.currentIndex].area = JSON.parse(JSON.stringify(this.toData))
          }
        } else { // If it is add mode, add the freight template subitem
          // Verify that the target data is null
          if (!Object.keys(this.toData).length) {
            this.$message.warning('If the target locale data is empty, click cancel or close the locale selector in the upper right corner')
            return
          }
          this.mouldForm.items.push({
            first_company: 1,
            first_price: 0,
            continued_company: 1,
            continued_price: 0,
            area: JSON.parse(JSON.stringify(this.toData))
          })
        }
        // Update filter locale data Updates the newly added or deleted target data into the filter locale
        if (this.filterData[this.currentIndex]) { // replace
          this.filterData[this.currentIndex] = JSON.parse(JSON.stringify(this.toData))
        } else { // add
          this.filterData.push(JSON.parse(JSON.stringify(this.toData)))
        }
        // Empty target data
        this.toData = {}
        // Last source data update
        this.lastFromData = JSON.parse(JSON.stringify(this.fromData))
      },

      /** filterfirst_company */
      intFirstCompany(row) {
        if (!RegExp.integer.test(row.first_company)) {
          row.first_company = 1
        }
      },

      /** filtercontinued_company */
      intContinuedCompany(row) {
        if (!RegExp.integer.test(row.continued_company)) {
          row.continued_company = 1
        }
      },

      /** filterfirst_price continued_price */
      intMoney(row) {
        if (!RegExp.money.test(row.first_price)) {
          row.first_price = 0.00
        } else {
          row.first_price = Number.parseFloat(row.first_price).toFixed(2)
        }
        if (!RegExp.money.test(row.continued_price)) {
          row.continued_price = 0.00
        } else {
          row.continued_price = Number.parseFloat(row.continued_price).toFixed(2)
        }
      },

      /** Edit subarea*/
      editArea(row, $index) {
        this.areaDialog = true
        this.isEdit = true
        // Update current target data
        this.toData = JSON.parse(JSON.stringify(row.area))
        // Reset the target data
        this.resetSelected(this.toData)
        // Update the current operation index
        this.currentIndex = $index
      },

      /** Delete sublocale*/
      delArea($index) {
        this.$confirm('Sure to delete?', 'prompt', { type: 'warning' }).then(() => {
          this.implementDel($index)
        }).catch(() => {})
      },

      /** Perform the deletion of sublocales*/
      implementDel($index) {
        // Updating table data
        this.mouldForm.items.splice($index, 1)
        // Update filter data deletion
        const delItem = this.filterData.splice($index, 1)
        // Update source data
        for (let i in delItem[0]) {
          if (!this.fromData[i]) { // There is nolevel1
            this.$set(this.fromData, i, delItem[0][i])
          } else {
            for (let j in delItem[0][i].children) {
              if (!this.fromData[i].children[j]) { // There is nolevel2
                this.$set(this.fromData[i].children, j, delItem[0][i].children[j])
              } else {
                for (let k in delItem[0][i].children[j].children) {
                  this.$set(this.fromData[i].children[j].children, k, delItem[0][i].children[j].children[k])
                }
              }
            }
          }
        }
      },

      /** Gets the Courier template list information*/
      GET_ExpressMould() {
        this.loading = true
        API_express.getTplList().then(response => {
          this.loading = false
          this.tableData = response
        })
      },

      /** Edit template*/
      handleEditMould(row) {
        this.activeName = 'add'
        this.tplOperaName = 'Modify the template'
        API_express.getSimpleTpl(row.id).then((response) => {
          // Resetting the initial data prevents errors in the case of repeat edits
          this.fromData = JSON.parse(JSON.stringify(this.staticData))
          // Computational editing area
          response.items.forEach(key => {
            key.area = typeof key.area === 'string' ? JSON.parse(key.area) : key.area
            for (let i in key.area) {
              if (key.area[i].selected_all) { // level 1
                key.area[i] = JSON.parse(JSON.stringify(this.fromData[i]))
                this.$delete(this.fromData, i)
              } else if (key.area[i].children) {
                for (let j in key.area[i].children) {
                  if (key.area[i].children[j].selected_all) { // level2
                    key.area[i].children[j] = JSON.parse(JSON.stringify(this.fromData[i].children[j]))
                    this.$delete(this.fromData[i].children, j)
                  } else if (key.area[i].children[j].children) {
                    for (let k in key.area[i].children[j].children) {
                      key.area[i].children[j].children[k] = JSON.parse(JSON.stringify(this.fromData[i].children[j].children[k]))
                      this.$delete(this.fromData[i].children[j].children, k)
                    }
                  }
                }
              }
            }
          })
          // The last source data at this point is the filtered locale data
          this.lastFromData = JSON.parse(JSON.stringify(this.fromData))
          this.mouldForm = { ...response }
          // Initializes the filter area
          this.filterData = []
          response.items.forEach(key => {
            this.filterData.push(JSON.parse(JSON.stringify(key.area)))
          })
        })
      },

      /** To delete a template*/
      handleDeleteMould(row) {
        const _id = row.id
        this.$confirm(`Are you sure you want to delete the template?`, 'Confirm the information', { type: 'warning' })
          .then(() => {
            API_express.deleteExpressMould(_id).then(() => {
              this.GET_ExpressMould()
              this.$message.success('Delete the success')
            })
          })
      },

      /** The new template*/
      handleAddMould() {
        this.activeName = 'add'
        this.tplOperaName = 'The new template'
        this.mouldForm = {
          /** The templateid */
          id: '',

          /** Template name*/
          name: '',

          /** Template type*/
          type: 1,

          items: []
        }
        // Resetting source data
        this.fromData = JSON.parse(JSON.stringify(this.staticData))
        // Reset target data
        this.toData = {}
        // Reset filter area
        this.filterData = []
        // The last source data at this point is the filtered locale data
        this.lastFromData = JSON.parse(JSON.stringify(this.fromData))
      },

      /** Check whether all are selected*/
      checkSelectAll(model) {
        let isSelectAll = false
        let _resultlevel1 = 0
        let _resultlevel2 = 0
        let _resultlevel3 = 0
        this.filterData.forEach(key => {
          for (let i in key) {
            if (model.level === 1 && parseInt(i) === parseInt(model.id)) {
              _resultlevel1++
            } else if (model.level === 2 && key[i].children) {
              for (let j in key[i].children) {
                if (parseInt(j) === parseInt(model.id)) {
                  _resultlevel2++
                }
              }
            }
          }
        })
        if (model.level === 1) {
          if (!this.lastFromData[model.id] && _resultlevel1 <= 1) {
            isSelectAll = true
          }
        }

        if (model.level === 2) {
          if (_resultlevel2 <= 1 && (!this.lastFromData[model.parent_id] || !this.lastFromData[model.parent_id].children[model.id])) {
            isSelectAll = true
          }
        }

        if (model.level === 3) { // I suspect theres something wrong with the logic here, but I dont find it. Maybe Im neurotic enough to...mmp
          if (_resultlevel3 <= 1 && (!this.lastFromData[model.parent_id] || !this.lastFromData[model.parent_id].children[model.id])) {
            isSelectAll = true
          }
        }

        return isSelectAll
      },

      /** Save the template*/
      saveMould(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const _params = JSON.parse(JSON.stringify(this.mouldForm))
            _params.items.forEach(key => {
              // Calculate submission data
              for (let i in key.area) {
                if (this.checkSelectAll(key.area[i])) { // level1 Select all
                  this.$set(key.area[i], 'selected_all', true)
                  key.area[i].children = null
                } else {
                  this.$set(key.area[i], 'selected_all', false)
                  for (let j in key.area[i].children) {
                    if (this.checkSelectAll(key.area[i].children[j])) { // level2 Select all
                      this.$set(key.area[i].children[j], 'selected_all', true)
                      key.area[i].children[j].children = null
                    } else {
                      this.$set(key.area[i].children[j], 'selected_all', false)
                    }
                  }
                }
              }
              key.area = typeof key.area === 'string' ? key.area : JSON.stringify(key.area)
            })
            if (this.mouldForm.id) { // edit
              API_express.saveExpressMould(this.mouldForm.id, _params).then(() => {
                this.$message.success('Modify the success')
                this.GET_ExpressMould()
                this.activeName = 'express'
                this.tplOperaName = 'The new template'
              })
            } else { // add
              delete this.mouldForm.id
              API_express.addExpressMould(_params).then(() => {
                this.$message.success('Add a success')
                this.GET_ExpressMould()
                this.activeName = 'express'
              })
            }
          }
        })
      },

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
        this.logisticsParams.page_size = size
        this.GET_ExpressList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.logisticsParams.page_no = page
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
              API_logistics.addExpress(expressForm).then(response => {
                this.dialogExpressVisible = false
                this.$message.success('Add a success！')
                this.GET_ExpressList()
              })
            } else {
              API_logistics.editExpress(id, expressForm).then(response => {
                this.dialogExpressVisible = false
                this.$message.success('Save success！')
                this.GET_ExpressList()
              })
            }
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },

      /** Access logistics company information*/
      GET_logisticsList() {
        this.loading = true
        API_logistics.getExpressCompanyList({}).then(response => {
          this.loading = false
          this.logisticsTableData = response
        })
      },

      PreservationBtn() {
        let { kdnParams, logi_id, text_fields, result = {}} = JSON.parse(JSON.stringify(this.configSheet))
        text_fields.forEach(item => {
          for (let key in kdnParams) {
            if (key === item.label) {
              result[item.name] = kdnParams[key]
            }
          }
        })
        API_logistics.setExpressPower(logi_id, { kdnParams: result }).then(res => {
          if (!res) {
            this.GET_logisticsList()
            this.isShow = false
          }
        })
      },

      CancelBtn() {
        this.isShow = false
      },

      /** Get a list of logistics companies*/
      GET_ExpressList() {
        this.logisticsLoading = true
        API_logistics.getExpressCompanyList(this.logisticsParams).then(response => {
          this.logisticsLoading = false
          this.logisticsTableData = response
        }).catch(() => {
          this.logisticsLoading = false
        })
      }

    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ #tplName {
    width: 25%;
  }
  /deep/ .el-table__body {
    .el-input {
      width: 60%;
      .el-input__inner {
        text-align: center;
        padding-right: 15px;
      }
    }
  }

  /deep/ .el-tabs__content {
    padding: 20px;
    background-color: #fff;
  }
  /deep/ .el-button.is-plain, .el-button.is-plain:hover {
    border: none;
  }
  /deep/ .el-collapse {
    border-bottom: none;
    .el-collapse-item__header {
      background-color: transparent;
    }
    .el-collapse-item{
      margin-bottom: 10px;
      background-color: #f6f6f6;
    }
    .el-collapse-item__wrap {
      border-bottom: 0;
    }
  }
  .colla-title {
	  width: 100%;
    padding: 0 15px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    background-color: #f6f6f6;
  }
  /deep/ .el-button.is-plain:hover {
    background-color: transparent;
  }
  .dialog-footer {
    text-align: center;
  }
</style>

