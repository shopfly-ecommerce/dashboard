<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    width="600px">
    <div slot="title" class="tags-picker-title">楼层标签编辑</div>
    <div class="tags-picker-body">
      <div class="tags-picker-content">
        <div class="tags-list">
          <draggable v-model="tagList" :options="tagsOptions" style="display: inline">
            <el-tag
              v-for="(tag, index) in tagList"
              :key="index"
              closable
              :disable-transitions="false"
              :class="[editIndex === index && 'selected']"
              @close="handleClose(index)"
              @click.native="handleEditTag(index, tag)"
            >
              {{ tag.block_value }}
            </el-tag>
          </draggable>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            :maxlength="15"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
            placeholder="15个字以内"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="mini" @click="showInput">+ 添加标签</el-button>
        </div>
        <div class="tags-opt">
          <el-form :model="tagsForm" :rules="tagsRules" ref="tagsForm" label-width="80px">
            <el-form-item label="标签文本" prop="block_value">
              <el-input v-model="tagsForm.block_value" :maxlength="30" placeholder="30个字以内"></el-input>
            </el-form-item>
            <el-form-item label="操作" prop="block_opt.opt_value">
              <el-select v-model="tagsForm.block_opt.opt_type" placeholder="请选择" style="width: 175px">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input placeholder="请输入内容" v-model="tagsForm.block_opt.opt_value" style="width: 300px"/>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div slot="footer" class="tags-picker-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'EnFloorTagsPicker',
  components: { draggable },
  props: {
    // dialog显示
    show: {
      type: Boolean,
      default: false
    },
    // 最大个数
    maxLength: {
      type: Number,
      default: 10
    },
    // 默认数据
    defaultData: {
      type: Array,
      default: () => ([])
    },
    // 操作参数
    options: {
      type: Array,
      default: () => [
        { text: '无操作', value: 'NONE' },
        { text: '链接地址', value: 'URL' },
        { text: '关键字', value: 'KEYWORD' },
        { text: '商品序号', value: 'GOODS' },
        { text: '商品分类', value: 'CATEGORY' }
        // { text: '专题', value: 'TOPIC' }
      ]
    }
  },
  data() {
    return {
      visible: this.show,
      tagsOptions: {
        animation: 150
      },
      tagList: [],
      editIndex: '',
      inputVisible: false,
      inputValue: '',
      tagsForm: {
        block_type: 'TEXT',
        block_value: '',
        block_opt: {
          opt_type: 'NONE',
          opt_value: ''
        }
      },
      tagsRules: {
        block_value: [{ required: true, message: '请输入标签文本！' }],
        'block_opt.opt_value': [{ required: false, message: '请输入标签文本！' }]
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
    defaultData(newVal) {
      if (!newVal) return
      const tagList = JSON.parse(JSON.stringify(newVal))
      this.editIndex = 0
      this.inputValue = ''
      this.tagList = tagList
      if (tagList[0]) {
        this.tagsForm = tagList[0]
      } else {
        this.$nextTick(() => { this.$refs['tagsForm'].resetFields() })
      }
    },
    'tagsForm.block_opt.opt_type': function(newVal) {
      this.$set(this.tagsRules['block_opt.opt_value'][0], 'required', (newVal !== 'NONE' && newVal !== undefined))
    }
  },
  methods: {
    handleClose(index) {
      this.$confirm('确定要删除这个标签？', '提示', { type: 'warning' }).then(() => {
        this.tagList.splice(index, 1)
        if (!this.tagList.length) {
          this.$nextTick(() => {
            this.$set(this.tagsRules['block_opt.opt_value'][0], 'required', false)
            this.$refs['tagsForm'].resetFields()
          })
        }
      }).catch(() => {})
    },
    showInput() {
      this.validTagsForm().finally(() => {
        if (this.tagList.length >= this.maxLength) {
          this.$message.error('超过最大个数！')
          return
        }
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      })
    },
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.tagList.push({
          block_type: 'TEXT',
          block_value: inputValue,
          block_opt: {
            opt_type: 'KEYWORD',
            opt_value: inputValue
          }
        })
        const _index = this.tagList.length - 1
        this.tagsForm = JSON.parse(JSON.stringify(this.tagList[_index]))
        this.editIndex = _index
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    /** 编辑标签 */
    handleEditTag(index, tag) {
      this.validTagsForm().finally(() => {
        this.tagsForm = JSON.parse(JSON.stringify(tag))
        this.editIndex = index
      })
    },
    /** 确认 */
    handleConfirm() {
      this.validTagsForm().then(() => {
        this.$emit('confirm', this.tagList)
        this.$emit('close')
      }).catch(() => {
        this.$message.error('表单填写有误，请核对！')
      })
    },
    /** 校验表单 */
    validTagsForm() {
      return new Promise((resolve, reject) => {
        if (this.editIndex === '' || !this.tagList.length) {
          resolve()
          return
        }
        this.$refs['tagsForm'].validate((valid) => {
          if (valid) {
            this.tagList[this.editIndex] = this.tagsForm
            resolve()
          } else {
            reject()
          }
        })
      })
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
$border-style: 1px solid #ccc;
$body-height: 155px;
.tags-picker-title {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: $border-style;
}
.tags-picker-body {
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
.tags-picker-footer {
  padding-top: 15px;
  border-top: $border-style;
}
.tags-picker-content {
  position: relative;
  width: 100%;
  min-height: $body-height - 10px;
  margin-top: 10px;
}
.tags-list {
  margin-bottom: 20px;
  border: 1px dashed #ccc;
  padding: 10px;
}
.tags-opt {
  border-top: 1px solid #ccc;
  padding-top: 10px;
}
/deep/ .el-tag {
  display: inline-block;
  position: relative;
  height: 26px;
  max-width: 100px;
  margin-bottom: 10px;
  margin-left: 10px;
  overflow-wrap: break-word;
  padding: 0 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
  border: 1px dashed #ccc;
  background: rgba(255, 255, 255, 0.2);
  line-height: 24px;
  color: #666;
  border-radius: 0;
  cursor: pointer;
  &.selected {
    border: 1px solid #666;
    color: #333;
    .el-tag__close { color: #333 }
  }
  .el-tag__close {
    color: #666;
    &:hover {
      background-color: #F56C6C;
      color: #fff
    }
  }
}
.input-new-tag {
  position: relative;
  width: 100px;
  top: 1px;
  /deep/ .el-input__inner {
    height: 26px;
    line-height: 26px;
    border-radius: 0;
  }
}
.button-new-tag { margin-left: 7px }
</style>
