<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleToggleClick">
      <!--运费模版列表-->
      <el-tab-pane label="快递模板" name="express">
        <div style="margin-bottom: 10px;">
          <el-button type="primary" @click="handleAddMould">新增模板</el-button>
        </div>
        <el-collapse v-for="(item, index) in tableData" :key="index">
          <el-collapse-item>
            <template slot="title">
              <div class="colla-title">
                <span>{{ item.name }}</span>
                <div>
                  <el-button type="text"plain @click="handleEditMould(item)">编辑</el-button>
                  <el-button type="text" plain @click="handleDeleteMould(item)">删除</el-button>
                </div>
              </div>
            </template>
            <en-table-layout
              :stripe="false"
              border
              :tableData="item.items"
              :loading="loading">
              <template slot="table-columns">
                <!--可配送区域-->
                <el-table-column label="可配送区域" align="left">
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
                <!--首重（kg）-->
                <el-table-column prop="first_company" :label="item.type === 1 ? '首重（kg）': '首件（个）'"  width="200"/>
                <!--运费（元）-->
                <el-table-column label="运费（元）" width="200">
                  <template slot-scope="scope">
                    <span>{{ scope.row.first_price | unitPrice('￥') }}</span>
                  </template>
                </el-table-column>
                <!--续重（kg）-->
                <el-table-column prop="continued_company" :label="item.type === 1 ? '续重（kg）': '续件（个）'" width="200"/>
                <!--续费（元）-->
                <el-table-column label="续费（元）" width="200">
                  <template slot-scope="scope">
                    <span>{{ scope.row.continued_price | unitPrice('￥') }}</span>
                  </template>
                </el-table-column>
              </template>
            </en-table-layout>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <!--运费模版-->
      <el-tab-pane :label="tplOperaName" name="add">
        <el-form
          :model="mouldForm"
          status-icon
          :rules="rules"
          ref="mouldForm"
          label-width="120px"
          class="demo-ruleForm">
          <el-form-item label="模板名称:" prop="name" id="tplName">
            <el-input v-model="mouldForm.name" :maxlength="15" @change="()=> { mouldForm.name = mouldForm.name.trim() }"></el-input>
          </el-form-item>
          <el-form-item label="计费方式:" prop="type" v-if="!mouldForm.template_id">
            <el-radio-group v-model="mouldForm.type" >
              <el-radio :label="2">按件数计费</el-radio>
              <el-radio :label="1">按重量计费</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="计费方式:" v-if="mouldForm.template_id">
            <div style="color: #909399;font-size: 13px;">{{ mouldForm.type | typeStatus }}</div>
          </el-form-item>
          <el-form-item label="配送区域:" prop="items">
            <el-table
              :data="mouldForm.items"
              style="width: 80%"
              border>
              <el-table-column label="可配送区域" align="left" >
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
                      <el-button type="text" plain @click="editArea(scope.row, scope.$index)">编辑</el-button>
                      <el-button type="text" plain @click="delArea(scope.$index)">删除</el-button>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="mouldForm.type === 1 ? '首重（kg）': '首件（个）'" prop="id" align="center" width="200">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.first_company"
                    @blur="intFirstCompany(scope.row)"
                    clearable></el-input>
                </template>
              </el-table-column>
              <el-table-column label="运费（元）" prop="name" align="center" width="200">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.first_price" @blur="intMoney(scope.row)" clearable></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="mouldForm.type === 1 ? '续重（kg）': '续件（个）'" prop="desc" align="center" width="200">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.continued_company" @blur="intContinuedCompany(scope.row)" clearable></el-input>
                </template>
              </el-table-column>
              <el-table-column label="续费（元）" prop="desc" align="center" width="200">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.continued_price" @blur="intMoney(scope.row)" clearable></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item prop="area">
            <el-button type="text" plain @click="chooseArea">指定可配送区域和运费</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveMould('mouldForm')">保存模板</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="选择配送区域"
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
        <el-button @click="areaDialog = false">取 消</el-button>
        <el-button type="primary" @click="addTransItem">确 定</el-button>
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
        /** 当前面板的名字*/
        activeName: 'express',

        /** 新增模版/修改模版 */
        tplOperaName: '新增模版',

        /** 列表loading状态 */
        loading: false,

        /** 快递模板列表参数 */
        params: {},

        /** 快递模板列表数据 */
        tableData: [],

        /** 模板表单信息 */
        mouldForm: {
          /** 模板id */
          template_id: '',

          /** 模板名称 */
          name: '',

          /** 模版类型 */
          type: 1,

          items: []
        },

        /** 地区选择器是否打开 */
        areaDialog: false,

        /** 全部地区信息 */
        areaData: [],

        /** 是否是编辑模式 默认是添加模式(false) 编辑模式(true) */
        isEdit: false,

        /** 操作当前行索引 */
        currentIndex: -1,

        /** 过滤地区数据 */
        filterData: [],

        /** 树形地区选择器源数据 */
        fromData: {},

        /** 上一次更新的源数据 */
        lastFromData: {},

        /** 树形地区选择器目标数据 */
        toData: {},

        /** 树形地区选择器静态数据 用于存储用户操作的原始数据 */
        staticData: {},

        /** 树形地区选择器标题 */
        title: ['可选省、市、县', '已选省、市、县'],

        /** 表单校验规则*/
        rules: {
          name: [
            { required: true, message: '请输入模板名称', trigger: 'blur' },
            { max: 15, message: '模版名称最多15个字符', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择模板类型', trigger: 'change' }
          ]
        },

        isShow: false,
        configSheet: {},

        /** 列表loading状态 */
        logisticsLoading: false,

        /** 列表参数 */
        logisticsParams: {
          page_no: 1,
          page_size: 10
        },

        /** 列表数据 */
        logisticsTableData: '',

        /** 快递公司 表单 */
        expressForm: { formItems: [] },

        /** 快递公司 dialog */
        dialogExpressVisible: false
      }
    },
    filters: {
      typeStatus(type) {
        return type === 1 ? '重量算运费' : '计件算运费'
      }
    },
    mounted() {
      this.GET_ExpressMould()
      this.getAreaList()
      this.GET_ExpressList()
    },
    methods: {
      /** 获取全部地区数据 计算出用户操作变化的原始静态数据 方便使用 */
      getAreaList() {
        API_express.getAreaList().then(response => {
          response.pop()
          this.areaData = response
          // 为每一项设置选中属性 isSelected Boolean值
          let stack = []
          let parallel = []
          for (let i = 0, len = this.areaData.length; i < len; i++) {
            stack.push(this.areaData[i])
          }
          let item
          while (stack.length) {
            item = stack.shift()
            // 如果该节点有子节点，继续添加进入栈顶
            this.$set(item, 'isSelected', false)
            // 把当前项添加进入平行数组
            parallel.push(item)
            if (item.children && item.children.length) {
              stack = item.children.concat(stack)
            }
          }
          // 平行结构转换对象 随后可进行滚动加载进行性能优化， 可减少计算进行性能优化
          this.staticData = this.buildTree(parallel)
          this.initArea()
        })
      },

      /**
       * 将一维的扁平数组转换为多层级对象
       * @param  {[type]} list 一维数组，数组中每一个元素需包含id和parent_id两个属性
       * @return {[type]} tree 多层级树状结构
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

      /** 切换标签模版 */
      handleToggleClick(tab, event) {
        this.activeName = tab.name
        this.tplOperaName = '新增模版'
        if (this.activeName === 'express') {
          this.GET_ExpressMould()
        } else if (this.activeName === 'add') {
          this.mouldForm = {
            /** 模板id */
            template_id: '',

            /** 模板名称 */
            name: '',

            /** 模版类型 */
            type: 1,

            items: []
          }
          this.defaultArea = []
        } else {
          this.GET_logisticsList()
          this.isShow = false
        }
      },

      /** 初始化源数据 & 目标数据  每次只能给15条用来进行渲染 暂时没有用到 用于进行后期性能优化*/
      initArea() {
        // 初始化源数据
        const init_from = Object.keys(this.staticData).slice(0, 11)
        init_from.forEach(key => {
          this.fromData[key] = this.staticData[key]
        })
        // 初始化目标数据
        this.toData = {}

        // 2s 之后加载完整数据 用来加快弹框加载显示
        setTimeout(() => {
          this.fromData = JSON.parse(JSON.stringify(this.staticData))
        }, 2000)
      },

      /** 选择配送地区 */
      chooseArea() {
        this.areaDialog = true
        if (this.isEdit) this.toData = {}
        this.isEdit = false
      },

      /** 滚动监听触发 继续加载更多源数据 */
      fromLoadMore() {
        // console.log('滚动加载源数据')
      },

      /** 滚动监听触发 继续加载更多目标数据 */
      toLoadMore() {
        // console.log('滚动加载目标数据')
      },

      /** 源数据全选 */
      fromSelectedAll(val) {
        let stack = []
        for (let i in this.fromData) {
          stack.push(this.fromData[i])
        }
        let item
        while (stack.length) {
          item = stack.shift()
          // 如果当前节点的兄弟节点 全部跟当前节点一样 则父节点保持同步
          item.isSelected = val
          // 如果该节点有子节点，继续添加进入栈顶
          if (item && item.children && !Array.isArray(item.children)) {
            for (let i in item.children) {
              stack.push(item.children[i])
            }
          }
        }
      },

      /** 目标数据全选 */
      toSelectedAll(val) {
        let stack = []
        for (let i in this.toData) {
          stack.push(this.toData[i])
        }
        let item
        while (stack.length) {
          item = stack.shift()
          // 如果当前节点的兄弟节点 全部跟当前节点一样 则父节点保持同步
          item.isSelected = val
          // 如果该节点有子节点，继续添加进入栈顶
          if (item && item.children && !Array.isArray(item.children)) {
            for (let i in item.children) {
              stack.push(item.children[i])
            }
          }
        }
      },

      /** 源数据更新*/
      fromDataChange(data, type) {
        if (type) { // 如果type 为1 则进行添加 否则移除
          // 如果源数据（fromData）是空对象 则直接赋值 如果不是 则进行对象合并
          if (!Object.keys(this.fromData).length) {
            this.fromData = JSON.parse(JSON.stringify(data))
          } else {
            this.objAssign(this.fromData, data)
          }
        } else { // 移除
          this.objDel(this.fromData, data)
        }
        this.resetSelected(this.fromData)
      },

      /** 目标数据更新 */
      toDataChange(data, type) {
        if (type) { // 如果type 为1 则进行添加 否则移除
          // 如果目标数据（toData）是空对象 则直接赋值 如果不是 则进行对象合并
          if (!Object.keys(this.toData).length) {
            this.toData = JSON.parse(JSON.stringify(data))
          } else {
            this.objAssign(this.toData, data)
          }
        } else { // 移除
          this.objDel(this.toData, data)
        }
        this.resetSelected(this.toData)
      },

      // 对象合并 同名对象子节点添加
      objAssign(origins, data) {
        for (let i in data) {
          if (!origins[i]) { // 如果level1中被整合的目标数据中不存在当前选中项 直接把当前level1进行赋值
            this.$set(origins, i, JSON.parse(JSON.stringify(data[i])))
          } else { // 在level1中存在被整合的目标数据中不存在当前选中项 则进行检测下一级别（level2）
            for (let j in data[i].children) { // 如果level2中被整合的目标数据中不存在当前选中项 直接把当前level2进行赋值
              if (!origins[i].children[j]) {
                this.$set(origins[i].children, j, JSON.parse(JSON.stringify(data[i].children[j])))
              } else { // 在level2中存在被整合的目标数据中不存在当前选中项 则进行检测下一级别（level3）
                for (let k in data[i].children[j].children) { // 如果level3中被整合的目标数据中不存在当前选中项 直接把当前level3进行赋值
                  if (!origins[i].children[j].children[k]) {
                    this.$set(origins[i].children[j].children, k, JSON.parse(JSON.stringify(data[i].children[j].children[k])))
                  }
                }
              }
            }
          }
        }
      },

      // 对象递归移除 同名对象子节点移除
      objDel(origins, data) {
        for (let i in data) {
          if (data[i].isSelected) { // level1全选
            this.$delete(origins, i)
          } else {
            for (let j in data[i].children) { // level1级别未全选 则循环检查level2
              if (data[i].children[j].isSelected) { // level2全选
                this.$delete(origins[i].children, j)
              } else { // level2级别未全选 则循环检查level3
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

      /** 重置选中数据 isSelected 为false*/
      resetSelected(model) {
        let stack = []
        for (let i in model) {
          stack.push(model[i])
        }
        let item
        while (stack.length) {
          item = stack.shift()
          // 如果当前节点的兄弟节点 全部跟当前节点一样 则父节点保持同步
          item.isSelected = false
          // 如果该节点有子节点，继续添加进入栈顶
          if (item && item.children && !Array.isArray(item.children)) {
            for (let i in item.children) {
              stack.push(item.children[i])
            }
          }
        }
      },

      /** 树形地区选择器确认回调 */
      addTransItem() {
        // 关闭地区选择器
        this.areaDialog = false
        // 如果是编辑模式 则进行对应运费模版子项的更新
        if (this.isEdit) {
          // 检测目标数据是否为空对象 如果是则执行删除
          if (!Object.keys(this.toData).length) {
            this.implementDel(this.currentIndex)
          } else {
            this.mouldForm.items[this.currentIndex].area = JSON.parse(JSON.stringify(this.toData))
          }
        } else { // 如果是添加模式 则添加运费模版子项
          // 校验目标数据是否为空
          if (!Object.keys(this.toData).length) {
            this.$message.warning('目标地区数据为空，可点击取消或右上角关闭地区选择器')
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
        // 更新过滤地区数据  把新添加或者删除的目标数据更新进入过滤地区中
        if (this.filterData[this.currentIndex]) { // 替换
          this.filterData[this.currentIndex] = JSON.parse(JSON.stringify(this.toData))
        } else { // 添加
          this.filterData.push(JSON.parse(JSON.stringify(this.toData)))
        }
        // 置空目标数据
        this.toData = {}
        // 上次源数据更新
        this.lastFromData = JSON.parse(JSON.stringify(this.fromData))
      },

      /** 过滤first_company */
      intFirstCompany(row) {
        if (!RegExp.integer.test(row.first_company)) {
          row.first_company = 1
        }
      },

      /** 过滤continued_company */
      intContinuedCompany(row) {
        if (!RegExp.integer.test(row.continued_company)) {
          row.continued_company = 1
        }
      },

      /** 过滤first_price continued_price */
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

      /** 编辑子地区 */
      editArea(row, $index) {
        this.areaDialog = true
        this.isEdit = true
        // 更新当前目标数据
        this.toData = JSON.parse(JSON.stringify(row.area))
        // 目标数据进行重置选中
        this.resetSelected(this.toData)
        // 更新当前操作索引
        this.currentIndex = $index
      },

      /** 删除子地区 */
      delArea($index) {
        this.$confirm('确定删除?', '提示', { type: 'warning' }).then(() => {
          this.implementDel($index)
        }).catch(() => {})
      },

      /** 执行删除子地区 */
      implementDel($index) {
        // 更新表格数据
        this.mouldForm.items.splice($index, 1)
        // 更新过滤数据 删除
        const delItem = this.filterData.splice($index, 1)
        // 更新源数据
        for (let i in delItem[0]) {
          if (!this.fromData[i]) { // 不存在level1
            this.$set(this.fromData, i, delItem[0][i])
          } else {
            for (let j in delItem[0][i].children) {
              if (!this.fromData[i].children[j]) { // 不存在level2
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

      /** 获取快递模板列表信息 */
      GET_ExpressMould() {
        this.loading = true
        API_express.getTplList().then(response => {
          this.loading = false
          this.tableData = response
        })
      },

      /** 编辑模板*/
      handleEditMould(row) {
        this.activeName = 'add'
        this.tplOperaName = '修改模版'
        API_express.getSimpleTpl(row.id).then((response) => {
          // 重置初始数据 防止重复编辑的情况下出错
          this.fromData = JSON.parse(JSON.stringify(this.staticData))
          // 计算编辑地区
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
          // 此时的上次源数据 为过滤后的地区数据
          this.lastFromData = JSON.parse(JSON.stringify(this.fromData))
          this.mouldForm = { ...response }
          // 初始化过滤地区
          this.filterData = []
          response.items.forEach(key => {
            this.filterData.push(JSON.parse(JSON.stringify(key.area)))
          })
        })
      },

      /** 删除模板*/
      handleDeleteMould(row) {
        const _id = row.id
        this.$confirm(`确定要删除模板么?`, '确认信息', { type: 'warning' })
          .then(() => {
            API_express.deleteExpressMould(_id).then(() => {
              this.GET_ExpressMould()
              this.$message.success('删除成功')
            })
          })
      },

      /** 新增模板 */
      handleAddMould() {
        this.activeName = 'add'
        this.tplOperaName = '新增模板'
        this.mouldForm = {
          /** 模板id */
          id: '',

          /** 模板名称 */
          name: '',

          /** 模版类型 */
          type: 1,

          items: []
        }
        // 重置源数据
        this.fromData = JSON.parse(JSON.stringify(this.staticData))
        // 重置目标数据
        this.toData = {}
        // 重置过滤地区
        this.filterData = []
        // 此时的上次源数据 为过滤后的地区数据
        this.lastFromData = JSON.parse(JSON.stringify(this.fromData))
      },

      /** 检测是否全选 */
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

        if (model.level === 3) { // 此处怀疑逻辑有问题，但是没有发现，可能是我神经质了把。。。mmp
          if (_resultlevel3 <= 1 && (!this.lastFromData[model.parent_id] || !this.lastFromData[model.parent_id].children[model.id])) {
            isSelectAll = true
          }
        }

        return isSelectAll
      },

      /** 保存模板 */
      saveMould(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const _params = JSON.parse(JSON.stringify(this.mouldForm))
            _params.items.forEach(key => {
              // 计算提交数据
              for (let i in key.area) {
                if (this.checkSelectAll(key.area[i])) { // level1 全选
                  this.$set(key.area[i], 'selected_all', true)
                  key.area[i].children = null
                } else {
                  this.$set(key.area[i], 'selected_all', false)
                  for (let j in key.area[i].children) {
                    if (this.checkSelectAll(key.area[i].children[j])) { // level2 全选
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
            if (this.mouldForm.id) { // 修改
              API_express.saveExpressMould(this.mouldForm.id, _params).then(() => {
                this.$message.success('修改成功')
                this.GET_ExpressMould()
                this.activeName = 'express'
                this.tplOperaName = '新增模板'
              })
            } else { // 添加
              delete this.mouldForm.id
              API_express.addExpressMould(_params).then(() => {
                this.$message.success('添加成功')
                this.GET_ExpressMould()
                this.activeName = 'express'
              })
            }
          }
        })
      },

      addFormList() {
        /** 电子面单表单验证 */
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
          this.$message.error('请填写完整在添加！')
          return
        }
        formItems.forEach(item => {
          let current = formItems.filter(j => (j.code === item.code || j.name === item.name))
          current.length > 1 ? isContainue = false : null
        })
        if (!isContainue) {
          this.$message.error('已经存在重复的字段类型或字段名称！')
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

      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.logisticsParams.page_size = size
        this.GET_ExpressList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.logisticsParams.page_no = page
        this.GET_ExpressList()
      },

      /** 添加快递公司 */
      handleAddExpress() {
        this.expressForm = { is_waybill: 0, formItems: [] }
        this.dialogExpressVisible = true
        this.$nextTick(() => this.$refs.expressForm.clearValidate())
      },

      /** 编辑物流公司 */
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

      /** 快递公司 提交表单 */
      submitExpressForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const { id } = this.expressForm
            let expressForm = JSON.parse(JSON.stringify(this.expressForm))
            if (!id) {
              API_logistics.addExpress(expressForm).then(response => {
                this.dialogExpressVisible = false
                this.$message.success('添加成功！')
                this.GET_ExpressList()
              })
            } else {
              API_logistics.editExpress(id, expressForm).then(response => {
                this.dialogExpressVisible = false
                this.$message.success('保存成功！')
                this.GET_ExpressList()
              })
            }
          } else {
            this.$message.error('表单填写有误，请检查！')
            return false
          }
        })
      },

      /** 获取物流公司信息*/
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

      /** 获取物流公司列表 */
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

