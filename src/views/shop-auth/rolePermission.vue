<template>
  <div class="permission-container">
    <el-form :model="permissionForm" :rules="permissionRules" ref="permissionForm" label-width="200px" class="demo-ruleForm">
      <el-form-item label="角色名称" prop="role_name">
        <el-input v-model="permissionForm.role_name"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="role_describe">
        <el-input v-model="permissionForm.role_describe" placeholder="最多200字" :maxlength="200"></el-input>
      </el-form-item>
      <el-form-item label="角色权限" prop="permission">
        <el-checkbox :indeterminate="allIndeterminate" v-model="allCheck" @change="handleCheckAll">全部选择</el-checkbox>
        <div v-for="(item, index) in permissions" :key="item.identifier" class="level_1">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-checkbox
                v-model="item.checked"
                :label="item.title"
                :indeterminate="checkIndeterminate(item.children)"
                @change="handleCheckboxChanged(item)"
              ></el-checkbox>
            </el-col>
            <el-col :span="20">
              <div v-for="(_item, _index) in item.children" :key="_item.identifier" class="checkbox-dropdown">
                <el-checkbox
                  v-model="_item.checked"
                  :label="_item.title"
                  :indeterminate="checkIndeterminate(_item.children)"
                  @change="handleCheckboxChanged(_item, item)"
                ></el-checkbox>
                <template v-if="_item.children && _item.children.length">
                  <el-dropdown trigger="click" split-button :hide-on-click="false">
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="(__item, __index) in _item.children" :key="__item.identifier">
                        <el-checkbox
                          v-model="__item.checked"
                          :label="__item.title"
                          @change="handleCheckboxChanged(__item, _item)"
                        ></el-checkbox>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" size="small" style="margin-top: 15px" @click="saveRolePermission">保存设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import * as API_Auth from '@/api/auth'
  import * as API_Menus from '@/api/menus'

  export default {
    name: 'rolePermission',
    data() {
      return {
        /** 权限 表单 */
        permissionForm: {
          role_name: ''
        },
        /** 权限 表单规则 */
        permissionRules: {
          role_name: [
            this.MixinRequired('请输入角色名称！'),
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ]
        },
        permissions: [],
        // 全选状态
        allCheck: false,
        // 全选不确定状态
        allIndeterminate: false
      }
    },
    mounted() {
      this.role_id = Number(this.$route.params.id)
      this.GET_RolePermission()
    },
    beforeRouteUpdate(to, from, next) {
      this.role_id = to.params.id
      next()
    },
    activated() {
      this.role_id = this.$router.params.id
    },
    watch: {
      role_id: 'GET_RolePermission'
    },
    methods: {
      /** 全选 */
      handleCheckAll(checked) {
        this.allIndeterminate = false
        this.$set(this, 'permissions', this.setPermissionsCheck(this.permissions, checked))
      },
      /** 选择 */
      handleCheckboxChanged(item, parent) {
        if (item.children && item.children.length) {
          this.$set(item, 'children', this.setPermissionsCheck(item.children, item.checked))
        }
        this.countAllPermissions()
        this.countParentChecked()
      },
      /** 设置权限状态 */
      setPermissionsCheck(permissions, checked) {
        const perm = this.MixinClone(permissions)
        perm.map(item => {
          item.checked = checked
          this.$set(item, 'checked', checked)
          if (item.children && item.children.length) {
            this.$set(item, 'children', this.setPermissionsCheck(item.children, checked))
          }
        })
        return perm
      },
      /** 检测是否有不确定性 */
      checkIndeterminate(permissions) {
        if (!Array.isArray(permissions)) return false
        const _len = permissions.length
        const __len = permissions.filter(item => item.checked).length
        return (__len !== 0) && (_len !== __len)
      },
      /** 获取所有权限展开后的长度、被选中的长度 */
      countAllPermissions(permissions) {
        permissions = permissions || this.permissions
        const _list = []
        permissions.forEach(item => {
          _list.push(item)
          if (item.children) _list.push(...this.countAllPermissions(item.children))
        })
        const length = _list.length
        const length_checked = _list.filter(_item => _item.checked).length
        this.allCheck = length === _list.filter(_item => _item.checked).length
        this.allIndeterminate = (length_checked !== 0) && (length !== length_checked)
        return _list
      },
      /** 计算所有父辈的选中状态 */
      countParentChecked(permissions) {
        permissions = permissions || this.permissions
        permissions.forEach(item => {
          if (item.children && item.children.length) {
            this.countParentChecked(item.children)
            const lenght = item.children.length
            const checked_length = item.children.filter(_item => _item.checked).length
            item.checked = !!checked_length
          }
        })
      },
      /** 保存角色权限 */
      saveRolePermission() {
        this.$refs['permissionForm'].validate(valid => {
          if (valid) {
            const params = {
              ...this.permissionForm,
              menus: this.permissions
            }
            this.role_id === 0
              ? API_Auth.addRole(params).then(() => saveSuccess())
              : API_Auth.editRole(this.role_id, params).then(() => saveSuccess())
            const saveSuccess = () => {
              this.$message.success('保存成功！')
              this.$route.params.callback()
              this.$store.dispatch('delCurrentViews', {
                view: this.$route,
                $router: this.$router
              })
            }
          } else {
            this.$message.error('表单填写有误，请检查！')
            return false
          }
        })
      },
      /** 获取权限菜单树 */
      GET_RolePermission() {
        API_Menus.getMenusChildren().then(res => {
          // 如果this.role_id 不为0，说明是编辑。
          if (this.role_id !== 0) {
            API_Auth.getRoleDetail(this.role_id).then(response => {
              this.role_id = response.role_id
              this.permissionForm.role_name = response.role_name
              this.permissionForm.role_describe = response.role_describe
              const checkedIds = this.expandRouters(response.menus)
              this.$set(this, 'permissions', this.filterRoleRouter(res, checkedIds))
              this.countAllPermissions()
            })
          } else {
            this.$set(this, 'permissions', res)
            this.countAllPermissions()
          }
        })
      },
      /** 展开路由的identifier */
      expandRouters(menus) {
        const routers = []
        menus.forEach(item => {
          item.checked && routers.push(item.identifier)
          if (item.children && item.children.length) {
            routers.push(...this.expandRouters(item.children))
          }
        })
        return routers
      },
      /** 递归筛选被选中的路由 */
      filterRoleRouter(routers, ids) {
        const _routers = []
        routers.forEach(item => {
          if (ids.includes(item.identifier) || item.hidden) {
            item.checked = true
          } else {
            item.checked = false
          }
          if (item.children) {
            this.$set(item, 'children', this.filterRoleRouter(item.children, ids))
          }
          _routers.push(item)
        })
        return _routers
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .permission-container {
    padding: 10px;
    background-color: #fff;
  }
  .level_1 {
    padding: 15px 0;
    border-bottom: 1px dashed #e7e7e7;
    &:last-child{ border-bottom: none }
  }
  /deep/ {
    .el-form-item__label {
      padding-top: 15px;
    }
    .el-form-item__content {
      border-left: 1px solid #e7e7e7;
      padding-left: 20px;
      padding-top: 15px;
      .el-form-item__error {
        padding-left: 20px;
      }
    }
    .el-form-item:last-child {
      .el-form-item__content {
        padding-top: 0;
      }
    }
    .el-form-item:not(:first-child) {
      border-top: 1px solid #e7e7e7;
      position: relative;
      &::after {
        content: ' ';
        width: 1px;
        height: 22px;
        background-color: #e7e7e7;
        position: absolute;
        top: -22px;
        left: 200px;
      }
    }
    .el-button-group {
      display: inline-block;
      .el-button {
        display: inline-block;
        padding: 0;
        border: none;
        &:focus, &:hover {
          color: #606266;
          border-color: #fff;
          background-color: #fff;
        }
      }
    }
  }
  .checkbox-dropdown {
    display: inline-block;
    min-width: 130px;
    cursor: pointer;
    .checked {
      color: #409EFF
    }
  }
</style>
