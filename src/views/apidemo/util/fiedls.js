const moment = require('moment')

export const json_fields = {
  创建时间: {
    field: 'cerateTime',
    callback: (value) => moment(value).format('YYYY-MM-DD')
  },
  所属Demo中文名称: 'classifyLabel',
  所属Demo英文名称: 'classifyName',
  所属Demo链接: 'apiURL',
  是否上线: {
    field: 'showOrHide',
    callback: (val) => (val ? '是' : '否')
  },
  总查询次数: 'total'
}
