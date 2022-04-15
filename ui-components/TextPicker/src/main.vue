<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    width="500px">
    <div slot="title" class="text-picker-title">Text selector</div>
    <div class="text-picker-body">
      <div class="text-picker-content">
        <el-form :model="textForm" :rules="textRules" ref="textForm" label-width="100px" style="width: 425px">
          <el-form-item label="The text content" prop="text">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              :minlength="minlength"
              :maxlength="maxlength"
              :placeholder="'Please enter the text content, length' + minlength + '-' + maxlength + ''"
              v-model="textForm.text">
            </el-input>
          </el-form-item>
          <el-form-item label="Operation" prop="opt_value">
            <el-select v-model="textForm.opt_type" placeholder="Please select" style="width: 120px">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input placeholder="Please enter content" v-model="textForm.opt_value" style="width: 200px"/>
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
  export default {
    name: 'EnTextPicker',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      // The default data
      defaultData: {
        type: Object,
        default: () => ({})
      },
      // Operating parameters
      options: {
        type: Array,
        default: () => [
          { text: 'No operation', value: 'NONE' },
          { text: 'The link address', value: 'URL' },
          { text: 'keyword', value: 'KEYWORD' },
          { text: 'Product serial number', value: 'GOODS' },
          // {text: SHOP id , value: SHOP},
          { text: 'Category', value: 'CATEGORY' }
        ]
      },
      // Minimum text length
      minlength: {
        type: Number,
        default: 1
      },
      // Text Max
      maxlength: {
        type: Number,
        default: 100
      }
    },
    data() {
      return {
        visible: this.show,
        textForm: {},
        textRules: {
          text: [
            { required: true, message: 'Please enter the text content！', trigger: 'blur' }
          ],
          opt_value: [
            { required: false, message: 'Please enter the operation value！', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      show(newVal) {
        this.visible = newVal
      },
      visible(newVal) {
        newVal === false && this.$emit('close')
      },
      'textForm.opt_type': function(newVal) {
        this.$set(this.textRules.opt_value[0], 'required', (newVal !== 'NONE' && newVal !== undefined))
      },
      defaultData(newVal) {
        if (!newVal) return
        this.textForm = JSON.parse(JSON.stringify(newVal))
      }
    },
    methods: {
      handleConfirm() {
        this.$refs['textForm'].validate((valid) => {
          if (valid) {
            this.$emit('confirm', this.textForm)
            this.$emit('close')
          } else {
            this.$message.error('There is an error in the form. Please check it！')
            return false
          }
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  $border-style: 1px solid #ccc;
  $body-height: 155px;
  .text-picker-title {
    text-align: center;
    padding-bottom: 20px;
    border-bottom: $border-style;
  }
  .text-picker-body {
    display: flex;
    position: relative;
    flex-direction: column;
    margin-bottom: 10px;
    min-height: $body-height;
    font-size: 12px;
    line-height: normal;
  }
  /deep/ {
    .el-dialog__body {
      padding: 0 20px;
    }
  }
  .text-picker-footer {
    padding-top: 15px;
    border-top: $border-style;
  }
  .text-picker-content {
    display: flex;
    justify-content: space-between;
    position: relative;
    width: 100%;
    height: $body-height - 10px;
    margin-top: 10px;
  }
</style>
