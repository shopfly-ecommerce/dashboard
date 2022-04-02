/**
 * 商品规格选择器
 */
import Vue from 'vue'
import SkuSelector from './src/main'

SkuSelector.install = () => {
  Vue.component(SkuSelector.name, SkuSelector)
}

export default SkuSelector

/**
 * 商品规格选择器构造思路
 * 分为main主文件  skuItem skuTable两个子文件
 *
 * main主文件完成以下事件：（接受外界信息 反馈信息给外界）
 * 1：接收外界信息（包括固定参数 + 商品规格信息） 接收外界信息 （商品信息需要计算处理）传递给skuItem skuTable两个子文件
 * 2：接受skuItem信息 =》 计算处理 （得到skuTable表格所需要的数据）=》 传递数据给skuTable去渲染
 * 3：接收skutable 的规格数据 =》计算处理（得到抛出给外界的最终数据） =》抛出数据给外界
 *
 * skuItem规格选择文件完成以下事件：
 * 1：接收main文件传递信息（商品规格信息 + 基本参数）
 * 利用基本参数获取基础信息  利用规格信息初始化规格选择项（发布商品时 初始化结果为空）并且进行内部计算触发数据提交给main文件
 *
 * skuTable规格展示文件完成以下事件：
 * 1：接收main文件的固定参数对展示进行设置
 * 2：接收mian文件的规格信息进行展示规格数据
 * 3：skuTable规格数据变化时 触发提交方法 把数据提交给main文件进行处理
 * */
