<template>
  <div class="transfer" :style="{width,height}">
    <!-- Left side shuttle frame raw material frame-->
    <div class="transfer-left">
      <h3 class="transfer-title">
        <!--Selection button-->
        <el-checkbox v-model="is_from_selected_all" @change="onChangeFromAll">Select all</el-checkbox>
        <!--Source list title-->
        <span class="u-right list-title">{{ fromTitle }}</span>
      </h3>
      <!-- Content area-->
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
     <!--Shuttle zone button box-->
    <div class="transfer-center">
      <template v-if='button_text'>
        <p class="transfer-center-item">
          <el-button type="primary" @click="addTo" :disabled="from_disabled">
            {{ fromButton || 'add'}}
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </p>
        <p class="transfer-center-item">
          <el-button type="primary" @click='removeTo' :disabled="to_disabled" icon="el-icon-arrow-left">{{ toButton || 'remove'}}</el-button>
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
     <!--Right shuttle box target box-->
    <div class="transfer-right">
      <h3 class="transfer-title">
        <!--Selection button-->
        <el-checkbox v-model="is_to_selected_all" @change="onChangeToAll">Select all</el-checkbox>
        <!--Target list title-->
        <span class="u-right list-title">{{ toTitle }}</span>
      </h3>
      <!-- Content area-->
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
        /** Add Disable or Not*/
        from_disabled: false,

        /** Remove or disable*/
        to_disabled: false,

        /** Whether all source data is selected*/
        is_from_selected_all: false,

        /** Whether all target data is selected*/
        is_to_selected_all: false,

        /** Source data selected item*/
        selected_from_data: '',

        /** Target data selected item*/
        selected_to_data: '',

        /** Whether to complete the left move*/
        is_from_completed: false,

        /** Whether to complete the right move*/
        is_to_completed: false,

        /** The source data when all selected is selected*/
        selected_all_from_data: {},

        /** The target data when all selected is selected data*/
        selected_all_to_data: {}
      }
    },
    components: { [TreeList.name]: TreeList },
    props: {
      // The width of the
      width: {
        type: String,
        default: '100%'
      },
      // highly
      height: {
        type: String,
        default: '320px'
      },
      //  title
      title: {
        type: Array,
        default: () => ['Source list', 'The target list']
      },

      // Name of shuttle button
      button_text: Array,

      // The source data
      from_data: {
        type: Object,
        default: () => ({})
      },

      // The target data
      to_data: {
        type: Object,
        default: () => ({})
      }
    },
    methods: {
      // Source data update
      updateSelectedFromData(data) {
        this.selected_from_data = data
        this.is_from_selected_all = Object.keys(this.from_data).length === Object.keys(this.selected_from_data).length
      },
      // Update target data
      updateSelectedToData(data) {
        this.selected_to_data = data
        this.is_to_selected_all = Object.keys(this.to_data).length === Object.keys(this.selected_to_data).length
      },
      // Add button performs add operation 1. Source data update Remove/add source data check 2. Target data update consolidates the source data selection into the target data release the current source data target data
      addToAims() {
        // Source data Update The second parameter represents the data update type (0 remove 1 add)
        this.$emit('from_data_change', this.selected_from_data, 0)
        // Target data update
        this.$emit('to_data_change', this.selected_from_data, 1)
        // Release the currently selected data
        this.selected_from_data = {}

        this.is_from_completed = true
      },
      // Remove button perform remove operation 1. Target data update Delete target data selection 2. Source data update consolidates the target data selection into the source data to release the current source data target data
      removeToSource() {
        // The second parameter represents the data update type (0 remove 1 add) \
        this.$emit('from_data_change', this.selected_to_data, 1)
        // Target data update
        this.$emit('to_data_change', this.selected_to_data, 0)
        // Release the currently selected data
        this.selected_to_data = {}

        this.is_to_completed = true
      },

      /** The scroll listener triggers loading of more source data*/
      scorllLoadFromData() {
        // this.$emit('')
      },

      /** Monitor left shuttle complete*/
      listenFromCompleted(target) {
        this.is_from_completed = false
      },

      /** Monitor right side shuttle complete*/
      listenToCompleted(target) {
        this.is_to_completed = false
      },

      /** Whether all source data is selected*/
      onChangeFromAll(val) {
        this.$emit('from_selected_all', val)
        this.selected_from_data = this.selected_all_from_data = val ? JSON.parse(JSON.stringify(this.from_data)) : {}
      },

      /** Whether all target data is selected*/
      onChangeToAll(val) {
        this.$emit('to_selected_all', val)
        this.selected_to_data = this.selected_all_to_data = val ? JSON.parse(JSON.stringify(this.to_data)) : {}
      }
    },
    computed: {
      // Left menu name
      fromTitle() {
        let [text] = this.title
        return text
      },
      // Right side menu name
      toTitle() {
        let [, text] = this.title
        return text
      },
      // Top button name
      fromButton() {
        if (this.button_text === undefined) {
          return
        }
        let [text] = this.button_text
        return text
      },
      // Lower button name
      toButton() {
        if (this.button_text === undefined) {
          return
        }
        let [, text] = this.button_text
        return text
      }
    },
    watch: {
      // Left side status monitoring
      from_data(val) {
        this.from_disabled = !Object.keys(val).length
        if (this.from_disabled) {
          this.is_from_selected_all = false
        }
      },
      // Right side status monitoring
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


