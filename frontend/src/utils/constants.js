/**
 * M-Team 种子相关的枚举值映射
 */

// 分类映射
export const categoryMap = {
  '401': '电影',
  '402': '电视剧',
  '403': '综艺',
  '404': '纪录片',
  '405': '动漫',
  '406': '音乐',
  '407': '体育',
  '408': '软件',
  '409': '游戏',
  '410': '图书',
  '411': '学习资料',
  '412': '其他',
  '419': '剧情片',
  '420': '喜剧片',
  '421': '动作片',
  '422': '爱情片',
  '423': '恐怖片',
  '424': '科幻片',
  '425': '动画片',
  '426': '悬疑片',
  '427': '战争片',
  '428': '犯罪片'
}

// 视频编码映射
export const videoCodecMap = {
  '1': 'x264',
  '2': 'x265',
  '3': 'AV1',
  '4': 'MPEG-2',
  '5': 'MPEG-4',
  '6': 'VC-1',
  '7': 'H.264',
  '8': 'H.265'
}

// 音频编码映射
export const audioCodecMap = {
  '1': 'AAC',
  '2': 'AC3',
  '3': 'DTS',
  '4': 'FLAC',
  '5': 'MP3',
  '6': 'OGG',
  '7': 'PCM',
  '8': 'AC3(DD)',
  '9': 'DTS-HD',
  '10': 'TrueHD',
  '11': 'DTS-X'
}

// 解析度/标准映射
export const standardMap = {
  '1': '1080p',
  '2': '720p',
  '3': '4K',
  '4': '2160p',
  '5': '1080i',
  '6': '720i',
  '7': '480p',
  '8': '576p',
  '9': '8K'
}

// 国家/地区映射
export const countryMap = {
  '1': '中国大陆',
  '2': 'United States',
  '3': '中国香港',
  '4': '中国台湾',
  '5': '日本',
  '6': '韩国',
  '7': '英国',
  '8': '法国',
  '9': '德国',
  '10': '意大利',
  '11': '加拿大',
  '12': 'United Kingdom',
  '13': '澳大利亚',
  '14': '西班牙',
  '15': '俄罗斯',
  '16': '印度',
  '17': '泰国',
  '18': '新加坡',
  '19': '马来西亚',
  '20': '其他'
}

// 制作组映射
export const teamMap = {
  '1': 'CHD',
  '2': 'HDC',
  '3': 'HDS',
  '4': 'HDT',
  '5': 'HDU',
  '6': 'HDW',
  '7': 'HDZ',
  '8': 'M-Team',
  '9': 'M-Team',
  '10': 'MTeam',
  '11': '其他'
}

// 来源映射
export const sourceMap = {
  '1': 'BluRay',
  '2': 'DVD',
  '3': 'HDTV',
  '4': 'WEB-DL',
  '5': 'WEBRip',
  '6': 'BDRip',
  '7': 'DVDRip',
  '8': 'HDRip',
  '9': 'TS',
  '10': 'TC',
  '11': 'SCR',
  '12': 'R5',
  '13': 'CAM',
  '14': '其他'
}

// 媒介映射
export const mediumMap = {
  '1': 'BluRay',
  '2': 'UHD BluRay',
  '3': 'DVD',
  '4': 'CD',
  '5': 'HDTV',
  '6': 'WEB',
  '7': '其他'
}

/**
 * 获取分类名称
 * @param {string} categoryId - 分类ID
 * @returns {string} 分类名称
 */
export const getCategoryName = (categoryId) => {
  return categoryMap[categoryId] || `类别${categoryId}`
}

/**
 * 获取视频编码名称
 * @param {string} codecId - 编码ID
 * @returns {string} 编码名称
 */
export const getVideoCodecName = (codecId) => {
  return videoCodecMap[codecId] || `视频编码${codecId}`
}

/**
 * 获取音频编码名称
 * @param {string} codecId - 编码ID
 * @returns {string} 编码名称
 */
export const getAudioCodecName = (codecId) => {
  return audioCodecMap[codecId] || `音频编码${codecId}`
}

/**
 * 获取解析度名称
 * @param {string} standardId - 解析度ID
 * @returns {string} 解析度名称
 */
export const getStandardName = (standardId) => {
  return standardMap[standardId] || `解析度${standardId}`
}

/**
 * 获取国家/地区名称
 * @param {Array} countryIds - 国家ID数组
 * @returns {string} 国家名称，多个用逗号分隔
 */
export const getCountriesName = (countryIds) => {
  if (!Array.isArray(countryIds)) return ''
  return countryIds.map(id => countryMap[id] || `国家${id}`).join(', ')
}

/**
 * 获取制作组名称
 * @param {string} teamId - 制作组ID
 * @returns {string} 制作组名称
 */
export const getTeamName = (teamId) => {
  return teamMap[teamId] || `制作组${teamId}`
}

/**
 * 获取来源名称
 * @param {string} sourceId - 来源ID
 * @returns {string} 来源名称
 */
export const getSourceName = (sourceId) => {
  return sourceMap[sourceId] || `来源${sourceId}`
}

/**
 * 获取媒介名称
 * @param {string} mediumId - 媒介ID
 * @returns {string} 媒介名称
 */
export const getMediumName = (mediumId) => {
  return mediumMap[mediumId] || `媒介${mediumId}`
}