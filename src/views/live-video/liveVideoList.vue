<template>
  <div>
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button @click="handleAddLiveVideo" type="primary">new</el-button>
        </div>
        <div class="toolbar-search">
          <en-table-search @search="searchEvent" placeholder="Please enter anchor WeChat ID"/>
        </div>
      </div>
      <template slot="table-columns">
        <!--liveID-->
        <el-table-column label="liveID">
          <template slot-scope="scope">
            <span>{{ scope.row.we_chat_room_id || '-' }}</span>
          </template>
        </el-table-column>
        <!--Live time-->
        <el-table-column label="Live time" min-width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.start_time | unixToDate }}</span>to
            <span>{{ scope.row.end_time | unixToDate }}</span>
          </template>
        </el-table-column>
        <!--Name of broadcast room-->
        <el-table-column prop="room_name" label="Name of broadcast room"/>
        <!--Anchor WeChat ID-->
        <el-table-column prop="anchor_we_chat" label="Anchor WeChat ID"/>
        <!--Broadcast live on state-->
        <el-table-column label="Broadcast live on state">
          <template slot-scope="scope">{{ scope.row.status | filterStatus }}</template>
        </el-table-column>
        <!--Operation-->
        <el-table-column label="Operation" min-width="300">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              :disabled="!!scope.row.we_chat_room_id || scope.row.status === '103'"
              @click="handleSubmitAudit(scope.$index, scope.row)">Submit audit</el-button>
            <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.status === '103' || !scope.row.we_chat_room_id"
              @click="handleEditGoods(scope.$index, scope.row)">Edit commodity</el-button>
            <el-button
              size="mini"
              type="primary"
              :disabled="!!scope.row.we_chat_room_id || scope.row.status === '103'"
              @click="handleEditLiveVideo(scope.$index, scope.row)">edit</el-button>
            <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.status === '101'"
              @click="handleDeleteLiveVideo(scope.$index, scope.row)">delete</el-button>
          </template>
        </el-table-column>
      </template>
      <el-pagination
        v-if="tableData"
        slot="pagination"
        @size-change="handlePageSizeChange"
        @current-change="handlePageCurrentChange"
        :current-page="tableData.page_no"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="tableData.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.data_total">
      </el-pagination>
    </en-table-layout>
    <el-dialog title="New broadcast room" :visible.sync="liveModelShow" :close-on-click-modal="false" width="30%">
      <el-form :model="liveVideoData" label-position="right" ref="liveVideoData" label-width="130px" :rules="rules" status-icon>
        <el-form-item label="Name of broadcast room：" prop="room_name">
          <el-input v-model="liveVideoData.room_name" maxlength="50" placeholder="Please enter the studio name" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="Effect of time：" prop="live_video_time" style="text-align: left">
          <el-date-picker
            v-model="liveVideoData.live_video_time"
            type="datetimerange"
            value-format="timestamp"
            range-separator="-"
            start-placeholder="Start date"
            end-placeholder="End date"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="{disabledDate(time) {return time.getTime()  <  (Date.now() - 8.64E7)   ||  time.getTime() > endTime }}">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="The host nickname：" prop="anchor_name">
          <el-input v-model="liveVideoData.anchor_name" maxlength="100" placeholder="Please enter the anchor nickname"></el-input>
        </el-form-item>
        <el-form-item label="Anchor WeChat ID：" prop="anchor_we_chat">
          <el-input v-model="liveVideoData.anchor_we_chat" maxlength="50" placeholder="Please enter anchor WeChat ID"></el-input>
        </el-form-item>
        <el-form-item label="Cover of the studio：" prop="feeds_img_url">
          <el-upload
            :action="MixinWXUploadApi"
            :data="data"
            list-type="picture-card"
            :multiple="false"
            :limit="1"
            :file-list="feeds_img_file"
            :before-upload="handleFeedsImgBefore"
            :on-remove="() => { liveVideoData.feeds_img = ''; liveVideoData.feeds_img_url = ''; feeds_img_file = [] }"
            :on-success="(res) => { liveVideoData.feeds_img = res.media_id; liveVideoData.feeds_img_url = res.url; this.$refs['liveVideoData'].validateField('feeds_img_url') }"
            :on-exceed="() => { $message.error('The number of files exceeds the limit！') }">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">Suggest pixel1080*1920, the size of no more than2M</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="Background of the studio：" prop="background_image_url">
          <el-upload
            :action="MixinWXUploadApi"
            :data="data"
            list-type="picture-card"
            :multiple="false"
            :limit="1"
            :file-list="background_image_file"
            :before-upload="handleBackgroundImgBefore"
            :on-remove="() => { liveVideoData.background_image = ''; liveVideoData.background_image_url = ''; background_image_file = [] }"
            :on-success="(res) => { liveVideoData.background_image = res.media_id; liveVideoData.background_image_url = res.url; this.$refs['liveVideoData'].validateField('background_image_url') }"
            :on-exceed="() => { $message.error('The number of files exceeds the limit！') }">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">Suggest pixel1080*1920, the size of no more than2M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="Share pictures in the studio：" prop="share_img_url">
          <el-upload
            :action="MixinWXUploadApi"
            :data="data"
            list-type="picture-card"
            :multiple="false"
            :limit="1"
            :file-list="share_img_file"
            :before-upload="handleShareImgBefore"
            :on-remove="() => { liveVideoData.share_img = ''; liveVideoData.share_img_url= ''; share_img_file = [] }"
            :on-success="(res) => { liveVideoData.share_img = res.media_id; liveVideoData.share_img_url = res.url; this.$refs['liveVideoData'].validateField('share_img_url') }"
            :on-exceed="() => { $message.error('The number of files exceeds the limit！') }">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">Suggest pixel800*640, the size of no more than1M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="Thumb up function：" prop="close_like">
          <el-radio-group v-model="liveVideoData.close_like">
            <el-radio :label="1">Close the thumb up</el-radio>
            <el-radio :label="0">Open the thumb up</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Shelves function：" prop="close_goods">
          <el-radio-group v-model="liveVideoData.close_goods">
            <el-radio :label="1">Close the shelves</el-radio>
            <el-radio :label="0">Open shelves</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="The comment function：" prop="close_comment">
          <el-radio-group v-model="liveVideoData.close_comment">
            <el-radio :label="1">Closing comments</el-radio>
            <el-radio :label="0">Open comment</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="liveModelShow = false">cancel</el-button>
        <el-button type="primary" @click="handleReserveLiveVideo('liveVideoData')">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as API_Live from '@/api/live'
  import { api } from '~/ui-domain'
  export default {
    name: 'liveVideoList',
    data() {
      return {
        data: {
          type: 'image'
        },
        /** The list ofloadingStatus*/
        loading: false,
        /** A list of parameters*/
        params: {
          page_no: 1,
          page_size: 10
        },
        /** The list of data*/
        tableData: '',
        /** Added live broadcast pop-up window*/
        liveModelShow: false,
        /** Cover photo*/
        feeds_img_file: [],
        /** Store uploaded background images*/
        background_image_file: [],
        /** Store uploaded shared images*/
        share_img_file: [],
        /** Added live broadcast room data*/
        liveVideoData: {
          room_name: '',
          live_video_time: [],
          anchor_name: '',
          anchor_we_chat: '',
          background_image: '',
          background_image_url: '',
          share_img: '',
          share_img_url: '',
          close_like: 1,
          close_goods: 1,
          close_comment: 1
        },
        liveVideoId: '',
        endTime: '',
        /** Validation rules*/
        rules: {
          room_name: [
            { required: true, message: 'Please enter the studio name', trigger: 'blur' },
            { min: 6, max: 17, message: 'The studio name length is at6-17A character', trigger: 'blur' }
          ],
          /** Effect of time*/
          live_video_time: [
            { required: true, message: 'Please enter the effective date', trigger: 'blur' },
            { type: 'array', trigger: 'blur' }
          ],
          anchor_name: [
            { required: true, message: 'Please enter the anchor nickname', trigger: 'blur' },
            { min: 4, max: 15, message: 'Anchor nickname length at4-15A character', trigger: 'blur' }
          ],
          anchor_we_chat: [
            { required: true, message: 'Please enter anchor WeChat ID', trigger: 'blur' }
          ],
          background_image_url: [
            { required: true, message: 'Please select the studio background', trigger: 'blur' }
          ],
          share_img_url: [
            { required: true, message: 'Please select a studio to share your view', trigger: 'blur' }
          ],
          close_like: [
            { required: true, message: 'Please select the "like" function', trigger: 'blur' }
          ],
          close_goods: [
            { required: true, message: 'Please select shelf function', trigger: 'blur' }
          ],
          close_comment: [
            { required: true, message: 'Please select the comment feature', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.GET_LiveVideoList()
    },
    watch: {
      liveVideoId() {
        if (this.liveVideoId) {
          this.GET_LiveVideoDetail()
        } else {
          this.liveVideoData = {
            room_name: '',
            live_video_time: [],
            anchor_name: '',
            anchor_we_chat: '',
            background_image: '',
            background_image_url: '',
            share_img: '',
            share_img_url: '',
            close_like: 1,
            close_goods: 1,
            close_comment: 1
          }
        }
      }
    },
    filters: {
      /** Broadcast live on state*/
      filterStatus(val) {
        switch (val) {
          case '101': return 'Live in the'
          case '102': return 'Not at the'
          case '103': return 'Has ended'
          case '104': return 'banned'
          case '105': return 'In the pause'
          case '106': return 'abnormal'
          case '107': return 'expired'
        }
      }
    },
    methods: {
      /** The page size has changed*/
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_LiveVideoList()
      },

      /** The number of pages changed*/
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_LiveVideoList()
      },

      /** Search Event Trigger*/
      searchEvent(keyword) {
        this.params.page_no = 1
        this.params = {
          ...this.params,
          page_no: 1,
          anchor_we_chat: keyword
        }
        if (!keyword) delete this.params.anchor_we_chat
        this.GET_LiveVideoList()
      },

      /** Submit audit*/
      handleSubmitAudit(index, row) {
        this.$confirm('Are you sure you want to submit it for review？', 'prompt', {
          confirmButtonText: 'save',
          cancelButtonText: 'cancel',
          type: 'warning'
        }).then(() => {
          API_Live.auditLiveVideoRooms(row.id).then(() => {
            this.GET_LiveVideoList()
            this.$message.success('Submitted successfully！')
          })
        })
      },

      /** Edit commodity*/
      handleEditGoods(index, row) {
        this.$router.push({ name: 'editLiveVideoGoods', params: { room_id: row.we_chat_room_id }})
      },

      /** New broadcast room*/
      handleAddLiveVideo() {
        this.liveVideoId = ''
        this.share_img_file = []
        this.background_image_file = []
        this.liveModelShow = true
        setTimeout(() => { this.$refs['liveVideoData'].resetFields() })
        // Gets the timestamp of 23:59:59 seconds for a certain day
        this.endTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 * 30 - 1).getTime()
      },

      /** Modifying Live Broadcast Information*/
      handleEditLiveVideo(index, row) {
        this.liveModelShow = true
        this.liveVideoId = row.id
        this.endTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 * 30 - 1).getTime()
      },

      /** Delete the studio*/
      handleDeleteLiveVideo(index, row) {
        this.$confirm('Are you sure you want to delete this live stream？', 'prompt', {
          confirmButtonText: 'save',
          cancelButtonText: 'cancel',
          type: 'warning'
        }).then(() => {
          API_Live.deleteLiveVideo(row.id).then(() => {
            this.GET_LiveVideoList()
            this.$message.success('Delete the success！')
          })
        })
      },

      //

      /** Check the cover image of broadcast room before uploading*/
      handleFeedsImgBefore(file) {
        const isType = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isType) {
          this.$message.error('Upload studio background picture can only beJPG、JPEGorPNGFormat!')
          return isType
        }
        if (!isLt2M) {
          this.$message.error('The size of the background picture in the broadcast room should not exceed2MB!')
        }
        return isType && isLt2M
      },
      /** Verify the background image of broadcast room before uploading*/
      handleBackgroundImgBefore(file) {
        const isType = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isType) {
          this.$message.error('Upload studio background picture can only beJPG、JPEGorPNGFormat!')
          return isType
        }
        if (!isLt2M) {
          this.$message.error('The size of the background picture in the broadcast room should not exceed2MB!')
        }
        return isType && isLt2M
      },

      /** Live broadcast studio shared pictures before uploading verification*/
      handleShareImgBefore(file) {
        const isType = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isType) {
          this.$message.error('Uploading pictures to broadcast studio can only be doneJPG、JPEGorPNGFormat!')
        }
        if (!isLt1M) {
          this.$message.error('The size of pictures Shared in the broadcast room should not exceed1MB!')
        }
        return isType && isLt1M
      },

      /** Save broadcast room data*/
      handleReserveLiveVideo() {
        this.$refs['liveVideoData'].validate((valid) => {
          if (valid) {
            const _params = {
              ...this.liveVideoData,
              start_time: this.liveVideoData.live_video_time[0] / 1000,
              end_time: this.liveVideoData.live_video_time[1] / 1000
            }
            delete _params.live_video_time
            if (this.liveVideoId) {
              API_Live.updateLiveVideo(this.liveVideoId, _params).then(response => {
                this.$message.success('Modify the success')
                this.liveModelShow = false
                this.GET_LiveVideoList()
              })
            } else {
              API_Live.addLiveVideoRooms(_params).then(response => {
                this.$message.success('Add a success')
                this.liveModelShow = false
                this.GET_LiveVideoList()
              })
            }
          } else {
            this.$message.error('There is an error in the form. Please modify it')
          }
        })
      },

      /** Get a live broadcast details*/
      GET_LiveVideoDetail() {
        API_Live.getLiveVideo(this.liveVideoId).then(response => {
          this.liveVideoData = {
            ...response,
            live_video_time: [parseInt(response.start_time) * 1000, parseInt(response.end_time) * 1000]
          }
          this.feeds_img_file = this.liveVideoData.feeds_img_url ? [{ name: 'feeds_img_url', url: this.liveVideoData.feeds_img_url }] : []
          this.background_image_file = this.liveVideoData.background_image_url ? [{ name: 'background_image_url', url: this.liveVideoData.background_image_url }] : []
          this.share_img_file = this.liveVideoData.share_img_url ? [{ name: 'share_img_url', url: this.liveVideoData.share_img_url }] : []
        })
      },

      /** Get live list*/
      GET_LiveVideoList() {
        this.loading = true
        const { params } = this
        Object.keys(params).forEach(key => {
          if (!params[key] && params[key] !== 0) {
            delete params[key]
          }
        })
        API_Live.getLiveVideoList(params).then(response => {
          this.loading = false
          this.tableData = response
        }).catch(() => { this.loading = false })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .el-date-editor {
    width: 100%;
  }
</style>

