<template>
  <el-dialog :title="giftTitle" :visible.sync="giftShow" width="30%">
    <el-form :model="giftModelForm" ref="giftForm" label-position="right" :rules="rules" label-width="100px">
      <el-form-item label="赠品名称：" prop="gift_name">
        <el-input
          auto-complete="off"
          v-model="giftModelForm.gift_name"
          placeholder="不超过20个字"
          @change="giftModelForm.gift_name = giftModelForm.gift_name.trim()"
          maxlength="20"
          label-width="100"></el-input>
      </el-form-item>
      <el-form-item label="赠品价格：" prop="gift_price">
        <el-input placeholder="请输入赠品价格,长度最多为10个字符" maxlength="10" v-model="giftModelForm.gift_price">
          <template slot="prepend">¥</template>
        </el-input>
      </el-form-item>
      <el-form-item label="赠品库存：" prop="actual_store">
        <el-input placeholder="请输入赠品库存,长度最多为10个字符" maxlength="10" v-model="giftModelForm.actual_store"/>
      </el-form-item>
      <el-form-item label="赠品图片：" prop="enable_img">
        <el-upload
          class="upload-demo"
          :action="`${MixinUploadApi}?scene=other`"
          :file-list="fileList"
          :on-success="uploadSuccess"
          :on-remove="delGiftImg"
          list-type="picture">
          <el-button type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancelGifts">取 消</el-button>
      <el-button type="primary" @click="handleReserveGifts">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import * as API_Gift from '@/api/gift'
  import { RegExp } from '~/ui-utils'
  export default {
    name: 'AddGift',
    props: {
      /** 当前赠品id */
      currentGiftId: {
        type: [String, Number],
        default: () => {
          return ''
        }
      },

      /** 赠品弹框显示*/
      giftModelShow: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const checkGiftPrice = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入赠品价格'))
        }
        setTimeout(() => {
          if (!RegExp.money.test(value)) {
            callback(new Error('请输入正确的价格'))
          } else {
            callback()
          }
        }, 500)
      }
      const checkEnableStore = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入库存'))
        }
        setTimeout(() => {
          if (!RegExp.integer.test(value)) {
            callback(new Error('请输入正整数'))
          } else {
            callback()
          }
        }, 500)
      }
      return {
        giftShow: false,

        /** 赠品编辑表单*/
        giftModelForm: {

          /** 赠品名称 */
          gift_name: '',

          /** 赠品图片 */
          gift_img: '',

          /** 赠品价格 */
          gift_price: '',

          /** 实际库存 */
          actual_store: ''
        },

        /** 存储上传的图片*/
        fileList: [],

        /** 校验规则 */
        rules: {
          gift_name: [
            { required: true, message: '请输入赠品名称', trigger: 'blur' }
          ],
          gift_price: [
            { required: true, message: '请输入赠品价格', trigger: 'blur' },
            { validator: checkGiftPrice, trigger: 'blur' }
          ],
          actual_store: [
            { required: true, message: '请输入赠品库存', trigger: 'blur' },
            { validator: checkEnableStore, trigger: 'blur' }
          ],
          enable_img: [
            { required: true,
              validator: (rule, value, callback) => {
                if (!this.giftModelForm.gift_img) {
                  callback(new Error('请上传赠品图片！'))
                } else {
                  callback()
                }
              }, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      giftTitle() {
        return this.currentGiftId ? '编辑赠品' : '新增赠品'
      }
    },
    watch: {
      giftShow() {
        !this.giftShow && this.$emit('saveGift', false)
      },
      giftModelShow() {
        this.giftShow = this.giftModelShow
      },
      currentGiftId() {
        if (this.currentGiftId) {
          this.GET_giftDetails()
        } else {
          this.giftModelForm = {
            /** 赠品名称 */
            gift_name: '',

            /** 赠品图片 */
            gift_img: '',

            /** 赠品价格 */
            gift_price: 0,

            /** 实际库存 */
            actual_store: 0
          }
          this.fileList = []
        }
      }
    },
    mounted() {
      this.currentGiftId && this.GET_giftDetails()
    },
    methods: {
      /** 查询一个赠品详情 */
      GET_giftDetails() {
        this.$nextTick(() => {
          API_Gift.getGiftDetails(this.currentGiftId, {}).then((response) => {
            this.giftModelForm = { ...response }
            this.fileList = [{ url: this.giftModelForm.gift_img }]
          })
        })
      },

      /** 取消 */
      handleCancelGifts() {
        this.$emit('saveGift', false)
      },

      /** 保存赠品*/
      handleReserveGifts() {
        this.$refs['giftForm'].validate((valid) => {
          if (valid) {
            if (this.currentGiftId) {
              // 更新
              API_Gift.saveGifts(this.currentGiftId, this.giftModelForm).then(() => {
                this.giftShow = false
                this.$message.success('保存成功！')
                this.$emit('saveGift', true)
              })
            } else {
              // 新增
              API_Gift.addGifts(this.giftModelForm).then(() => {
                this.giftShow = false
                this.$message.success('保存成功！')
                this.giftModelForm = {
                  /** 赠品名称 */
                  gift_name: '',
                  /** 赠品图片 */
                  gift_img: '',
                  /** 赠品价格 */
                  gift_price: '',
                  /** 实际库存 */
                  actual_store: ''
                }
                this.fileList = []
                this.$emit('saveGift', true)
              })
            }
            setTimeout(() => { this.$refs['giftForm'].resetFields() })
          } else {
            this.$message.error('表单存在错误，请修改')
          }
        })
      },

      /** 上传成功之后 */
      uploadSuccess(response) {
        this.giftModelForm.gift_img = response.url
        this.fileList.shift()
        this.fileList.push(response)
        this.$refs['giftForm'].validateField('enable_img')
      },

      /** 图片移除之后 */
      delGiftImg() {
        this.fileList = []
        this.giftModelForm.gift_img = ''
      }
    }
  }
</script>

<style lang="scss" type="scss" scoped>
  .upload-demo {
    text-align: left;
  }
</style>
