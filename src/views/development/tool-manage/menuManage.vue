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
            :title="node.level === 3 ? 'Add up to three levels to the menu' : 'increase'"
            @click.stop="handleAddMenu(data)"
          />
          <el-button
            type="text"
            size="mini"
            icon="el-icon-minus"
            title="delete"
            @click.stop="handleDeleteMenu(node, data)"
          />
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            title="edit"
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
    >Add top-level menu</el-button>
    <el-dialog
      :title="menuForm.menu_name ? 'The edit menu' : 'Add menu'"
      :visible.sync="dialogMenuVisible"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="menuForm" :rules="menuRules" ref="menuForm" label-width="100px">
        <el-form-item label="The menu title" prop="title">
          <el-input v-model="menuForm.title" :maxlength="6"></el-input>
        </el-form-item>
        <el-form-item label="Menu identifier" prop="identifier">
          <el-input v-model="menuForm.identifier" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="Menu permissions" prop="auth_regular">
          <el-input v-model="menuForm.auth_regular" :maxlength="50"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogMenuVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitMenuForm('menuForm')">save</el-button>
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
        /** add、Edit menu form*/
        menuForm: {},
        /** add、Edit menu form rules*/
        menuRules: {
          title: [
            this.MixinRequired('Please enter the menu title！'),
            { min: 2, max: 6, message: 'The length of2 to6 A character', trigger: 'blur' }
          ],
          identifier: [
            this.MixinRequired('Please enter the menu id！'),
            { min: 1, max: 50, message: 'The length of1 to50 A character', trigger: 'blur' }
          ],
          auth_regular: [
            this.MixinRequired('Please enter menu permission！'),
            { min: 1, max: 50, message: 'The length of1 to50 A character', trigger: 'blur' }
          ]
        },
        /** add、The edit menudialog */
        dialogMenuVisible: false,
        /** Currently in operationmenu */
        currentMenu: ''
      }
    },
    created() {
      this.GET_Memus()
    },
    methods: {
      /** Add menu*/
      handleAddMenu(menu) {
        this.menuForm = {
          parent_id: menu ? menu.id : 0
        }
        this.currentMenu = menu || {}
        this.dialogMenuVisible = true
      },
      /** Delete menu*/
      handleDeleteMenu(node, menu) {
        this.$confirm('Are you sure to delete this menu？If there are submenus, the submenus are also deleted！', 'prompt', { type: 'warning' }).then(() => {
          API_Menus.deleteMenu(menu.id).then(() => {
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.id === menu.id)
            children.splice(index, 1)
          })
        }).catch(() => {})
      },
      /** The edit menu*/
      handleEditMenu(menu) {
        this.menuForm = JSON.parse(JSON.stringify(menu))
        this.currentMenu = menu
        this.dialogMenuVisible = true
      },
      /** add、Edit the menu form submission*/
      submitMenuForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const { id } = this.menuForm
            if (id) {
              API_Menus.editMenu(id, this.menuForm).then(response => {
                this.dialogMenuVisible = false
                this.$message.success('Save success！')
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
                this.$message.success('Save success！')
              })
            }
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },
      /** Access to the menu*/
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
