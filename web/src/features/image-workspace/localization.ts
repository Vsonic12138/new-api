/** Isolated locale labels avoid touching upstream's large translation catalogs. */
export function imageWorkspaceLabel(locale: string): string {
  const lng = locale.toLowerCase().replaceAll('_', '-')
  if (lng === 'zh-tw' || lng === 'zhtw' || lng.startsWith('zh-hant') || lng === 'zh-hk') return '圖片創作空間'
  if (lng === 'zh' || lng === 'zhcn' || lng.startsWith('zh-hans') || lng.startsWith('zh-cn')) return '图片创作空间'
  if (lng.startsWith('ja')) return '画像ワークスペース'
  if (lng.startsWith('fr')) return 'Espace de création d’images'
  if (lng.startsWith('ru')) return 'Рабочая область изображений'
  if (lng.startsWith('vi')) return 'Không gian tạo ảnh'
  return 'Image Workspace'
}
