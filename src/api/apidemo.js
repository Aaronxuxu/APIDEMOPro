import request from '@/utils/request'
import { GET, POST } from '@/utils/constant'

export const getApiDemo = (data) =>
  request({ url: '/admin/getAPIClassifies', method: GET, params: data })

export const addApiDemo = (data) =>
  request({
    url: '/admin/addAPIClassify',
    method: POST,
    data
  })

export const editApiDemo = (data) =>
  request({ url: '/admin/editAPIClassify', method: POST, data })

export const delApiDemo = (id) =>
  request({ url: '/admin/delAPIClassify', method: POST, data: { id } })

export const getAllApiDemo = () =>
  request({ url: '/admin/getAllApiDemo', method: GET })

// 导出数据
export const downloadAPIDEMO = () =>
  request({ url: '/admin/getALLAPIDemoAndData', method: POST })
