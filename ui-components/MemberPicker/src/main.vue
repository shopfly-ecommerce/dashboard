<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    width="805px">
    <div slot="title" class="member-picker-title">会员选择器</div>
    <div class="member-picker-body">
      <div class="member-picker-search">
        <div class="item-search">
          <span>搜索范围</span>
          <el-select v-model="params.sex" clearable placeholder="选择性别">
            <el-option label="男" :value="1"/>
            <el-option label="女" :value="0"/>
          </el-select>
          <el-input v-model="params.keyword" :placeholder="'请输入关键字，例如：用户名或手机号'" clearable class="inline-input"/>
          <el-button @click="() => { GET_MemberList(true) }">搜索</el-button>
        </div>
        <!--<div class="item-search">-->
          <!--<span>查找会员</span>-->
          <!--<el-input v-model="params.goods_ids" placeholder="请输入会员编号，多个编号用逗号隔开，中英文都可以。" clearable class="inline-input member-ids"/>-->
          <!--<el-button @click="handleSearchMultipleGoods">查找</el-button>-->
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
              <div class="mask-check" :title="isSelected(member) ? '取消选择会员' : '选择会员'" @click="handleClickItem(member, index)"><i></i></div>
            </div>
          </div>
          <el-button
            v-if="memberList.length > 0"
            type="primary"
            size="small"
            :loading="loading"
            @click="handleLoadMore"
            class="load-more"
          >加载更多</el-button>
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
                <div class="mask-check" title="取消选择会员" @click="handleRemoveItem(member, index)"><i></i></div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
    <div slot="footer" class="member-picker-footer">
      <div class="upload-status-num">
        最多可选个数：<span>{{ limit < 1 ? '无限制' : limit }}</span>
        已选个数：<span>{{ selectedNum }}</span>
        还可选个数：<span>{{ limit < 1 ? '无限制' : limit - selectedNum }}</span>
      </div>
      <span>
        <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
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
