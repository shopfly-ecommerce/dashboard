<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    width="600px">
    <div slot="title" class="tags-picker-title">Floor label editor</div>
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
            placeholder="15Within a word"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="mini" @click="showInput">+ Add tags</el-button>
        </div>
        <div class="tags-opt">
          <el-form :model="tagsForm" :rules="tagsRules" ref="tagsForm" label-width="80px">
            <el-form-item label="Text" prop="block_value">
              <el-input v-model="tagsForm.block_value" :maxlength="30" placeholder="30Within a word"></el-input>
            </el-form-item>
            <el-form-item label="Operation" prop="block_opt.opt_value">
              <el-select v-model="tagsForm.block_opt.opt_type" placeholder="Please select" style="width: 175px">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input placeholder="Please enter content" v-model="tagsForm.block_opt.opt_value" style="width: 300px"/>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div slot="footer" class="tags-picker-footer">
      <el-button @click="visible = false">cancel</el-button>
      <el-button type="primary" @click="handleConfirm">save</el-button>
    </div>
  </el-dialog>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'EnFloorTagsPicker',
  components: { draggable },
  props: {
    // The dialog shows
    show: {
      type: Boolean,
      default: false
    },
    // The largest number of
    maxLength: {
      type: Number,
      default: 10
    },
    // The default data
    defaultData: {
      type: Array,
      default: () => ([])
    },
    // Operating parameters
    options: {
      type: Array,
      default: () => [
        { text: 'No operation', value: 'NONE' },
        { text: 'The link address', value: 'URL' },
        { text: 'keyword', value: 'KEYWORD' },
        { text: 'Product serial number', value: 'GOODS' },
        { text: 'Category', value: 'CATEGORY' }
        // {text: TOPIC, value: TOPIC}
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
        block_value: [{ required: true, message: 'Please enter the label text！' }],
        'block_opt.opt_value': [{ required: false, message: 'Please enter the label text！' }]
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
      this.$confirm('Be sure to delete the label？', 'prompt', { type: 'warning' }).then(() => {
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
          this.$message.error('Exceed the maximum number！')
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
    /** Edit the label*/
    handleEditTag(index, tag) {
      this.validTagsForm().finally(() => {
        this.tagsForm = JSON.parse(JSON.stringify(tag))
        this.editIndex = index
      })
    },
    /** confirm*/
    handleConfirm() {
      this.validTagsForm().then(() => {
        this.$emit('confirm', this.tagList)
        this.$emit('close')
      }).catch(() => {
        this.$message.error('There is an error in the form. Please check it！')
      })
    },
    /** Check the form*/
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
