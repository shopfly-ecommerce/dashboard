<template>
  <div class="tree-menu" v-loadmore="loadmore">
    <ul v-for="menuItem in treeData" :key="menuItem.id">
      <en-tree-item :model="menuItem" @selectCaputure="onselected"></en-tree-item>
    </ul>
  </div>
</template>
<script>
  import treeItem from './treeItem.vue'
  export default {
    name: 'EnTreeList',
    props: {
      /** 树形数据 */
      treeData: {
        type: Object,
        default: () => ({})
      },

      /** 是否完成左右穿梭 */
      isCompleted: {
        type: Boolean,
        default: false
      },

      /** 全选时会有选中数据传入 */
      selectedAllData: {
        type: Object,
        default: {}
      }
    },
    components: {
      [treeItem.name]: treeItem
    },
    data() {
      return {
        /** 地区数据（全部数据） */
        areaData: {},

        /** 选中数据 */
        chooseData: {}
      }
    },
    watch: {
      isCompleted() {
        if (this.isCompleted) {
          this.chooseData = {}
        }
      },
      selectedAllData() {
        if (Object.keys(this.selectedAllData).length) {
          this.chooseData = this.selectedAllData
        }
      },
      chooseData() {
        if (!Object.keys(this.chooseData).length) { // 如果是空对象
          this.$emit('listenCompleted', false)
        }
      },
      treeData() {
        // 对象深拷贝
        this.areaData = JSON.parse(JSON.stringify(this.treeData))
      }
    },
    mounted() {
      // 对象深拷贝
      this.areaData = JSON.parse(JSON.stringify(this.treeData))
    },
    methods: {
      /** 加载更多 */
      loadmore() {
        console.log('触发了滚动加载')
      },
      /** 监听选中数据 */
      onselected(model, parentNode) { // 监听响应 选中之后进行计算现在选中之后的数据
        if (model.isSelected) { // 选中时加入选中数据 计算选中数据
          switch (model.level) {
            case 1: this.chooseData[model.id] = JSON.parse(JSON.stringify(model))
              break
            case 2: this.addLevelTwoData(model, parentNode)
              break
            case 3: this.addLevelThreeData(model, parentNode)
              break
          }
        } else { // 未选中时 删除选中数据 从选中数据中删除对应项
          switch (model.level) {
            case 1: delete this.chooseData[model.id]
              break
            case 2: this.delLevelTwoData(model, parentNode)
              break
            case 3: this.delLevelThreeData(model, parentNode)
              break
          }
        }
        this.$emit('getChooseData', this.chooseData)
      },

      /** 添加level2数据 */
      addLevelTwoData(model, parentNode) { // 获取选中数据 树形对象
        let isExit = false // 是否父节点（level1）已经存在 默认不存在
        for (let i in this.chooseData) {
          if (parseInt(parentNode.id) === parseInt(i)) { // 存在
            isExit = true
          }
        }
        if (!isExit) { // 如果不存在
          this.chooseData[parentNode.id] = JSON.parse(JSON.stringify(parentNode))
          this.chooseData[parentNode.id].children = {}
        }
        this.chooseData[parentNode.id].children[model.id] = JSON.parse(JSON.stringify(model))
      },

      /** 添加level3数据 */
      addLevelThreeData(model, parentNode) {
        let isExitLevel1 = false // 是否祖节点（level1）已经存在 默认不存在
        for (let i in this.chooseData) {
          if (parseInt(parentNode.parent_id) === parseInt(i)) { // 祖节点（level1）存在
            isExitLevel1 = true
          }
        }
        if (isExitLevel1) { // 如果祖节点存在
          let isExitLevel2 = false // 是否父节点（level2）已经存在 默认不存在
          for (let j in this.chooseData[parentNode.parent_id].children) {
            if (parseInt(parentNode.id) === parseInt(j)) { // 存在
              isExitLevel2 = true
            }
          }
          if (!isExitLevel2) { // 父节点不存在 则把父节点赋值 并且置空父节点的children属性
            this.chooseData[parentNode.parent_id].children[parentNode.id] = JSON.parse(JSON.stringify(parentNode))
            this.chooseData[parentNode.parent_id].children[parentNode.id].children = {}
          }
        } else { // 如果祖节点不存在 则把祖节点加入 并且置空children属性
          this.chooseData[parentNode.parent_id] = this.areaData[parentNode.parent_id]
          this.chooseData[parentNode.parent_id].children = {}
          // 此时父节点一定不存在 把父节点加入 并且置空父节点children属性
          this.chooseData[parentNode.parent_id].children[parentNode.id] = JSON.parse(JSON.stringify(parentNode))
          this.chooseData[parentNode.parent_id].children[parentNode.id].children = {}
        }
        // 把当前节点添加进入对应位置
        this.chooseData[parentNode.parent_id].children[parentNode.id].children[model.id] = JSON.parse(JSON.stringify(model))
      },

      /** 删除level2数据 */
      delLevelTwoData(model, parentNode) {
        delete this.chooseData[parentNode.id].children[model.id]
        this.chooseData[parentNode.id].isSelected = false
      },

      /** 删除level3数据 */
      delLevelThreeData(model, parentNode) {
        delete this.chooseData[parentNode.parent_id].children[parentNode.id].children[model.id]
        this.chooseData[parentNode.parent_id].children[parentNode.id].isSelected = false
      }
    }
  }
</script>
<style type="text/css" lang="scss" scoped>
  .tree-menu {
    overflow-y: scroll;
    height: 100%;
    & > ul {
      & li {
        text-align: left;
      }
    }
  }
</style>
