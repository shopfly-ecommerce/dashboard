<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    width="520px">
    <div slot="title" class="text-picker-title">Floor title editor</div>
    <div class="text-picker-body">
      <div class="text-picker-content">
        <el-form :model="textForm" :rules="textRules" ref="textForm" label-width="200px" style="width: 350px">
          <el-form-item label="text" prop="text">
            <el-input
              :minlength="2"
              :maxlength="16"
              placeholder="The text"
              v-model="textForm.text">
            </el-input>
          </el-form-item>
          <el-form-item label="bar background" prop="start_color">
            <el-input placeholder="Select or enter the title bar background color" v-model="textForm.start_color">
              <el-color-picker slot="append" v-model="textForm.start_color" size="mini"></el-color-picker>
            </el-input>
          </el-form-item>
          <el-form-item label="transition color" prop="end_color">
            <el-input placeholder="Please select or enter the background transition color" v-model="textForm.end_color">
              <el-color-picker slot="append" v-model="textForm.end_color" size="mini"></el-color-picker>
            </el-input>
          </el-form-item>
          <el-form-item label="Transition color preview">
            <div class="color-preview" :style="colorPreviewStyle"></div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div slot="footer" class="text-picker-footer">
      <el-button @click="visible = false">cancel</el-button>
      <el-button type="primary" @click="handleConfirm">save</el-button>
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
          callback(new Error('Please enter the correct hexadecimal color！'))
        }
      }
      return {
        textRules: {
          text: [{ required: true, message: 'Please enter the floor title text！', trigger: 'blur' }],
          start_color: [
            { required: true, message: 'Select or enter the title bar background color！', trigger: 'blur' },
            { validator: vaildColor }
          ],
          end_color: [
            { required: true, message: 'Please select or enter the background transition color！', trigger: 'blur' },
            { validator: vaildColor }
          ]
        }
      }
    },
    computed: {
      /** Calculate preview styles*/
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
