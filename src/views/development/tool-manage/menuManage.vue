<template>
  <div class="menus-container">
    <el-tree
      :data="menus"
      node-key="identifier"
      :expand-on-click-node="true"
    >
      <span class="custom-tree-node" slot-scope="{node, data}">
        <span>{{ data.title }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            :disabled="node.level === 3"
            icon="el-icon-plus"
            :title="node.level === 3 ? '菜单最多添加三级' : '增加'"
            @click.stop="handleAddMenu(data)"
          />
          <el-button
            type="text"
            size="mini"
            icon="el-icon-minus"
            title="删除"
            @click.stop="handleDeleteMenu(node, data)"
          />
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            title="编辑"
            @click.stop="handleEditMenu(data)"
          />
        </span>
      </span>
    </el-tree>
    <el-button
      v-if="menus"
      type="text"
      size="mini"
      style="margin-top: 10px; margin-left: 20px"
      @click="handleAddMenu('')"
    >添加顶级菜单</el-button>
    <el-dialog
      :title="menuForm.menu_name ? '编辑菜单' : '添加菜单'"
      :visible.sync="dialogMenuVisible"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="menuForm" :rules="menuRules" ref="menuForm" label-width="100px">
        <el-form-item label="菜单标题" prop="title">
          <el-input v-model="menuForm.title" :maxlength="6"></el-input>
        </el-form-item>
        <el-form-item label="菜单标识" prop="identifier">
          <el-input v-model="menuForm.identifier" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限" prop="auth_regular">
          <el-input v-model="menuForm.auth_regular" :maxlength="50"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogMenuVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitMenuForm('menuForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_Menus from '@/api/menus'

  export default {
    name: 'menuManage',
    data() {
      return {
        menus: [],
        /** 添加、编辑菜单 表单 */
        menuForm: {},
        /** 添加、编辑菜单 表单规则 */
        menuRules: {
          title: [
            this.MixinRequired('请输入菜单标题！'),
            { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
          ],
          identifier: [
            this.MixinRequired('请输入菜单标识！'),
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ],
          auth_regular: [
            this.MixinRequired('请输入菜单权限！'),
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ]
        },
        /** 添加、编辑菜单 dialog */
        dialogMenuVisible: false,
        /** 当前操作的menu */
        currentMenu: ''
      }
    },
    created() {
      this.GET_Memus()
    },
    methods: {
      /** 添加菜单 */
      handleAddMenu(menu) {
        this.menuForm = {
          parent_id: menu ? menu.id : 0
        }
        this.currentMenu = menu || {}
        this.dialogMenuVisible = true
      },
      /** 删除菜单 */
      handleDeleteMenu(node, menu) {
        this.$confirm('确定要删除这个菜单吗？如果有子菜单，子菜单也会被一并删除！', '提示', { type: 'warning' }).then(() => {
          API_Menus.deleteMenu(menu.id).then(() => {
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.id === menu.id)
            children.splice(index, 1)
          })
        }).catch(() => {})
      },
      /** 编辑菜单 */
      handleEditMenu(menu) {
        this.menuForm = JSON.parse(JSON.stringify(menu))
        this.currentMenu = menu
        this.dialogMenuVisible = true
      },
      /** 添加、编辑菜单 表单提交 */
      submitMenuForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const { id } = this.menuForm
            if (id) {
              API_Menus.editMenu(id, this.menuForm).then(response => {
                this.dialogMenuVisible = false
                this.$message.success('保存成功！')
                this.GET_Memus()
              })
            } else {
              API_Menus.addMenu(this.menuForm).then(response => {
                const data = this.currentMenu
                if (this.menuForm.parent_id === 0) {
                  this.menus.push(response)
                } else {
                  if (!data.children) this.$set(data, 'children', [])
                  data.children.push(response)
                }
                this.dialogMenuVisible = false
                this.$message.success('保存成功！')
              })
            }
          } else {
            this.$message.error('表单填写有误，请检查！')
            return false
          }
        })
      },
      /** 获取菜单 */
      GET_Memus(parent_id) {
        API_Menus.getMenusChildren(parent_id).then(response => {
          this.menus = response
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .menus-container {
    padding: 10px;
    background-color: #fff;
    /deep/ .el-tree {
      width: 500px;
    }
    /deep/ .el-icon-minus {
      color: #F56C6C;
    }
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
