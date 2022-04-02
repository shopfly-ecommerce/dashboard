<template>
  <div>
    <en-grade-editor
      ref="gradeEditor"
      type-text="积分分类"
      :api="gradeApi"
      :btns="itemBtns"
      :maxLevel="1"
      :paramsNames="{id: 'category_id', text: 'name'}"
      @add-click="handleAddPoints"
    />
    <el-dialog
      :title="pointsForm.id ? '编辑积分分类' : '添加积分分类'"
      :visible.sync="dialogPointsVisible"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="pointsForm" :rules="pointsRules" ref="pointsForm" label-width="120px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="pointsForm.name" :maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="分类排序" prop="category_order">
          <el-input-number v-model="pointsForm.category_order" controls-position="right" :min="0" :max="99999999"/>
        </el-form-item>
        <el-form-item label="分类图片" prop="image">
          <el-upload
            :action="MixinUploadApi"
            :on-remove="delGiftImg"
            :on-success="handleUploadSuccess"
            :limit="1"
            :file-list="categroy_image"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">建议上传jpg/png文件，且不超过1MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPointsVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPointsForm">确 定</el-button>
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
        // 层级编辑器获取下级的API
        gradeApi: 'seller/promotion/exchange-cats/@id/children',
        // 积分分类 表单
        pointsForm: {},
        // 积分分类 图片
        categroy_image: [],
        // 积分分类 表单规则
        pointsRules: {
          name: [this.MixinRequired('请输入分类名称！')],
          image: [this.MixinRequired('请上传分类图片！')]
        },
        itemBtns: [
          { text: '编辑', onClick: this.handleEditPointsClassify },
          { text: '删除', onClick: this.handleDeletePointsClassify, color: 'red' }
        ],
        // 积分分类 dialog
        dialogPointsVisible: false
      }
    },
    methods: {
      // 图片上传成功
      handleUploadSuccess(res) {
        this.$set(this.pointsForm, 'image', res.url)
        this.$refs['pointsForm'].validateField('image')
      },
      /** 图片移除之后 */
      delGiftImg() {
        this.categroy_image = []
        this.pointsForm.image = ''
      },
      /** 添加积分分类 */
      handleAddPoints(level, parent, parentArray) {
        this.pointsForm = {
          parent_id: parent ? parent.id : 0
        }
        this.categroy_image = []
        this.dialogPointsVisible = true
      },
      /** 编辑积分分类 */
      handleEditPointsClassify(cat) {
        this.pointsForm = this.MixinClone(cat)
        this.categroy_image = this.pointsForm.image ? [{ name: 'image', url: this.pointsForm.image }] : []
        this.dialogPointsVisible = true
      },
      /** 删除积分分类 */
      handleDeletePointsClassify(cat) {
        this.$confirm('确定要删除这个积分分类吗？', '提示', { type: 'warning' }).then(() => {
          API_Promotion.deleteExchangeCat(cat.category_id).then(() => {
            this.$message.success('删除成功！')
            this.$refs['gradeEditor'].refresh('delete')
          })
        }).catch(() => {})
      },
      /** 积分分类表单提交 */
      submitPointsForm() {
        this.$refs['pointsForm'].validate((valid) => {
          if (valid) {
            const { category_id: id } = this.pointsForm
            if (id) {
              API_Promotion.editExhcangeCat(id, this.pointsForm).then(response => {
                this.dialogPointsVisible = false
                this.$message.success('修改成功！')
                this.$refs['gradeEditor'].refresh('add', response)
              })
            } else {
              API_Promotion.addExchangeCat(this.pointsForm).then(response => {
                this.dialogPointsVisible = false
                this.$message.success('添加成功！')
                this.$refs['gradeEditor'].refresh('add')
              })
            }
          } else {
            this.$message.error('表单填写有误，请核对！')
            return false
          }
        })
      }
    }
  }
</script>
