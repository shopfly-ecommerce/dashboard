<template>
  <div class="transfer" :style="{width,height}">
    <!-- 左侧穿梭框 原料框 -->
    <div class="transfer-left">
      <h3 class="transfer-title">
        <!--全选按钮-->
        <el-checkbox v-model="is_from_selected_all" @change="onChangeFromAll">全选</el-checkbox>
        <!--源列表标题-->
        <span class="u-right list-title">{{ fromTitle }}</span>
      </h3>
      <!-- 内容区 -->
      <div class="transfer-main">
        <en-tree-list
          :treeData="from_data"
          :key="1"
          :isCompleted="is_from_completed"
          :selectedAllData="selected_all_from_data"
          @getChooseData="updateSelectedFromData"
          @scorll_load_more="scorllLoadFromData"
          @listenCompleted="listenFromCompleted"
          class="trees"></en-tree-list>
      </div>
    </div>
     <!--穿梭区 按钮框-->
    <div class="transfer-center">
      <template v-if='button_text'>
        <p class="transfer-center-item">
          <el-button type="primary" @click="addTo" :disabled="from_disabled">
            {{ fromButton || '添加'}}
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </p>
        <p class="transfer-center-item">
          <el-button type="primary" @click='removeTo' :disabled="to_disabled" icon="el-icon-arrow-left">{{ toButton || '移除'}}</el-button>
        </p>
      </template>
      <template v-else>
        <p class="transfer-center-item">
          <el-button type="primary" @click="addToAims" icon="el-icon-arrow-right" circle :disabled="from_disabled"></el-button>
        </p>
        <p class="transfer-center-item">
          <el-button type="primary" @click='removeToSource' :disabled="to_disabled" icon="el-icon-arrow-left" circle></el-button>
        </p>
      </template>
    </div>
     <!--右侧穿梭框 目标框-->
    <div class="transfer-right">
      <h3 class="transfer-title">
        <!--全选按钮-->
        <el-checkbox v-model="is_to_selected_all" @change="onChangeToAll">全选</el-checkbox>
        <!--目标列表标题-->
        <span class="u-right list-title">{{ toTitle }}</span>
      </h3>
      <!-- 内容区 -->
      <div class="transfer-main">
        <en-tree-list
          :treeData="to_data"
          :isCompleted="is_to_completed"
          :selectedAllData="selected_all_to_data"
          :key="2"
          @getChooseData="updateSelectedToData"
          @listenCompleted="listenToCompleted"
          class="trees"></en-tree-list>
      </div>
    </div>
  </div>
</template>

