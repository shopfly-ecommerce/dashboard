<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    width="420px">
    <div slot="title" class="text-picker-title">楼层标题编辑</div>
    <div class="text-picker-body">
      <div class="text-picker-content">
        <el-form :model="textForm" :rules="textRules" ref="textForm" label-width="110px" style="width: 350px">
          <el-form-item label="标题文字" prop="text">
            <el-input
              :minlength="2"
              :maxlength="4"
              placeholder="请输入标题文字，长度2-4"
              v-model="textForm.text">
            </el-input>
          </el-form-item>
          <el-form-item label="标题栏背景色" prop="start_color">
            <el-input placeholder="请选择或输入标题栏背景色" v-model="textForm.start_color">
              <el-color-picker slot="append" v-model="textForm.start_color" size="mini"></el-color-picker>
            </el-input>
          </el-form-item>
          <el-form-item label="背景过渡色" prop="end_color">
            <el-input placeholder="请选择或输入背景过渡色" v-model="textForm.end_color">
              <el-color-picker slot="append" v-model="textForm.end_color" size="mini"></el-color-picker>
            </el-input>
          </el-form-item>
          <el-form-item label="过渡色预览">
            <div class="color-preview" :style="colorPreviewStyle"></div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div slot="footer" class="text-picker-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { TextPicker } from '~/ui-components'

  export default {
    name: 'EnFloorTitlePicker',
    extends: TextPicker,
    data() {
      const vaildColor = (rule, value, callback) => {
        if (/^#[0-9a-fA-F]{3,6}$/.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的十六进制颜色！'))
        }
      }
      return {
        textRules: {
          text: [{ required: true, message: '请输入楼层标题文字！', trigger: 'blur' }],
          start_color: [
            { required: true, message: '请选择或输入标题栏背景色！', trigger: 'blur' },
            { validator: vaildColor }
          ],
          end_color: [
            { required: true, message: '请选择或输入背景过渡色！', trigger: 'blur' },
            { validator: vaildColor }
          ]
        }
      }
    },
    computed: {
      /** 计算预览样式 */
      colorPreviewStyle() {
        const { start_color, end_color } = this.textForm
        return {
          'background-color': start_color,
          backgroundImage: `linear-gradient(90deg, ${start_color}, ${end_color})`
        }
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ .el-input-group__append {
    padding: 0;
    .el-color-picker {
      display: table-cell;
      padding: 0;
      border: none;
    }
    .el-color-picker__trigger {
      display: inline-table;
    }
  }
  .color-preview {
    width: 100%;
    height: 32px;
  }
</style>
