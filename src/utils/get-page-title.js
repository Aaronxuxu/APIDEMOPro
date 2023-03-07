import defaultSettings from '@/settings'

const title = defaultSettings.title || '自动化生成器数据中心'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
