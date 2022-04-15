<template>
  <div class="container">
    <div class="swiper-box">
      <swiper :options="swiperOption">
        <swiper-slide v-for="(focus, index) in focusList" :key="index">
          <div class="focus-item">
            <img :src="focus.pic_url" class="focus-image">
            <div class="opt-box">
              <i class="opt-btn el-icon-edit-outline" title="edit" @click="handleEditFocus(focus, index)"></i>
              <i class="opt-btn el-icon-delete" title="delete" @click="handleDeleteFocus(focus, index)"></i>
            </div>
          </div>
        </swiper-slide>
        <div class="swiper-pagination swiper-pagination-white" slot="pagination"></div>
        <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
        <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
      </swiper>
      <el-button type="primary" class="add-focus-btn" @click="hanldeAddFocus">New focus map</el-button>
    </div>
    <en-image-picker
      :show="dialogImageShow"
      :default-data="defaultImageData"
      @close="dialogImageShow = false"
      @confirm="handleImagePickerConfirm"
      :limit="1"
    />
  </div>
</template>

<script>
  import * as API_Floor from '@/api/floor'

  export default {
    name: 'pcFocusManage',
    data() {
      return {
        client_type: 'PC',
        focusList: [],
        swiperOption: {
          pagination: {
            el: '.swiper-pagination'
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        },
        /** Image editor display*/
        dialogImageShow: false,
        defaultImageData: null,
        /** edit-in-progress*/
        curEditIndex: null
      }
    },
    created() {
      this.GET_FocusList()
    },
    methods: {
      /** New focus image*/
      hanldeAddFocus() {
        this.curEditIndex = null
        this.dialogImageShow = true
      },
      /** Edit focus map*/
      handleEditFocus(focus, index) {
        this.curEditIndex = index
        this.defaultImageData = [{
          id: focus.id,
          url: focus.pic_url,
          opt: {
            opt_type: focus.operation_type,
            opt_value: focus.operation_param
          }
        }]
        this.dialogImageShow = true
      },
      /** Delete focus diagram*/
      handleDeleteFocus(focus, index) {
        this.$confirm('Are you sure you want to delete this focus diagram？', 'prompt', { type: 'warning' }).then(() => {
          API_Floor.deleteFocus(focus.id).then(() => {
            this.$message.success('Delete the success！')
            this.focusList.splice(index, 1)
          })
        }).catch(() => {})
      },
      /** Picture upload component confirmation*/
      handleImagePickerConfirm(fileList) {
        this.dialogImageShow = false
        const { curEditIndex } = this
        const file = fileList[0]
        const params = {
          client_type: this.client_type,
          pic_url: file.response.url,
          operation_type: file.operation.opt_type,
          operation_param: file.operation.opt_value
        }
        if (curEditIndex || curEditIndex === 0) {
          API_Floor.editFocus(this.focusList[curEditIndex].id, params).then(response => {
            this.GET_FocusList()
            this.$message.success('Modify the success！')
          })
        } else {
          API_Floor.addFocus(params).then(response => {
            this.focusList.push(response)
            this.$message.success('Add a success！')
          })
        }
      },
      GET_FocusList() {
        this.loading = true
        API_Floor.getFocus(this.client_type).then(response => {
          this.loading = false
          this.focusList = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .container {
    background-color: #fff;
    padding: 10px;

    .swiper-box {
      position: relative;
      margin: 100px auto;
      text-align: center;
      width: 1366px;
      height: 500px;
      background-color: #fff;
    }
    .swiper-container {
      width: 100%;
      height: 100%;
    }
    .focus-item { position: relative }
    .focus-item, .focus-image {
      width: 100%;
      height: 100%;
    }
    .opt-box {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0);
    }
    .opt-box, .opt-btn {
      transition: all .3s ease;
    }
    .opt-btn {
      float: left;
      display: block;
      position: relative;
      width: 50%;
      height: 100%;
      opacity: 0;
      color: #fff;
      font-size: 25px;
      line-height: 500px;
    }
    .focus-item:hover {
      .opt-box { background-color: rgba(0,0,0,.3) }
      .opt-btn { opacity: 1 }
    }
    .opt-btn:hover {
      background-color: rgba(0,0,0,.5);
      &.el-icon-delete { background-color: rgba(255, 0, 0, .8) }
      cursor: pointer;
    }
    .add-focus-btn {
      position: absolute;
      left: 50%;
      bottom: -50px;
      margin-left: -(92px / 2);
    }
  }
</style>
