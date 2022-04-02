/**
 * Created by Andste on 2018/5/18.
 * PC端首页楼层导出
 * common  已有的模板
 * customs 按照开发文档自定义的模板
 */

import common from './common'
import customs from './customs'

const templates = {
  ...common,
  ...customs
}

const templateArray = []
Object.keys(common).forEach(key => {
  if (common[key].dataTpl) templateArray.push(common[key].dataTpl)
})

Object.keys(customs).forEach(key => {
  if (customs[key].dataTpl) templateArray.push(customs[key].dataTpl)
})

export { templateArray }
export default templates