<script>
  import TreeList from './TreeList'
  export default {
    name: 'EnTransferTree',
    data() {
      return {
        /** 添加是否禁用 */
        from_disabled: false,

        /** 移除是否禁用 */
        to_disabled: false,

        /** 源数据是否全选 */
        is_from_selected_all: false,

        /** 目标数据是否全选 */
        is_to_selected_all: false,

        /** 源数据选中项 */
        selected_from_data: '',

        /** 目标数据选中项 */
        selected_to_data: '',

        /** 是否完成左侧移动 */
        is_from_completed: false,

        /** 是否完成右侧移动 */
        is_to_completed: false,

        /** 全选时的源数据选中数据 */
        selected_all_from_data: {},

        /** 全选时的目标数据选中数据 */
        selected_all_to_data: {}
      }
    },
    components: { [TreeList.name]: TreeList },
    props: {
      // 宽度
      width: {
        type: String,
        default: '100%'
      },
      // 高度
      height: {
        type: String,
        default: '320px'
      },
      // 标题
      title: {
        type: Array,
        default: () => ['源列表', '目标列表']
      },

      // 穿梭按钮名字
      button_text: Array,

      // 源数据
      from_data: {
        type: Object,
        default: () => ({})
      },

      // 目标数据
      to_data: {
        type: Object,
        default: () => ({})
      }
    },
    methods: {
      // 源数据更新
      updateSelectedFromData(data) {
        this.selected_from_data = data
        this.is_from_selected_all = Object.keys(this.from_data).length === Object.keys(this.selected_from_data).length
      },
      // 更新目标数据
      updateSelectedToData(data) {
        this.selected_to_data = data
        this.is_to_selected_all = Object.keys(this.to_data).length === Object.keys(this.selected_to_data).length
      },
      // 添加按钮 执行添加操作 1.源数据更新 把源数据选中项删除/添加 2.目标数据更新 把源数据选中项整合进目标数据 释放当前源数据 目标数据
      addToAims() {
        // 源数据更新 第二个参数代表数据更新类型（0移除 1添加）
        this.$emit('from_data_change', this.selected_from_data, 0)
        // 目标数据更新
        this.$emit('to_data_change', this.selected_from_data, 1)
        // 释放当前选中数据
        this.selected_from_data = {}

        this.is_from_completed = true
      },
      // 移除按钮 执行移除操作 1.目标数据更新 把目标数据选中项删除 2.源数据更新 把目标数据选中项整合进源数据 释放当前源数据 目标数据
      removeToSource() {
        // 源数据更新  第二个参数代表数据更新类型（0移除 1添加）\
        this.$emit('from_data_change', this.selected_to_data, 1)
        // 目标数据更新
        this.$emit('to_data_change', this.selected_to_data, 0)
        // 释放当前选中数据
        this.selected_to_data = {}

        this.is_to_completed = true
      },

      /** 滚动监听触发 加载更多源数据 */
      scorllLoadFromData() {
        // this.$emit('')
      },

      /** 监听左侧穿梭完成 */
      listenFromCompleted(target) {
        this.is_from_completed = false
      },

      /** 监听右侧穿梭完成 */
      listenToCompleted(target) {
        this.is_to_completed = false
      },

      /** 源数据是否全选 */
      onChangeFromAll(val) {
        this.$emit('from_selected_all', val)
        this.selected_from_data = this.selected_all_from_data = val ? JSON.parse(JSON.stringify(this.from_data)) : {}
      },

      /** 目标数据是否全选 */
      onChangeToAll(val) {
        this.$emit('to_selected_all', val)
        this.selected_to_data = this.selected_all_to_data = val ? JSON.parse(JSON.stringify(this.to_data)) : {}
      }
    },
    computed: {
      // 左侧菜单名
      fromTitle() {
        let [text] = this.title
        return text
      },
      // 右侧菜单名
      toTitle() {
        let [, text] = this.title
        return text
      },
      // 上部按钮名
      fromButton() {
        if (this.button_text === undefined) {
          return
        }
        let [text] = this.button_text
        return text
      },
      // 下部按钮名
      toButton() {
        if (this.button_text === undefined) {
          return
        }
        let [, text] = this.button_text
        return text
      }
    },
    watch: {
      // 左侧 状态监测
      from_data(val) {
        this.from_disabled = !Object.keys(val).length
        if (this.from_disabled) {
          this.is_from_selected_all = false
        }
      },
      // 右侧 状态监测
      to_data(val) {
        this.to_disabled = !Object.keys(val).length
        if (this.to_disabled) {
          this.is_to_selected_all = false
        }
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .el-tree {
    min-width: 100%;
    display: inline-block !important;
  }

  .transfer {
    position: relative;
    overflow: hidden;
  }

  .transfer-left {
    position: absolute;
    top: 0;
    left: 0;
  }

  .transfer-right {
    position: absolute;
    top: 0;
    right: 0;
  }

  .transfer-main {
    padding: 10px;
    height: calc(100% - 41px);
    box-sizing: border-box;
    overflow: auto;
  }

  .transfer-left,.transfer-right {
    border: 1px solid #ebeef5;
    width: 40%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 5px;
    vertical-align: middle;
  }

  .transfer-center {
    position: absolute;
    top: 50%;
    left: 40%;
    width: 20%;
    transform: translateY(-50%);
    text-align: center;
  }

  .transfer-center-item {
    padding: 10px;
    overflow: hidden;
  }

  .transfer-title {
    border-bottom: 1px solid #ebeef5;
    padding: 0 15px;
    height: 40px;
    line-height: 40px;
    color: #333;
    font-size: 16px;
    text-align: center;
    background-color: #f5f7fa;
  }

  .list-title {
    font-size: 14px;
  }

  .transfer-title .el-checkbox {
    margin-right: 10px;
  }
</style>


