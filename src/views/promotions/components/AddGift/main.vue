<template>
  <el-dialog :title="giftTitle" :visible.sync="giftShow" width="30%">
    <el-form :model="giftModelForm" ref="giftForm" label-position="right" :rules="rules" label-width="100px">
      <el-form-item label="Name of gift：" prop="gift_name">
        <el-input
          auto-complete="off"
          v-model="giftModelForm.gift_name"
          placeholder="No more than20A word"
          @change="giftModelForm.gift_name = giftModelForm.gift_name.trim()"
          maxlength="20"
          label-width="100"></el-input>
      </el-form-item>
      <el-form-item label="Present price：" prop="gift_price">
        <el-input placeholder="Please enter the price of the gift,Maximum length:10A character" maxlength="10" v-model="giftModelForm.gift_price">
          <template slot="prepend">¥</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Merchandise inventory：" prop="actual_store">
        <el-input placeholder="Please enter gift inventory,Maximum length:10A character" maxlength="10" v-model="giftModelForm.actual_store"/>
      </el-form-item>
      <el-form-item label="Gifts pictures：" prop="enable_img">
        <el-upload
          class="upload-demo"
          :action="`${MixinUploadApi}?scene=other`"
          :file-list="fileList"
          :on-success="uploadSuccess"
          :on-remove="delGiftImg"
          list-type="picture">
          <el-button type="primary">upload</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancelGifts">cancel</el-button>
      <el-button type="primary" @click="handleReserveGifts">save</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import * as API_Gift from '@/api/gift'
  import { RegExp } from '~/ui-utils'
  export default {
    name: 'AddGift',
    props: {
      /** The current giftid */
      currentGiftId: {
        type: [String, Number],
        default: () => {
          return ''
        }
      },

      /** Giveaway cartridge display*/
      giftModelShow: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const checkGiftPrice = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('Please enter the price of the gift'))
        }
        setTimeout(() => {
          if (!RegExp.money.test(value)) {
            callback(new Error('Please enter the correct price'))
          } else {
            callback()
          }
        }, 500)
      }
      const checkEnableStore = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('Please enter inventory'))
        }
        setTimeout(() => {
          if (!RegExp.integer.test(value)) {
            callback(new Error('Please enter a positive integer'))
          } else {
            callback()
          }
        }, 500)
      }
      return {
        giftShow: false,

        /** Giveaway editing form*/
        giftModelForm: {

          /** Name of gift*/
          gift_name: '',

          /** Gifts pictures*/
          gift_img: '',

          /** Present price*/
          gift_price: '',

          /** The actual inventory*/
          actual_store: ''
        },

        /** Stores uploaded images*/
        fileList: [],

        /** Validation rules*/
        rules: {
          gift_name: [
            { required: true, message: 'Please enter the name of the gift item', trigger: 'blur' }
          ],
          gift_price: [
            { required: true, message: 'Please enter the price of the gift', trigger: 'blur' },
            { validator: checkGiftPrice, trigger: 'blur' }
          ],
          actual_store: [
            { required: true, message: 'Please enter gift inventory', trigger: 'blur' },
            { validator: checkEnableStore, trigger: 'blur' }
          ],
          enable_img: [
            { required: true,
              validator: (rule, value, callback) => {
                if (!this.giftModelForm.gift_img) {
                  callback(new Error('Please upload pictures of the gifts！'))
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
        return this.currentGiftId ? 'Edit the gifts' : 'New gift'
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
            /** Name of gift*/
            gift_name: '',

            /** Gifts pictures*/
            gift_img: '',

            /** Present price*/
            gift_price: 0,

            /** The actual inventory*/
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
      /** Inquire about details of a gift*/
      GET_giftDetails() {
        this.$nextTick(() => {
          API_Gift.getGiftDetails(this.currentGiftId, {}).then((response) => {
            this.giftModelForm = { ...response }
            this.fileList = [{ url: this.giftModelForm.gift_img }]
          })
        })
      },

      /** cancel*/
      handleCancelGifts() {
        this.$emit('saveGift', false)
      },

      /** Save the gift*/
      handleReserveGifts() {
        this.$refs['giftForm'].validate((valid) => {
          if (valid) {
            if (this.currentGiftId) {
              // update
              API_Gift.saveGifts(this.currentGiftId, this.giftModelForm).then(() => {
                this.giftShow = false
                this.$message.success('Save success！')
                this.$emit('saveGift', true)
              })
            } else {
              // new
              API_Gift.addGifts(this.giftModelForm).then(() => {
                this.giftShow = false
                this.$message.success('Save success！')
                this.giftModelForm = {
                  /** Name of gift*/
                  gift_name: '',
                  /** Gifts pictures*/
                  gift_img: '',
                  /** Present price*/
                  gift_price: '',
                  /** The actual inventory*/
                  actual_store: ''
                }
                this.fileList = []
                this.$emit('saveGift', true)
              })
            }
            setTimeout(() => { this.$refs['giftForm'].resetFields() })
          } else {
            this.$message.error('There is an error in the form. Please modify it')
          }
        })
      },

      /** After uploading successfully*/
      uploadSuccess(response) {
        this.giftModelForm.gift_img = response.url
        this.fileList.shift()
        this.fileList.push(response)
        this.$refs['giftForm'].validateField('enable_img')
      },

      /** Once the image is removed*/
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
