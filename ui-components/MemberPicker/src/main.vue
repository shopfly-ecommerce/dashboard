<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    width="805px">
    <div slot="title" class="member-picker-title">Member selector</div>
    <div class="member-picker-body">
      <div class="member-picker-search">
        <div class="item-search">
          <span>A search scope</span>
          <el-select v-model="params.sex" clearable placeholder="Sex selection">
            <el-option label="male" :value="1"/>
            <el-option label="female" :value="0"/>
          </el-select>
          <el-input v-model="params.keyword" :placeholder="'Please enter a keyword, for example：User name or mobile number'" clearable class="inline-input"/>
          <el-button @click="() => { GET_MemberList(true) }">search</el-button>
        </div>
        <!--<div class="item-search">-->
          <!--<span>Looking for members</span>-->
          <!--<el-input v-model="params.goods_ids" placeholder="Please enter your membership number. please separate multiple numbers with commas, both in Chinese and English." clearable class="inline-input member-ids"/>-->
          <!--<el-button @click="handleSearchMultipleGoods">To find the</el-button>-->
        <!--</div>-->
      </div>
      <div class="member-picker-content">
        <div class="list">
          <div
            v-for="(member, index) in memberList"
            :class="['member-item', isSelected(member) && 'selected']"
          >
            <span class="icon-selected"></span>
            <div class="member-image">
              <img :src="member.face">
            </div>
            <div class="member-other">
              <div class="member-name">{{ member.uname }}</div>
              <div class="member-price">{{ member.mobile }}</div>
            </div>
            <div class="member-mask">
              <div class="mask-check" :title="isSelected(member) ? 'Unselect member' : 'Select the member'" @click="handleClickItem(member, index)"><i></i></div>
            </div>
          </div>
          <el-button
            v-if="memberList.length > 0"
            type="primary"
            size="small"
            :loading="loading"
            @click="handleLoadMore"
            class="load-more"
          >To load more</el-button>
        </div>
        <div class="selected-list" :id="'member-picker-selected-' + _uid">
          <transition-group name="slide-fade">
            <div
              v-for="(member, index) in selectedList"
              v-if="member"
              :key="member.member_id"
              class="member-item slide-fade-item selected"
            >
              <span class="icon-selected"></span>
              <div class="member-image">
                <img :src="member.face">
              </div>
              <div class="member-other">
                <div class="member-name">{{ member.uname }}</div>
                <div class="member-price">{{ member.mobile }}</div>
              </div>
              <div class="member-mask">
                <div class="mask-check" title="Unselect member" @click="handleRemoveItem(member, index)"><i></i></div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
    <div slot="footer" class="member-picker-footer">
      <div class="upload-status-num">
        Maximum number of choices：<span>{{ limit < 1 ? 'unlimited' : limit }}</span>
        The number of the selected：<span>{{ selectedNum }}</span>
        Also optional number：<span>{{ limit < 1 ? 'unlimited' : limit - selectedNum }}</span>
      </div>
      <span>
        <el-button @click="dialogVisible = false">cancel</el-button>
      <el-button type="primary" @click="handleConfirm">save</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
  import mixin from './mixin'

  export default {
    name: 'EnMemberPicker',
    mixins: [mixin]
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "./styles";
</style>
