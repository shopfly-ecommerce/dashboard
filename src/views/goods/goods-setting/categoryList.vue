<template>
  <div>
    <en-grade-editor
      ref="gradeEditor"
      type-text="分类"
      :api="categoryApi"
      :params-names="{id: 'category_id', text: 'name'}"
      :btns="itemBtns"
      :maxLevel="3"
      @add-click="handleAddCat"
    />
    <!--添加、编辑分类dialog-->
    <el-dialog
      :title="catForm.category_id ? '编辑分类' : '添加分类'"
      width="500px"
      :visible.sync="dialogCatVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="catForm" :rules="catRules" ref="catForm" label-width="100px">
        <!--分类名称-->
        <el-form-item label="分类名称" prop="category_name">
          <el-input v-model="catForm.category_name"></el-input>
        </el-form-item>
        <!--分类图片-->
        <el-form-item label="分类图片" prop="cat_img">
          <el-upload
            :action="MixinUploadApi"
            list-type="picture"
            :on-success="uploadSuccess"
            :on-remove="delGiftImg"
            :file-list="fileList"
            :multiple="false"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <span slot="tip" class="el-upload__tip">&nbsp;建议上传jpg/png文件，且不超过1MB</span>
          </el-upload>
        </el-form-item>
        <!--上级分类-->
        <el-form-item v-if="catForm.parent_datas" label="上级分类" prop="parent_id">
          <el-select v-model="catForm.parent_id" placeholder="请选择上级分类">
            <el-option v-for="item in catForm.parent_datas" :label="item.name" :value="item.category_id" :key="item.category_id"/>
          </el-select>
        </el-form-item>
        <!--排序-->
        <el-form-item label="排序" prop="category_order">
          <el-input-number v-model="catForm.category_order" controls-position="right" :min="0" :max="99999"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCatVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCatForm('catForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑关联品牌dialog-->
    <el-dialog
      title="关联品牌"
      width="500px"
      :visible.sync="dialogBrandVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="brandForm" :rules="brandRules" ref="brandForm">
        <el-form-item label="选择品牌">
          <el-select v-model="brandForm.selectedBrandList" placeholder="请选择关联品牌" multiple filterable style="width: 350px">
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
        <el-button @click="dialogBrandVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBrandForm('brandForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑关联规格dialog-->
    <el-dialog
      title="关联规格"
      width="500px"
      :visible.sync="dialogSpecsVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="specsForm" :rules="specsRules" ref="specsForm">
        <el-form-item label="选择规格">
          <el-select v-model="specsForm.selectedSpecsList" placeholder="请选择关联规格" multiple filterable style="width: 350px">
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
        <el-button @click="dialogSpecsVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSpecsForm('specsForm')">确 定</el-button>
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
          { text: '参数', onClick: this.handleEditParams },
          { text: '品牌', onClick: this.handleEditBrand },
          { text: '规格', onClick: this.handleEditSpecs },
          { text: '编辑', onClick: this.handleEditCat },
          { text: '删除', onClick: this.handleDeleteCat, color: 'red' }
        ],
        // 添加、编辑分类 dialog
        dialogCatVisible: false,
        // 编辑关联品牌 dialog
        dialogBrandVisible: false,
        // 编辑关联规格 dialog
        dialogSpecsVisible: false,
        // 添加、编辑分类 表单
        catForm: {},
        // 添加、编辑分类 表单规则
        catRules: {
          category_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
          ]
        },
        // 编辑关联品牌 表单
        brandForm: {
          brandTitle: '关联品牌',
          category_id: null,
          selectedBrandList: [],
          brandList: []
        },
        // 编辑关联品牌 表单规则
        brandRules: {},
        // 编辑关联规格 表单
        specsForm: {
          category_id: null,
          selectedSpecsList: [],
          specsList: []
        },
        // 编辑关联规格 表单规则
        specsRules: {},
        /** 存储上传的图片*/
        fileList: [],
        // API
        categoryApi: 'seller/goods/categories/@id/children'
      }
    },
    methods: {
      uploadSuccess(res) {
        this.$set(this.catForm, 'category_image', res.url)
      },
      /** 图片移除之后 */
      delGiftImg() {
        this.fileList = []
        this.catForm.category_image = ''
      },
      /** 添加分类 */
      handleAddCat(level, parent, parentArray) {
        this.catForm = {
          parent_id: parent ? parent.category_id : 0,
          parent_datas: parentArray,
          category_order: 0
        }
        this.fileList = []
        this.dialogCatVisible = true
      },

      /** 编辑分类 */
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

      /** 添加、编辑分类 表单提交 */
      submitCatForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const { category_id } = this.catForm
            if (!category_id) {
              API_Category.addCategory(this.catForm).then(() => {
                this.dialogCatVisible = false
                this.$message.success('保存成功！')
                this.$refs[formName].resetFields()
                this.$refs['gradeEditor'].refresh('add')
              })
            } else {
              API_Category.editCategory(category_id, this.catForm).then(response => {
                this.$message.success('保存成功！')
                this.dialogCatVisible = false
                this.$refs[formName].resetFields()
                this.$refs['gradeEditor'].refresh('add')
              })
            }
          } else {
            this.$message.error('表单填写有误，请检查！')
            return false
          }
        })
      },

      /** 编辑分类参数 */
      handleEditParams(cat) {
        this.$router.push({ name: 'categoryParams', params: { id: cat.category_id }})
      },
      /** 编辑关联品牌 */
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

      /** 编辑关联品牌 表单提交 */
      submitBrandForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            API_Category.editCategoryBrand(this.brandForm.category_id, this.brandForm.selectedBrandList)
              .then(response => {
                this.dialogBrandVisible = false
                this.$message.success('保存成功！')
              })
          } else {
            this.$message.error('表单填写有误，请检查！')
            return false
          }
        })
      },

      /** 编辑关联规格 */
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
      /** 编辑关联规格 表单提交 */
      submitSpecsForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            API_Category.editCategorySpecs(this.specsForm.category_id, this.specsForm.selectedSpecsList)
              .then(response => {
                this.dialogSpecsVisible = false
                this.$message.success('保存成功！')
              })
          } else {
            this.$message.error('表单填写有误，请检查！')
            return false
          }
        })
      },

      /** 删除分类确认 */
      handleDeleteCat(cat) {
        this.$confirm('确定要删除这个分类吗？', '提示', { type: 'warning' }).then(() => {
          API_Category.deleteCategory(cat.category_id).then(() => {
            this.$message.success('删除成功！')
            this.$refs['gradeEditor'].refresh('delete')
          })
        }).catch(() => {})
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>

</style>
