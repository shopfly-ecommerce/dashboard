<template>
  <div>
    <en-grade-editor
      ref="gradeEditor"
      type-text="Integral classification"
      :api="gradeApi"
      :btns="itemBtns"
      :maxLevel="1"
      :paramsNames="{id: 'category_id', text: 'name'}"
      @add-click="handleAddPoints"
    />
    <el-dialog
      :title="pointsForm.id ? 'Edit integral classification' : 'Add integral classification'"
      :visible.sync="dialogPointsVisible"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="pointsForm" :rules="pointsRules" ref="pointsForm" label-width="120px">
        <el-form-item label="name" prop="name">
          <el-input v-model="pointsForm.name" :maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="sort" prop="category_order">
          <el-input-number v-model="pointsForm.category_order" controls-position="right" :min="0" :max="99999999"/>
        </el-form-item>
        <el-form-item label="Image" prop="image">
          <el-upload
            :action="MixinUploadApi"
            :on-remove="delGiftImg"
            :on-success="handleUploadSuccess"
            :limit="1"
            :file-list="categroy_image"
            list-type="picture">
            <el-button size="small" type="primary">upload</el-button>
            <div slot="tip" class="el-upload__tip">Recommended to uploadjpg/pngFile, and not exceeding1MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPointsVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitPointsForm">save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { GradeEditor } from '@/components'
  import * as API_Promotion from '@/api/pointClassify'

  export default {
    name: 'pointsClassify',
    components: {
      [GradeEditor.name]: GradeEditor
    },
    data() {
      return {
        loading: false,
        // The hierarchy editor gets the lower-level API
        gradeApi: 'seller/promotion/exchange-cats/@id/children',
        // Integral classification form
        pointsForm: {},
        // Integral classification picture
        categroy_image: [],
        // Rules for classifying forms of credits
        pointsRules: {
          name: [this.MixinRequired('Please enter the classification name！')],
          image: [this.MixinRequired('Please upload classified pictures！')]
        },
        itemBtns: [
          { text: 'edit', onClick: this.handleEditPointsClassify },
          { text: 'delete', onClick: this.handleDeletePointsClassify, color: 'red' }
        ],
        // Integral classification dialog
        dialogPointsVisible: false
      }
    },
    methods: {
      // Picture uploaded successfully
      handleUploadSuccess(res) {
        this.$set(this.pointsForm, 'image', res.url)
        this.$refs['pointsForm'].validateField('image')
      },
      /** Once the image is removed*/
      delGiftImg() {
        this.categroy_image = []
        this.pointsForm.image = ''
      },
      /** Add integral classification*/
      handleAddPoints(level, parent, parentArray) {
        this.pointsForm = {
          parent_id: parent ? parent.id : 0
        }
        this.categroy_image = []
        this.dialogPointsVisible = true
      },
      /** Edit integral classification*/
      handleEditPointsClassify(cat) {
        this.pointsForm = this.MixinClone(cat)
        this.categroy_image = this.pointsForm.image ? [{ name: 'image', url: this.pointsForm.image }] : []
        this.dialogPointsVisible = true
      },
      /** Delete integral classification*/
      handleDeletePointsClassify(cat) {
        this.$confirm('Are you sure you want to delete this integral category？', 'prompt', { type: 'warning' }).then(() => {
          API_Promotion.deleteExchangeCat(cat.category_id).then(() => {
            this.$message.success('Delete the success！')
            this.$refs['gradeEditor'].refresh('delete')
          })
        }).catch(() => {})
      },
      /** Credits classification form submission*/
      submitPointsForm() {
        this.$refs['pointsForm'].validate((valid) => {
          if (valid) {
            const { category_id: id } = this.pointsForm
            if (id) {
              API_Promotion.editExhcangeCat(id, this.pointsForm).then(response => {
                this.dialogPointsVisible = false
                this.$message.success('Modify the success！')
                this.$refs['gradeEditor'].refresh('add', response)
              })
            } else {
              API_Promotion.addExchangeCat(this.pointsForm).then(response => {
                this.dialogPointsVisible = false
                this.$message.success('Add a success！')
                this.$refs['gradeEditor'].refresh('add')
              })
            }
          } else {
            this.$message.error('There is an error in the form. Please check it！')
            return false
          }
        })
      }
    }
  }
</script>
