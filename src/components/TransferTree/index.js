import Vue from 'vue'
import TransferTree from './TransferTree'

TransferTree.install = () => {
  Vue.component(TransferTree.name, TransferTree)
}

// yp 未来重构树形选择器以及运费模版逻辑的建议： 显示数据 和 实际操作数据分开
// 选择器内显示数据即为其内部操作数据 运费模版逻辑中操作数据为外部实际操作数据

export default TransferTree
