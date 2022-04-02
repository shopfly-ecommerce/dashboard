<template>
  <div>
    <en-grade-editor
      ref="regionEditor"
      type-text="地区"
      :api="MixinRegionApi"
      :btns="btns"
      :maxLevel="4"
      :params-names="{id: 'id', text: 'local_name'}"
      @add-click="handleAdd"
    />
    <el-dialog
      :title="regionForm.id ? '编辑地区' : '添加地区'"
      width="500px"
      :visible.sync="dialogRegionVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="regionForm" :rules="regionRules" ref="regionForm" label-width="130px">
        <el-form-item label="地区名称" prop="local_name">
          <el-input v-model="regionForm.local_name"></el-input>
        </el-form-item>
        <el-form-item label="邮政编号">
          <el-input v-model="regionForm.zipcode" :maxlength="6"></el-input>
        </el-form-item>
        <el-form-item label="是否支持货到付款" prop="cod">
          <el-radio-group v-model="regionForm.cod">
            <el-radio :label="1">支持</el-radio>
            <el-radio :label="0">不支持</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRegionVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRegionForm('regionForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import * as API_Region from '@/api/region'
  import { GradeEditor } from '@/components'

  Vue.use(GradeEditor)

  export default {
    name: 'regionalManagement',
    data() {
      return {
        btns: [
          { text: '编辑', onClick: this.handleEdit },
          { text: '删除', onClick: this.handleDelete, color: 'red' }
        ],
        /** 地区 表单 */
        regionForm: {},
        /** 地区 表单规则 */
        regionRules: {
          local_name: [this.MixinRequired('请输入地区名称！')]
        },
        /** 地区表单 dialog */
        dialogRegionVisible: false
      }
    },
    methods: {
      /** 编辑地区 */
      handleEdit(region) {
        this.regionForm = this.MixinClone(region)
        this.dialogRegionVisible = true
      },
      /** 删除地区 */
      handleDelete(region) {
        this.$confirm('确认要删除这个地区吗？').then(() => {
          API_Region.deleteRegion(region.id).then(() => {
            this.$message.success('删除成功！')
            this.$refs['regionEditor'].refresh('delete')
          })
        }).catch(() => {})
      },
      /** 添加地区 */
      handleAdd(level, parent, parentArray) {
        this.regionForm = {
          parent_id: parent ? parent.id : 0,
          cod: 1
        }
        this.dialogRegionVisible = true
      },
      /** 提交地区表单 */
      submitRegionForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const { id } = this.regionForm
            if (!id) {
              API_Region.addRegion(this.regionForm).then(response => {
                this.dialogRegionVisible = false
                this.$message.success('添加成功！')
                this.$refs['regionEditor'].refresh('add')
              })
            } else {
              API_Region.editRegion(id, this.regionForm).then(response => {
                this.dialogRegionVisible = false
                this.$message.success('保存成功！')
                this.$refs['regionEditor'].refresh('edit', {
                  ...this.regionForm,
                  id: this.regionForm.id,
                  text: this.regionForm.local_name
                })
              })
            }
          } else {
            this.$message.error('表单填写有误，请检查！')
            return false
          }
        })
      }
    }
  }
</script>
