<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    width="500px">
    <div slot="title" class="text-picker-title">文本选择器</div>
    <div class="text-picker-body">
      <div class="text-picker-content">
        <el-form :model="textForm" :rules="textRules" ref="textForm" label-width="100px" style="width: 425px">
          <el-form-item label="文本内容" prop="text">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              :minlength="minlength"
              :maxlength="maxlength"
              :placeholder="'请输入文本内容，长度' + minlength + '-' + maxlength + ''"
              v-model="textForm.text">
            </el-input>
          </el-form-item>
          <el-form-item label="操作" prop="opt_value">
            <el-select v-model="textForm.opt_type" placeholder="请选择" style="width: 120px">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input placeholder="请输入内容" v-model="textForm.opt_value" style="width: 200px"/>
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
  export default {
    name: 'EnTextPicker',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      // 默认数据
      defaultData: {
        type: Object,
        default: () => ({})
      },
      // 操作参数
      options: {
        type: Array,
        default: () => [
          { text: '无操作', value: 'NONE' },
          { text: '链接地址', value: 'URL' },
          { text: '关键字', value: 'KEYWORD' },
          { text: '商品序号', value: 'GOODS' },
          //{ text: '店铺编号', value: 'SHOP' },
          { text: '商品分类', value: 'CATEGORY' }
        ]
      },
      // 文本最小长度
      minlength: {
        type: Number,
        default: 1
      },
      // 文本最大程度
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
            { required: true, message: '请输入文本内容！', trigger: 'blur' }
          ],
          opt_value: [
            { required: false, message: '请输入操作值！', trigger: 'blur' }
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
            this.$message.error('表单填写有误，请核对！')
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
