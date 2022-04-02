<template>
  <div>
    <en-table-layout
      :tableData="tableData.data"
      :loading="loading"
    >
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button @click="handleAddLiveVideo" type="primary">新增</el-button>
        </div>
        <div class="toolbar-search">
          <en-table-search @search="searchEvent" placeholder="请输入主播微信号"/>
        </div>
      </div>
      <template slot="table-columns">
        <!--直播ID-->
        <el-table-column label="直播ID">
          <template slot-scope="scope">
            <span>{{ scope.row.we_chat_room_id || '-' }}</span>
          </template>
        </el-table-column>
        <!--直播时间-->
        <el-table-column label="直播时间" min-width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.start_time | unixToDate }}</span>至
            <span>{{ scope.row.end_time | unixToDate }}</span>
          </template>
        </el-table-column>
        <!--直播间名称-->
        <el-table-column prop="room_name" label="直播间名称"/>
        <!--主播微信号-->
        <el-table-column prop="anchor_we_chat" label="主播微信号"/>
        <!--直播状态-->
        <el-table-column label="直播状态">
          <template slot-scope="scope">{{ scope.row.status | filterStatus }}</template>
        </el-table-column>
        <!--操作-->
        <el-table-column label="操作" min-width="300">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              :disabled="!!scope.row.we_chat_room_id || scope.row.status === '103'"
              @click="handleSubmitAudit(scope.$index, scope.row)">提交审核</el-button>
            <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.status === '103' || !scope.row.we_chat_room_id"
              @click="handleEditGoods(scope.$index, scope.row)">编辑商品</el-button>
            <el-button
              size="mini"
              type="primary"
              :disabled="!!scope.row.we_chat_room_id || scope.row.status === '103'"
              @click="handleEditLiveVideo(scope.$index, scope.row)">修改</el-button>
            <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.status === '101'"
              @click="handleDeleteLiveVideo(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="新增直播间" :visible.sync="liveModelShow" :close-on-click-modal="false" width="30%">
      <el-form :model="liveVideoData" label-position="right" ref="liveVideoData" label-width="130px" :rules="rules" status-icon>
        <el-form-item label="直播间名称：" prop="room_name">
          <el-input v-model="liveVideoData.room_name" maxlength="50" placeholder="请输入直播间名称" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="生效时间：" prop="live_video_time" style="text-align: left">
          <el-date-picker
            v-model="liveVideoData.live_video_time"
            type="datetimerange"
            value-format="timestamp"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="{disabledDate(time) {return time.getTime()  <  (Date.now() - 8.64E7)   ||  time.getTime() > endTime }}">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="主播昵称：" prop="anchor_name">
          <el-input v-model="liveVideoData.anchor_name" maxlength="100" placeholder="请输入主播昵称"></el-input>
        </el-form-item>
        <el-form-item label="主播微信号：" prop="anchor_we_chat">
          <el-input v-model="liveVideoData.anchor_we_chat" maxlength="50" placeholder="请输入主播微信号"></el-input>
        </el-form-item>
        <el-form-item label="直播间封面图：" prop="feeds_img_url">
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
            :on-exceed="() => { $message.error('文件数量超过限制！') }">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">建议像素1080*1920，大小不超过2M</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="直播间背景图：" prop="background_image_url">
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
            :on-exceed="() => { $message.error('文件数量超过限制！') }">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">建议像素1080*1920，大小不超过2M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="直播间分享图：" prop="share_img_url">
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
            :on-exceed="() => { $message.error('文件数量超过限制！') }">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">建议像素800*640，大小不超过1M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="点赞功能：" prop="close_like">
          <el-radio-group v-model="liveVideoData.close_like">
            <el-radio :label="1">关闭点赞</el-radio>
            <el-radio :label="0">开启点赞</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="货架功能：" prop="close_goods">
          <el-radio-group v-model="liveVideoData.close_goods">
            <el-radio :label="1">关闭货架</el-radio>
            <el-radio :label="0">开启货架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="评论功能：" prop="close_comment">
          <el-radio-group v-model="liveVideoData.close_comment">
            <el-radio :label="1">关闭评论</el-radio>
            <el-radio :label="0">开启评论</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="liveModelShow = false">取 消</el-button>
        <el-button type="primary" @click="handleReserveLiveVideo('liveVideoData')">确 定</el-button>
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
        /** 列表loading状态 */
        loading: false,
        /** 列表参数 */
        params: {
          page_no: 1,
          page_size: 10
        },
        /** 列表数据 */
        tableData: '',
        /** 新增直播间弹窗 */
        liveModelShow: false,
        /** 封面图片 */
        feeds_img_file: [],
        /** 存储上传的背景图片*/
        background_image_file: [],
        /** 存储上传的分享图片*/
        share_img_file: [],
        /** 新增直播间数据 */
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
        /** 校验规则 */
        rules: {
          room_name: [
            { required: true, message: '请输入直播间名称', trigger: 'blur' },
            { min: 6, max: 17, message: '直播间名称长度在6-17个字符', trigger: 'blur' }
          ],
          /** 生效时间 */
          live_video_time: [
            { required: true, message: '请输入生效时间', trigger: 'blur' },
            { type: 'array', trigger: 'blur' }
          ],
          anchor_name: [
            { required: true, message: '请输入主播昵称', trigger: 'blur' },
            { min: 4, max: 15, message: '主播昵称长度在4-15个字符', trigger: 'blur' }
          ],
          anchor_we_chat: [
            { required: true, message: '请输入主播微信号', trigger: 'blur' }
          ],
          background_image_url: [
            { required: true, message: '请选择直播间背景图', trigger: 'blur' }
          ],
          share_img_url: [
            { required: true, message: '请选择直播间分享景图', trigger: 'blur' }
          ],
          close_like: [
            { required: true, message: '请选择点赞功能', trigger: 'blur' }
          ],
          close_goods: [
            { required: true, message: '请选择货架功能', trigger: 'blur' }
          ],
          close_comment: [
            { required: true, message: '请选择评论功能', trigger: 'blur' }
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
      /** 直播状态 */
      filterStatus(val) {
        switch (val) {
          case '101': return '直播中'
          case '102': return '未开始'
          case '103': return '已结束'
          case '104': return '禁播'
          case '105': return '暂停中'
          case '106': return '异常'
          case '107': return '已过期'
        }
      }
    },
    methods: {
      /** 分页大小发生改变 */
      handlePageSizeChange(size) {
        this.params.page_size = size
        this.GET_LiveVideoList()
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.page_no = page
        this.GET_LiveVideoList()
      },

      /** 搜索事件触发 */
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

      /** 提交审核 */
      handleSubmitAudit(index, row) {
        this.$confirm('确定要提交审核吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API_Live.auditLiveVideoRooms(row.id).then(() => {
            this.GET_LiveVideoList()
            this.$message.success('提交成功！')
          })
        })
      },

      /** 编辑商品 */
      handleEditGoods(index, row) {
        this.$router.push({ name: 'editLiveVideoGoods', params: { room_id: row.we_chat_room_id }})
      },

      /** 新增直播间 */
      handleAddLiveVideo() {
        this.liveVideoId = ''
        this.share_img_file = []
        this.background_image_file = []
        this.liveModelShow = true
        setTimeout(() => { this.$refs['liveVideoData'].resetFields() })
        // 获取某天23:59:59秒的时间戳
        this.endTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 * 30 - 1).getTime()
      },

      /** 修改直播信息 */
      handleEditLiveVideo(index, row) {
        this.liveModelShow = true
        this.liveVideoId = row.id
        this.endTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 * 30 - 1).getTime()
      },

      /** 删除直播间 */
      handleDeleteLiveVideo(index, row) {
        this.$confirm('确定要删除此直播吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API_Live.deleteLiveVideo(row.id).then(() => {
            this.GET_LiveVideoList()
            this.$message.success('删除成功！')
          })
        })
      },

      //

      /** 直播间封面图上传前校验 */
      handleFeedsImgBefore(file) {
        const isType = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isType) {
          this.$message.error('上传直播间背景图片只能是 JPG、JPEG或PNG格式!')
          return isType
        }
        if (!isLt2M) {
          this.$message.error('上传直播间背景图片大小不能超过2MB!')
        }
        return isType && isLt2M
      },
      /** 直播间背景图上传前校验 */
      handleBackgroundImgBefore(file) {
        const isType = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isType) {
          this.$message.error('上传直播间背景图片只能是 JPG、JPEG或PNG格式!')
          return isType
        }
        if (!isLt2M) {
          this.$message.error('上传直播间背景图片大小不能超过2MB!')
        }
        return isType && isLt2M
      },

      /** 直播间分享图上传前校验 */
      handleShareImgBefore(file) {
        const isType = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isType) {
          this.$message.error('上传直播间分享图片只能是 JPG、JPEG或PNG格式!')
        }
        if (!isLt1M) {
          this.$message.error('上传直播间分享图片大小不能超过1MB!')
        }
        return isType && isLt1M
      },

      /** 保存直播间数据 */
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
                this.$message.success('修改成功')
                this.liveModelShow = false
                this.GET_LiveVideoList()
              })
            } else {
              API_Live.addLiveVideoRooms(_params).then(response => {
                this.$message.success('添加成功')
                this.liveModelShow = false
                this.GET_LiveVideoList()
              })
            }
          } else {
            this.$message.error('表单存在错误，请修改')
          }
        })
      },

      /** 获取一个直播详情 */
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

      /** 获取直播列表 */
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

