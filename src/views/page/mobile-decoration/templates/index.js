/**
 * Created by Andste on 2018/5/18.
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
