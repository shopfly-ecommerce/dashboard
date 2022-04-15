<template>
  <div>
    <en-grade-editor
      ref="gradeEditor"
      type-text="Categories"
      :api="categoryApi"
      :params-names="{id: 'category_id', text: 'name'}"
      :btns="itemBtns"
      :maxLevel="3"
      @add-click="handleAddCat"
    />
    <!--add、Edit categorydialog-->
    <el-dialog
      :title="catForm.category_id ? 'Edit category' : 'Add the classification'"
      width="500px"
      :visible.sync="dialogCatVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="catForm" :rules="catRules" ref="catForm" label-width="100px">
        <!--name-->
        <el-form-item label="name" prop="category_name">
          <el-input v-model="catForm.category_name"></el-input>
        </el-form-item>
        <!--Image-->
        <el-form-item label="Image" prop="cat_img">
          <el-upload
            :action="MixinUploadApi"
            list-type="picture"
            :on-success="uploadSuccess"
            :on-remove="delGiftImg"
            :file-list="fileList"
            :multiple="false"
            :limit="1"
          >
            <el-button size="small" type="primary">upload</el-button>
            <span slot="tip" class="el-upload__tip">&nbsp;Recommended to uploadjpg/pngFile, and not exceeding1MB</span>
          </el-upload>
        </el-form-item>
        <!--Parent-->
        <el-form-item v-if="catForm.parent_datas" label="Parent" prop="parent_id">
          <el-select v-model="catForm.parent_id" placeholder="Please select the superior category">
            <el-option v-for="item in catForm.parent_datas" :label="item.name" :value="item.category_id" :key="item.category_id"/>
          </el-select>
        </el-form-item>
        <!--sort-->
        <el-form-item label="sort" prop="category_order">
          <el-input-number v-model="catForm.category_order" controls-position="right" :min="0" :max="99999"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCatVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitCatForm('catForm')">save</el-button>
      </span>
    </el-dialog>
    <!--Edit associated brandsdialog-->
    <el-dialog
      title="Associated with the brand"
      width="500px"
      :visible.sync="dialogBrandVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="brandForm" :rules="brandRules" ref="brandForm">
        <el-form-item label="Choose the brand">
          <el-select v-model="brandForm.selectedBrandList" placeholder="Please select associated brand" multiple filterable style="width: 350px">
            <el-option
              v-for="item in brandForm.brandList"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogBrandVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitBrandForm('brandForm')">save</el-button>
      </span>
    </el-dialog>
    <!--Edit associated specificationsdialog-->
    <el-dialog
      title="Associated specifications"
      width="500px"
      :visible.sync="dialogSpecsVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="specsForm" :rules="specsRules" ref="specsForm">
        <el-form-item label="Choose specifications">
          <el-select v-model="specsForm.selectedSpecsList" placeholder="Please select the associated specification" multiple filterable style="width: 350px">
            <el-option
              v-for="item in specsForm.specsList"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSpecsVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitSpecsForm('specsForm')">save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_Category from '@/api/goodsSetting'
  import { GradeEditor } from '@/components'

  export default {
    name: 'categoryList',
    components: {
      [GradeEditor.name]: GradeEditor
    },
    data() {
      return {
        itemBtns: [
          { text: 'parameter', onClick: this.handleEditParams },
          { text: 'brand', onClick: this.handleEditBrand },
          { text: 'specifications', onClick: this.handleEditSpecs },
          { text: 'edit', onClick: this.handleEditCat },
          { text: 'delete', onClick: this.handleDeleteCat, color: 'red' }
        ],
        // Add and edit category Dialogs
        dialogCatVisible: false,
        // Edit associated brand Dialog
        dialogBrandVisible: false,
        // Edit the associated specification Dialog
        dialogSpecsVisible: false,
        // Add and edit the category form
        catForm: {},
        // Add and edit classification form rules
        catRules: {
          category_name: [
            { required: true, message: 'Please enter the classification name', trigger: 'blur' },
            { min: 1, max: 15, message: 'The length of1 to15 A character', trigger: 'blur' }
          ]
        },
        // Edit the associated brand form
        brandForm: {
          brandTitle: 'Associated with the brand',
          category_id: null,
          selectedBrandList: [],
          brandList: []
        },
        // Edit the associated brand form rules
        brandRules: {},
        // Edit the associated specification form
        specsForm: {
          category_id: null,
          selectedSpecsList: [],
          specsList: []
        },
        // Edit the associated specification form rules
        specsRules: {},
        /** Stores uploaded images*/
        fileList: [],
        // API
        categoryApi: 'seller/goods/categories/@id/children'
      }
    },
    methods: {
      uploadSuccess(res) {
        this.$set(this.catForm, 'category_image', res.url)
      },
      /** Once the image is removed*/
      delGiftImg() {
        this.fileList = []
        this.catForm.category_image = ''
      },
      /** Add the classification*/
      handleAddCat(level, parent, parentArray) {
        this.catForm = {
          parent_id: parent ? parent.category_id : 0,
          parent_datas: parentArray,
          category_order: 0
        }
        this.fileList = []
        this.dialogCatVisible = true
      },

      /** Edit category*/
      handleEditCat(cat, parent, parentArray) {
        this.catForm = {
          parent_id: parent ? parent.category_id : 0,
          parent_datas: parentArray,
          ...cat,
          category_name: cat.name,
          category_image: cat.image
        }
        this.fileList = this.catForm.category_image ? [{ name: 'category_image', url: this.catForm.category_image }] : []
        this.dialogCatVisible = true
      },

      /** add、Edit the category form submission*/
      submitCatForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const { category_id } = this.catForm
            if (!category_id) {
              API_Category.addCategory(this.catForm).then(() => {
                this.dialogCatVisible = false
                this.$message.success('Save success！')
                this.$refs[formName].resetFields()
                this.$refs['gradeEditor'].refresh('add')
              })
            } else {
              API_Category.editCategory(category_id, this.catForm).then(response => {
                this.$message.success('Save success！')
                this.dialogCatVisible = false
                this.$refs[formName].resetFields()
                this.$refs['gradeEditor'].refresh('add')
              })
            }
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },

      /** Edit classification parameters*/
      handleEditParams(cat) {
        this.$router.push({ name: 'categoryParams', params: { id: cat.category_id }})
      },
      /** Edit associated brands*/
      handleEditBrand(cat) {
        API_Category.getBrandByCategoryId(cat.category_id).then(response => {
          this.brandForm = {
            ...this.brandForm,
            category_id: cat.category_id,
            brandList: response,
            selectedBrandList: response.filter(item => item.selected).map(item => item.id)
          }
          this.dialogBrandVisible = true
        })
      },

      /** Edit the associated brand form submission*/
      submitBrandForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            API_Category.editCategoryBrand(this.brandForm.category_id, this.brandForm.selectedBrandList)
              .then(response => {
                this.dialogBrandVisible = false
                this.$message.success('Save success！')
              })
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },

      /** Edit associated specifications*/
      handleEditSpecs(cat) {
        API_Category.getSpecsByCategoryId(cat.category_id).then(response => {
          this.specsForm = {
            ...this.specsForm,
            category_id: cat.category_id,
            specsList: response,
            selectedSpecsList: response.filter(item => item.selected).map(item => item.id)
          }
          this.dialogSpecsVisible = true
        })
      },
      /** Edit the associated specification form submission*/
      submitSpecsForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            API_Category.editCategorySpecs(this.specsForm.category_id, this.specsForm.selectedSpecsList)
              .then(response => {
                this.dialogSpecsVisible = false
                this.$message.success('Save success！')
              })
          } else {
            this.$message.error('The form is filled incorrectly, please check！')
            return false
          }
        })
      },

      /** Delete classification confirmation*/
      handleDeleteCat(cat) {
        this.$confirm('Are you sure you want to delete this category？', 'prompt', { type: 'warning' }).then(() => {
          API_Category.deleteCategory(cat.category_id).then(() => {
            this.$message.success('Delete the success！')
            this.$refs['gradeEditor'].refresh('delete')
          })
        }).catch(() => {})
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>

</style>
