<template>
  <div id="params-container">
    <div id="add-new-group">
      <i class="add-btn" @click="addGroupForm.show = true">+</i>
      <div v-show="addGroupForm.show" class="add-div">
        <span class="add-div-title">group name</span>
        <input v-model="addGroupForm.group_name">
        <el-button type="text" size="mini" @click="handleSaveAddParamsGroup">save</el-button>
        <el-button type="text" size="mini" @click="addGroupForm.show = false">cancel</el-button>
      </div>
    </div>
    <el-card v-for="(group, index) in paramsGroup" :key="group.group_id">
      <div slot="header" class="clearfix">
        <span>group name：{{ group.group_name }}</span>
        <el-dropdown trigger="click" @command="handleGroupCommand" style="float: right">
          <span class="el-dropdown-link">Operation<i class="el-icon-arrow-down el-icon--right"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{type: 'edit', group}">edit</el-dropdown-item>
            <el-dropdown-item :command="{type: 'delete', group}">delete</el-dropdown-item>
            <el-dropdown-item v-if="index !== 0" :command="{type: 'sort_up', group}"> up</el-dropdown-item>
            <el-dropdown-item v-if="index !== paramsGroup.length - 1" :command="{type: 'sort_down', group}">down</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <template v-if="group.params && group.params.length > 0">
        <div v-for="(param, index) in group.params" :key="param.param_id" class="param-item">
          <span>{{ param.param_name }} 【{{ param.param_type | paramTypeFilter }}】</span>
          <span>
            <el-button type="text" size="mini" @click="handleEditParam(group, param)">edit</el-button>
            <el-button type="text" size="mini" style="color: #F56C6C" @click="handleDeleteParam(group, param)">delete</el-button>
            <el-button :disabled="index === 0" type="text" size="mini" @click="handleSortParam('up', group, param)"> up</el-button>
            <el-button :disabled="index === group.params.length - 1" type="text" size="mini" @click="handleSortParam('down', group, param)">down</el-button>
          </span>
        </div>
      </template>
      <div v-else class="param-item empty">no data...</div>
      <el-button type="text" class="add-params-btn" @click="handleAddParams(group)">add</el-button>
    </el-card>
    <el-dialog
      :title="paramForm.param_id ? 'Edit parameters' : 'Add parameters'"
      :visible.sync="dialogParamsVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="500px"
    >
      <el-form :model="paramForm" :rules="paramsRules" ref="paramForm" label-width="100px">
        <el-form-item label="name" prop="param_name">
          <el-input v-model="paramForm.param_name"></el-input>
        </el-form-item>
        <el-form-item label="type" prop="param_type">
          <el-select v-model="paramForm.param_type" placeholder="Please select">
            <el-option label="Input item" :value="1"/>
            <el-option label="Select item" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="value list" prop="options">
          <el-input
            ref="paramOptionsInput"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="Please enter optional values separated by English commas.(choose'choose项'when,Mandatory!)"
            v-model="paramForm.options">
          </el-input>
        </el-form-item>
        <el-form-item label="options">
          <el-checkbox v-model="paramForm.required" :true-label="1" :false-label="0">required</el-checkbox>
          <el-checkbox v-model="paramForm.is_index" :true-label="1" :false-label="0">index</el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogParamsVisible = false">cancel</el-button>
    <el-button type="primary" @click="submitParamForm('paramForm')">save</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_Params from '@/api/goodsSetting'

  export default {
    name: 'categoryParams',
    data() {
      return {
        /** CategoriesID */
        category_id: this.$route.params.id,
        /** Parameter set*/
        paramsGroup: [],
        /** Edit classification parametersdialog */
        dialogParamsVisible: false,
        /** add、Edit the parameter form*/
        paramForm: {},
        /** add、Edit parameter specifications*/
        paramsRules: {
          param_name: [this.MixinRequired('Please enter a parameter name！')],
          options: [this.MixinRequired('Please enter an optional value！')]
        },
        /** Add a parameter group form*/
        addGroupForm: {
          show: false,
          group_name: ''
        }
      }
    },
    created() {
      this.GET_CategoryParamsGroup()
    },
    watch: {
      'paramForm.param_type': function paramType(newVal) {
        this.paramsRules['options'][0].required = newVal === 2
      }
    },
    filters: {
      paramTypeFilter(val) {
        return val === 1 ? 'Input item' : 'Select item'
      }
    },
    methods: {
      /** New parameter group*/
      handleSaveAddParamsGroup() {
        const _name = this.addGroupForm.group_name
        if (!_name) {
          this.$message.error('Please enter a parameter group name！')
        } else {
          API_Params.addParamsGroup({
            group_name: _name,
            category_id: this.category_id
          }).then(response => {
            this.addGroupForm.group_name = ''
            this.addGroupForm.show = false
            this.$message.success('Save success！')
            this.GET_CategoryParamsGroup()
          })
        }
      },
      /** The drop-down trigger*/
      handleGroupCommand(object) {
        switch (object.type) {
          case 'edit':
            this.handleEditGroup(object.group)
            break
          case 'delete':
            this.handleDeleteGroup(object.group)
            break
          case 'sort_up':
            this.handleSortGroup('up', object.group)
            break
          case 'sort_down':
            this.handleSortGroup('down', object.group)
            break
        }
      },
      /** Edit the parameter group name*/
      handleEditGroup(group) {
        this.$prompt('Edit the parameter group name', 'prompt', {
          confirmButtonText: 'save',
          cancelButtonText: 'cancel',
          inputValue: group.group_name,
          inputPattern: /.+/,
          inputErrorMessage: 'The name cannot be empty！'
        }).then(obj => {
          if (obj.value.length > 50) {
            this.$message.error('Parameter group names cannot exceed50A word')
            return
          }
          API_Params.editParamsGroup(group.group_id, {
            group_name: obj.value,
            category_id: this.category_id
          }).then(response => {
            group.group_name = response.group_name
            this.$message.success('Modify the success！')
          })
        }).catch(() => {})
      },
      /** Delete parameter set*/
      handleDeleteGroup(group) {
        this.$confirm('Are you sure you want to delete this parameter group？', 'prompt', { type: 'warning' }).then(() => {
          const _id = group.group_id
          API_Params.deleteParamsGroup(_id).then(() => {
            this.$message.success('Delete the success！')
            this.GET_CategoryParamsGroup()
          })
        }).catch(() => {})
      },
      /** Parameter group sort*/
      handleSortGroup(type, group) {
        API_Params.sortParamsGroup(group.group_id, type).then(() => {
          this.paramsGroup = this.swapaPlaces(this.paramsGroup, type, group)
          this.$message.success('Modify the success！')
        })
      },
      /** Add parameters*/
      handleAddParams(group) {
        this.paramForm = {
          param_name: '',
          param_type: 1,
          options: '',
          required: 0,
          is_index: 0,
          group_id: group.group_id,
          category_id: this.category_id
        }
        this.dialogParamsVisible = true
      },
      /** Edit parameters*/
      handleEditParam(group, params) {
        this.paramForm = {
          ...params,
          group_id: group.group_id,
          category_id: this.category_id
        }
        this.dialogParamsVisible = true
      },
      /** Delete the parameter*/
      handleDeleteParam(group, param) {
        this.$confirm('Are you sure you want to delete this parameter？', 'prompt', { type: 'warning' }).then(() => {
          API_Params.deleteParams(param.param_id).then(() => {
            this.$message.success('Delete the success！')
            group.params.splice(group.params.findIndex(item => item === param), 1)
          })
        }).catch(() => {})
      },
      /** Parameters of the sort*/
      handleSortParam(type, group, param) {
        API_Params.sortParams(param.param_id, type).then(() => {
          group.params = this.swapaPlaces(group.params, type, param)
          this.$message.success('Modify the success！')
        })
      },
      /** add、Edit form submission*/
      submitParamForm(formName) {
        this.$refs[formName].validate((valid) => {
          const { param_type, options, group_id, param_id } = this.paramForm
          if (valid) {
            if (param_id) {
              API_Params.editParams(param_id, this.paramForm).then(response => {
                this.dialogParamsVisible = false
                const group = this.paramsGroup.filter(item => item.group_id === group_id)[0]
                const index = group.params.findIndex(item => item.param_id === param_id)
                group.params[index] = response
                this.$refs[formName].resetFields()
                this.$message.success('Save success！')
              })
            } else {
              API_Params.addParams(this.paramForm).then(response => {
                this.dialogParamsVisible = false
                const index = this.paramsGroup.findIndex(item => item.group_id === group_id)
                this.paramsGroup[index].params.push(response)
                this.$refs[formName].resetFields()
                this.$message.success('Save success！')
              })
            }
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },
      /** Returns the array after swapping positions*/
      swapaPlaces(arr, type, ele) {
        const index = arr.findIndex(item => item === ele)
        if (type === 'up') {
          if (index === 0) return arr
          arr[index] = arr.splice(index - 1, 1, arr[index])[0]
        } else {
          if (index === arr.length - 1) return arr
          arr[index] = arr.splice(index + 1, 1, arr[index])[0]
        }
        return arr
      },
      /** Get parameter set*/
      GET_CategoryParamsGroup() {
        API_Params.getCategoryParams(this.category_id).then(response => {
          this.paramsGroup = response
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  #params-container {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    background-color: #fff;
    padding: 10px;
    min-height: 150px;
    /deep/ .el-card {
      min-width: 300px;
      max-width: 500px;
      min-height: 100px;
      margin: 10px;
      overflow: hidden;
    }
    /deep/ .el-card__header {
      padding: 10px 15px;
      background-color: #f5f7fa;
    }
    /deep/ .el-card__body {
      padding: 10px 15px 0;
    }
    /deep/ .el-dropdown-link{
      cursor:pointer;
      color:#409eff
    }
    /deep/ .el-icon-arrow-down{
      font-size:12px
    }
  }
  #add-new-group {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 10;
    min-width: 30px;
    height: 30px;
    background: #475669;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color .3s ease;
    &:hover {
      background-color: rgb(192,204,218);
      cursor: pointer;
      .add-btn { color: rgb(71,86,105) }
    }
    .add-btn {
      display: block;
      width: 30px;
      text-align: center;
      font-size: 30px;
      font-weight: bold;
      color: white;
      margin-top: -7px;
    }
    .add-div {
      display: flex;
      background: #324057;
      align-items: center;
      justify-content: space-around;
      min-width: 330px;
      height: 40px;
      position: absolute;
      top: -5px;
      left: 50px;
      padding: 2px 5px;
      color: #F9FAFC;
      box-shadow: 0 0 10px 0 #303133;
      .add-div-title {  font-size: 12px }
    }
  }
  .add-params-btn {
    width: 100%;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  /deep/ .el-checkbox+.el-checkbox { margin-left: 20px }
  /deep/ .el-button+.el-button { margin-left: 0 }
  .param-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px;
    background-color: #f5f7fa;
    font-size: 14px;
    &.empty { background-color: #fff }
  }
</style>
