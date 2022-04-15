<template>
  <div>
    <en-grade-editor
      ref="regionEditor"
      type-text="region"
      :api="MixinRegionApi"
      :btns="btns"
      :maxLevel="4"
      :params-names="{id: 'id', text: 'local_name'}"
      @add-click="handleAdd"
    />
    <el-dialog
      :title="regionForm.id ? 'Edit area' : 'Add region'"
      width="500px"
      :visible.sync="dialogRegionVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="regionForm" :rules="regionRules" ref="regionForm" label-width="130px">
        <el-form-item label="In the name of the" prop="local_name">
          <el-input v-model="regionForm.local_name"></el-input>
        </el-form-item>
        <el-form-item label="The postal code">
          <el-input v-model="regionForm.zipcode" :maxlength="6"></el-input>
        </el-form-item>
        <el-form-item label="Do you support CASH on delivery" prop="cod">
          <el-radio-group v-model="regionForm.cod">
            <el-radio :label="1">support</el-radio>
            <el-radio :label="0">Does not support</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRegionVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitRegionForm('regionForm')">save</el-button>
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
          { text: 'edit', onClick: this.handleEdit },
          { text: 'delete', onClick: this.handleDelete, color: 'red' }
        ],
        /** In the form*/
        regionForm: {},
        /** Local form rules*/
        regionRules: {
          local_name: [this.MixinRequired('Please enter a locale name！')]
        },
        /** In the formdialog */
        dialogRegionVisible: false
      }
    },
    methods: {
      /** Edit area*/
      handleEdit(region) {
        this.regionForm = this.MixinClone(region)
        this.dialogRegionVisible = true
      },
      /** Delete the region*/
      handleDelete(region) {
        this.$confirm('Are you sure you want to delete this area？').then(() => {
          API_Region.deleteRegion(region.id).then(() => {
            this.$message.success('Delete the success！')
            this.$refs['regionEditor'].refresh('delete')
          })
        }).catch(() => {})
      },
      /** Add region*/
      handleAdd(level, parent, parentArray) {
        this.regionForm = {
          parent_id: parent ? parent.id : 0,
          cod: 1
        }
        this.dialogRegionVisible = true
      },
      /** Submit the locale form*/
      submitRegionForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const { id } = this.regionForm
            if (!id) {
              API_Region.addRegion(this.regionForm).then(response => {
                this.dialogRegionVisible = false
                this.$message.success('Add a success！')
                this.$refs['regionEditor'].refresh('add')
              })
            } else {
              API_Region.editRegion(id, this.regionForm).then(response => {
                this.dialogRegionVisible = false
                this.$message.success('Save success！')
                this.$refs['regionEditor'].refresh('edit', {
                  ...this.regionForm,
                  id: this.regionForm.id,
                  text: this.regionForm.local_name
                })
              })
            }
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      }
    }
  }
</script>
