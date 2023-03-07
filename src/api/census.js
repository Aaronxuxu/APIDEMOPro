import request from '@/utils/request'
import { GET, POST } from '@/utils/constant'
export const getIndexPageData = () =>
  request({ url: '/admin/getIndexPageData', method: GET })

export const reFreshData = (data) =>
  request({ url: '/admin/refreshDemoData', method: GET, params: data })
