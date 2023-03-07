import request from '@/utils/request'
import { GET, POST } from '@/utils/constant'

// 获取当前分类的查询数据（可以全部分类）
export const getReportCount = (data) =>
  request({
    url: '/admin/getReportCount',
    method: GET,
    params: data
  })

export const downReportCount = (data) =>
  request({ url: '/admin/downReportCount', method: POST, data })
