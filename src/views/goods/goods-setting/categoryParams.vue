<template>
  <div id="params-container">
    <div id="add-new-group">
      <i class="add-btn" @click="addGroupForm.show = true">+</i>
      <div v-show="addGroupForm.show" class="add-div">
        <span class="add-div-title">参数组名</span>
        <input v-model="addGroupForm.group_name">
        <el-button type="text" size="mini" @click="handleSaveAddParamsGroup">保存</el-button>
        <el-button type="text" size="mini" @click="addGroupForm.show = false">取消</el-button>
      </div>
    </div>
    <el-card v-for="(group, index) in paramsGroup" :key="group.group_id">
      <div slot="header" class="clearfix">
        <span>参数组名：{{ group.group_name }}</span>
        <el-dropdown trigger="click" @command="handleGroupCommand" style="float: right">
          <span class="el-dropdown-link">操作<i class="el-icon-arrow-down el-icon--right"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{type: 'edit', group}">编辑</el-dropdown-item>
            <el-dropdown-item :command="{type: 'delete', group}">删除</el-dropdown-item>
            <el-dropdown-item v-if="index !== 0" :command="{type: 'sort_up', group}">上移</el-dropdown-item>
            <el-dropdown-item v-if="index !== paramsGroup.length - 1" :command="{type: 'sort_down', group}">下移</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <template v-if="group.params && group.params.length > 0">
        <div v-for="(param, index) in group.params" :key="param.param_id" class="param-item">
          <span>{{ param.param_name }} 【{{ param.param_type | paramTypeFilter }}】</span>
          <span>
            <el-button type="text" size="mini" @click="handleEditParam(group, param)">编辑</el-button>
            <el-button type="text" size="mini" style="color: #F56C6C" @click="handleDeleteParam(group, param)">删除</el-button>
            <el-button :disabled="index === 0" type="text" size="mini" @click="handleSortParam('up', group, param)">上移</el-button>
            <el-button :disabled="index === group.params.length - 1" type="text" size="mini" @click="handleSortParam('down', group, param)">下移</el-button>
          </span>
        </div>
      </template>
      <div v-else class="param-item empty">暂无数据...</div>
      <el-button type="text" class="add-params-btn" @click="handleAddParams(group)">添加</el-button>
    </el-card>
    <el-dialog
      :title="paramForm.param_id ? '编辑参数' : '添加参数'"
      :visible.sync="dialogParamsVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="500px"
    >
      <el-form :model="paramForm" :rules="paramsRules" ref="paramForm" label-width="100px">
        <el-form-item label="参数名称" prop="param_name">
          <el-input v-model="paramForm.param_name"></el-input>
        </el-form-item>
        <el-form-item label="参数类型" prop="param_type">
          <el-select v-model="paramForm.param_type" placeholder="请选择">
            <el-option label="输入项" :value="1"/>
            <el-option label="选择项" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="可选择值" prop="options">
          <el-input
            ref="paramOptionsInput"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入可选择值，多个值用英文逗号隔开。(选择'选择项'时,必填!)"
            v-model="paramForm.options">
          </el-input>
        </el-form-item>
        <el-form-item label="选项">
          <el-checkbox v-model="paramForm.required" :true-label="1" :false-label="0">必填</el-checkbox>
          <el-checkbox v-model="paramForm.is_index" :true-label="1" :false-label="0">可索引</el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogParamsVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitParamForm('paramForm')">确 定</el-button>
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
        /** 分类ID */
        category_id: this.$route.params.id,
        /** 参数组 */
        paramsGroup: [],
        /** 编辑分类参数 dialog */
        dialogParamsVisible: false,
        /** 添加、编辑参数 表单 */
        paramForm: {},
        /** 添加、编辑参数 规格 */
        paramsRules: {
          param_name: [this.MixinRequired('请输入参数名称！')],
          options: [this.MixinRequired('请输入可选值！')]
        },
        /** 添加参数组 表单 */
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
        return val === 1 ? '输入项' : '选择项'
      }
    },
    methods: {
      /** 新增参数组 */
      handleSaveAddParamsGroup() {
        const _name = this.addGroupForm.group_name
        if (!_name) {
          this.$message.error('请输入参数组名！')
        } else {
          API_Params.addParamsGroup({
            group_name: _name,
            category_id: this.category_id
          }).then(response => {
            this.addGroupForm.group_name = ''
            this.addGroupForm.show = false
            this.$message.success('保存成功！')
            this.GET_CategoryParamsGroup()
          })
        }
      },
      /** 下拉触发 */
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
      /** 编辑参数组名 */
      handleEditGroup(group) {
        this.$prompt('编辑参数组名', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: group.group_name,
          inputPattern: /.+/,
          inputErrorMessage: '名称不能为空！'
        }).then(obj => {
          if (obj.value.length > 50) {
            this.$message.error('参数组名称不能超过50个字')
            return
          }
          API_Params.editParamsGroup(group.group_id, {
            group_name: obj.value,
            category_id: this.category_id
          }).then(response => {
            group.group_name = response.group_name
            this.$message.success('修改成功！')
          })
        }).catch(() => {})
      },
      /** 删除参数组 */
      handleDeleteGroup(group) {
        this.$confirm('确定要删除这个参数组吗？', '提示', { type: 'warning' }).then(() => {
          const _id = group.group_id
          API_Params.deleteParamsGroup(_id).then(() => {
            this.$message.success('删除成功！')
            this.GET_CategoryParamsGroup()
          })
        }).catch(() => {})
      },
      /** 参数组排序 */
      handleSortGroup(type, group) {
        API_Params.sortParamsGroup(group.group_id, type).then(() => {
          this.paramsGroup = this.swapaPlaces(this.paramsGroup, type, group)
          this.$message.success('修改成功！')
        })
      },
      /** 添加参数 */
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
      /** 编辑参数 */
      handleEditParam(group, params) {
        this.paramForm = {
          ...params,
          group_id: group.group_id,
          category_id: this.category_id
        }
        this.dialogParamsVisible = true
      },
      /** 删除参数 */
      handleDeleteParam(group, param) {
        this.$confirm('确定要删除这个参数吗？', '提示', { type: 'warning' }).then(() => {
          API_Params.deleteParams(param.param_id).then(() => {
            this.$message.success('删除成功！')
            group.params.splice(group.params.findIndex(item => item === param), 1)
          })
        }).catch(() => {})
      },
      /** 参数排序 */
      handleSortParam(type, group, param) {
        API_Params.sortParams(param.param_id, type).then(() => {
          group.params = this.swapaPlaces(group.params, type, param)
          this.$message.success('修改成功！')
        })
      },
      /** 添加、编辑 表单提交 */
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
                this.$message.success('保存成功！')
              })
            } else {
              API_Params.addParams(this.paramForm).then(response => {
                this.dialogParamsVisible = false
                const index = this.paramsGroup.findIndex(item => item.group_id === group_id)
                this.paramsGroup[index].params.push(response)
                this.$refs[formName].resetFields()
                this.$message.success('保存成功！')
              })
            }
          } else {
            this.$message.error('表单填写有误，请检查！')
            return false
          }
        })
      },
      /** 返回交换位置后的数组 */
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
      /** 获取参数组 */
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
