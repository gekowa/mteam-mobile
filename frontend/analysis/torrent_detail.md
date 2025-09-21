# M-Team 种子详细页面 API 分析

## 分析来源
- 《API取样文件》：frontend/analysis/samples/sample-torrent-detail.har
- 《本次分析重点页面》：种子详细页面 (torrent detail page, URL: /detail/{tid})

## API 端点概述

基于 HAR 文件分析，种子详细页面主要涉及以下 API 端点：

### 1. POST /api/torrent/detail
**Summary:** the user views torrent detail information.

**Description:** 
获取指定种子的详细信息，包括基本信息、状态、描述、媒体信息等完整数据。这是种子详细页面的核心API。

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Parameters:
  - id: 种子ID (例如: "1038109")
  - _timestamp: 请求时间戳 (例如: "1758438887228")
  - _sgin: 签名参数 (例如: "QfLW0Y0InpqoKfYCjS05thlKfjE=")

**Response:**
```json
{
  "code": "0",
  "message": "SUCCESS",
  "data": {
    "id": "1038109",
    "createdDate": "2025-09-21 14:44:50",
    "lastModifiedDate": "2025-09-21 14:44:58",
    "name": "Aftersun 2022 BluRay 1080p x264 DD 5.1 2Audio-MTeam",
    "smallDescr": "晒后假日 | 2022 | 剧情 | 夏洛特·威尔斯 | 保罗·麦斯卡 弗朗西斯卡·科里奥 西莉亚·罗森-豪尔 萨莉·梅瑟姆 艾斯·帕拉克",
    "imdb": "https://www.imdb.com/title/tt19770238/",
    "imdbRating": "7.6",
    "douban": "https://movie.douban.com/subject/35876302/",
    "doubanRating": "8.2",
    "dmmCode": "",
    "author": null,
    "category": "419",
    "source": null,
    "medium": null,
    "standard": "1",
    "videoCodec": "1",
    "audioCodec": "8",
    "team": "9",
    "processing": null,
    "countries": ["2", "12"],
    "numfiles": "1",
    "size": "15086119117",
    "labels": "0",
    "labelsNew": ["中字"],
    "msUp": "10",
    "anonymous": true,
    "infoHash": null,
    "status": {
      "id": "1038109",
      "createdDate": "2025-09-21 14:44:50",
      "lastModifiedDate": "2025-09-21 14:44:50",
      "pickType": "normal",
      "toppingLevel": "2",
      "toppingEndTime": "2025-09-22 02:44:50",
      "discount": "FREE",
      "discountEndTime": "2025-09-22 14:44:50",
      "timesCompleted": "0",
      "comments": "0",
      "lastAction": null,
      "lastSeederAction": null,
      "views": "0",
      "hits": "0",
      "support": "0",
      "oppose": "0",
      "status": "NORMAL",
      "seeders": "3",
      "leechers": "456",
      "banned": false,
      "visible": true,
      "promotionRule": null,
      "mallSingleFree": null
    },
    "dmmInfo": null,
    "editedBy": null,
    "editDate": null,
    "collection": false,
    "inRss": false,
    "canVote": false,
    "imageList": ["https://api.gateway996.com/api/media/redirect?seconds=1758437094&payload=uri%3Dhttps://m.media-amazon.com/images/M/MV5BZWU5Y2MyZjQtNGVjYi00ZDRkLTk1MGYtYmNlMzI0MTFmNDU2XkEyXkFqcGc@._V1_QL75_UX190_CR0,0,190,281_.jpg%26zone%3Dimdbv2img2&sign=13d481dcaeea84d53e5f984e01918807"],
    "resetBox": null,
    "originFileName": "Aftersun.2022.BluRay.1080p.x264.DD.5.1.2Audio-MTeam.torrent",
    "descr": "[img]https://api.gateway996.com/api/media/redirect?seconds=1758435029&payload=uri%3Dhttps://img1.doubanio.com/view/photo/m_ratio_poster/public/p2880990688.webp%26zone%3Ddoubanimg2&sign=108c80065b46b95e2e5453b8efa9edb9[/img]\r\n[quote]原盤來源：Aftersun 2022 1080p GBR Blu-ray AVC DTS-HD MA 5.1-PzD\r\n字母來源：原盤（英語）+ 字幕庫（中文）[/quote]\r\n[quote]画面处理：黑边裁剪，画面降噪，修复顶部底部坏线，部分暗场进行了额外的增噪，此外，在降噪后进行了一次小幅度的解块。\r\n音频处理：原盘DTS-HD MA 5.1 / 2.0 提取核心分别压制为DD5.1 / 2.0,\r\n字幕处理：保留原盘英文字幕，附加简繁(台)繁(港)SRT字幕。[/quote]\r\n◎译　　名　晒后假日/余晖时光/假日回响/日丽(台)/日丽追忆(港)\r\n◎片　　名　Aftersun\r\n◎年　　代　2022\r\n◎产　　地　英国,美国\r\n◎类　　别　剧情\r\n◎语　　言　英语\r\n◎上映日期　2022-05-21(戛纳电影节) / 2022-10-21(美国)\r\n◎IMDb评分  7.6/10 from 119946 users\r\n◎IMDb链接  https://www.imdb.com/title/tt19770238/\r\n◎豆瓣评分　8.2/10 from 122839 users\r\n◎豆瓣链接　https://movie.douban.com/subject/35876302/\r\n◎片　　长　101分钟\r\n◎导　　演　夏洛特·威尔斯 Charlotte Wells\r\n◎编　　剧　夏洛特·威尔斯 Charlotte Wells\r\n◎主　　演　保罗·麦斯卡 Paul Mescal\r\n　　　　  　弗朗西斯卡·科里奥 Francesca Corio\r\n　　　　  　西莉亚·罗森-豪尔 Celia Rowlson-Hall\r\n　　　　  　萨莉·梅瑟姆 Sally Messham\r\n　　　　  　艾斯·帕拉克 Ayse Parlak\r\n　　　　  　索菲亚·拉玛诺瓦 Sophia Lamanova\r\n　　　　  　布鲁克林·托尔森 Brooklyn Toulson\r\n　　　　  　斯派克·费恩 Spike Fearn\r\n　　　　  　弗兰克·科利奥 Frank Corio\r\n　　　　  　哈里·佩迪奥斯 Harry Perdios\r\n　　　　  　鲁比·汤普森 Ruby Thompson\r\n　　　　  　伊桑·史密斯 Ethan Smith\r\n　　　　  　奥努尔·埃克西奥卢 Onur Eksioglu\r\n　　　　  　卡菲尔·卡拉汉 Cafer Karahan\r\n　　　　  　凯蕾·科尔曼 Kayleigh Coleman\r\n\r\n◎简　　介\r\n\r\n　　影片是苏格兰出生的纽约作家兼导演夏洛特·威尔斯的长片电影首作。背景设定在1990年代尾声，故事随着一个充满好奇的11岁女孩苏菲（弗兰基·科里奥 饰）和她年轻的单身父亲（保罗·麦斯卡 饰）出发。两人一起前往土耳其度假，在那里发生的琐事看似平淡无奇，但那些一闪而过的对话，被说 出口的和没有说出口的，却刻划出为人父母与子女的感情，更透露双方如何在不知不觉中成为彼此的磐石。二十年后，当苏菲成长到当年出游时父亲的年纪，她回忆起十一岁的那年夏天的记忆碎片，在真实的影像和想象的回忆空间里，那个熟悉的贴心父亲逐渐显露出那年他不曾向女儿表露过的悲伤。\r\n\r\n◎获奖情况\r\n\r\n　　第95届奥斯卡金像奖  (2023)\r\n　　最佳男主角(提名) 保罗·麦斯卡\r\n　　\r\n　　第75届戛纳电影节  (2022)\r\n　　金摄影机奖(导演首作奖)(提名) 夏洛特·威尔斯\r\n　　影评人周单元影评人周单元大奖(提名) 夏洛特·威尔斯\r\n　　影评人周单元法国文创协会选择奖 夏洛特·威尔斯\r\n　　\r\n　　第76届英国电影学院奖  (2023)\r\n　　电影奖最佳英国影片(提名) 夏洛特·威尔斯\r\n　　电影奖最佳男主角(提名) 保罗·麦斯卡\r\n　　电影奖最佳选角(提名)\r\n　　电影奖杰出新人奖 夏洛特·威尔斯\r\n　　\r\n　　第35届欧洲电影奖  (2022)\r\n　　最佳男主角(提名) 保罗·麦斯卡\r\n　　\r\n　　第38届西班牙戈雅奖  (2024)\r\n　　最佳欧洲电影(提名)\r\n　　\r\n　　第75届美国导演工会奖  (2023)\r\n　　最佳新人导演奖 夏洛特·威尔斯\r\n　　\r\n　　第28届美国评论家选择电影奖  (2023)\r\n　　最佳男主角(提名) 保罗·麦斯卡\r\n　　最佳青少年演员(提名) 弗朗西斯卡·科里奥\r\n　　最佳原创剧本(提名) 夏洛特·威尔斯\r\n　　\r\n　　第38届美国独立精神奖  (2023)\r\n　　最佳处女作\r\n　　最佳主角(提名) 保罗·麦斯卡\r\n　　最佳摄影(提名) 格雷戈里·奥凯\r\n　　最佳剪辑(提名)\r\n　　\r\n　　第25届英国独立电影奖  (2022)\r\n　　最佳英国独立电影\r\n　　最佳导演 夏洛特·威尔斯\r\n　　最佳编剧 夏洛特·威尔斯\r\n　　最佳新人导演 夏洛特·威尔斯\r\n　　最佳新人编剧(提名) 夏洛特·威尔斯\r\n　　最佳联合主演(提名) 弗朗西斯卡·科里奥 / 保罗·麦斯卡\r\n　　突破表演(提名) 弗朗西斯卡·科里奥\r\n　　最佳选角(提名)\r\n　　最佳摄影\r\n　　最佳剪辑\r\n　　最佳艺术指导(提名)\r\n　　最佳服装设计(提名)\r\n　　最佳化妆与发型设计(提名)\r\n　　最佳音乐(提名)\r\n　　最佳音乐监督\r\n　　最佳音效(提名)\r\n　　\r\n　　第32届哥谭独立电影奖  (2022)\r\n　　最佳影片(提名)\r\n　　最佳突破导演奖 夏洛特·威尔斯\r\n　　最佳主角演出(提名) 保罗·麦斯卡\r\n　　年度突破演员(提名) 弗朗西斯卡·科里奥\r\n　　\r\n　　第4届海南岛国际电影节  (2022)\r\n　　金椰奖最佳影片奖(提名) 夏洛特·威尔斯\r\n　　金椰奖评委会大奖 夏洛特·威尔斯\r\n[quote]---------------影片信息---------------\r\n制作组：MTeam\r\n影片名：Aftersun.2022.BluRay.1080p.x264.DD.5.1.2Audio-MTeam.mkv\r\n体    积：14.05 GB\r\n片    源：Aftersun 2022 1080p GBR Blu-ray AVC DTS-HD MA 5.1-PzD\r\n时    长：01:41:37(HH:MM:SS)\r\n帧    率：24.000 FPS\r\n分辨率：1920 x 1 036\r\n视    频：x264 @ 19.0 Mbps\r\n音    频：DD 5.1 @ 640 Kbps (英语)(Default)\r\n              DD 2.0 @ 192 Kbps (英语)\r\n字    幕：简体中文SRT\r\n              繁體中文SRT\r\n              繁體中文SRT\r\n              英语SUP\r\n压    制：L4O8@MTeam\r\n-----------------------------------------[/quote]\r\n[img]https://img.seedvault.cn/i/2025/09/21/watermarked68cf9a65ef2f8275.jpg[/img]",
    "nfo": null,
    "mediainfo": "General\r\nUnique ID                                : 31190521060496900880722001604650933458 (0x1777136AD97DEFD466AD269AF6BB1CD2)\r\nComplete name                            : H:\\Aftersun.2022.BluRay.1080p.x264.DD.5.1.2Audio-MTeam\\Aftersun.2022.BluRay.1080p.x264.DD.5.1.2Audio-MTeam.mkv\r\nFormat                                   : Matroska\r\nFormat version                           : Version 4\r\nFile size                                : 14.1 GiB\r\nDuration                                 : 1 h 41 min\r\nOverall bit rate                         : 19.8 Mb/s\r\nFrame rate                               : 24.000 FPS\r\nMovie name                               : Aftersun (2020) L4O8@MTeam\r\nEncoded date                             : 2025-09-20 14:04:41 UTC\r\nWriting application                      : mkvmerge v92.0 ('Everglow') 64-bit\r\nWriting library                          : libebml v1.4.5 + libmatroska v1.7.1\r\n\r\nVideo\r\nID                                       : 1\r\nFormat                                   : AVC\r\nFormat/Info                              : Advanced Video Codec\r\nFormat profile                           : High@L4.1\r\nFormat settings                          : CABAC / 4 Ref Frames\r\nFormat settings, CABAC                   : Yes\r\nFormat settings, Reference frames        : 4 frames\r\nCodec ID                                 : V_MPEG4/ISO/AVC\r\nDuration                                 : 1 h 41 min\r\nBit rate                                 : 19.0 Mb/s\r\nWidth                                    : 1 920 pixels\r\nHeight                                   : 1 036 pixels\r\nDisplay aspect ratio                     : 1.85:1\r\nFrame rate mode                          : Constant\r\nFrame rate                               : 24.000 FPS\r\nColor space                              : YUV\r\nChroma subsampling                       : 4:2:0 (Type 1)\r\nBit depth                                : 8 bits\r\nScan type                                : Progressive\r\nBits/(Pixel*Frame)                       : 0.397\r\nStream size                              : 13.5 GiB (96%)\r\nWriting library                          : x264 core 165 r3215 32c3b80\r\nEncoding settings                        : cabac=1 / ref=4 / deblock=1:1:-3 / analyse=0x3:0x133 / me=umh / subme=10 / psy=1 / psy_rd=1.00:0.15 / mixed_ref=1 / me_range=64 / chroma_me=1 / trellis=2 / 8x8dct=1 / cqm=0 / deadzone=21,11 / fast_pskip=0 / chroma_qp_offset=-5 / threads=24 / lookahead_threads=4 / sliced_threads=0 / nr=0 / decimate=1 / interlaced=0 / bluray_compat=0 / constrained_intra=0 / bframes=8 / b_pyramid=2 / b_adapt=2 / b_bias=0 / direct=3 / weightb=1 / open_gop=0 / weightp=2 / keyint=250 / keyint_min=23 / scenecut=40 / intra_refresh=0 / rc_lookahead=60 / rc=crf / mbtree=0 / crf=16.8 / qcomp=0.60 / qpmin=0 / qpmax=69 / qpstep=4 / vbv_maxrate=32000 / vbv_bufsize=16000 / crf_max=0.0 / nal_hrd=none / filler=0 / ip_ratio=1.40 / pb_ratio=1.30 / aq=1:1.00\r\nDefault                                  : Yes\r\nForced                                   : No\r\n\r\nAudio #1\r\nID                                       : 2\r\nFormat                                   : AC-3\r\nFormat/Info                              : Audio Coding 3\r\nCommercial name                          : Dolby Digital\r\nCodec ID                                 : A_AC3\r\nDuration                                 : 1 h 41 min\r\nBit rate mode                            : Constant\r\nBit rate                                 : 640 kb/s\r\nChannel(s)                               : 6 channels\r\nChannel layout                           : L R C LFE Ls Rs\r\nSampling rate                            : 48.0 kHz\r\nFrame rate                               : 31.250 FPS (1536 SPF)\r\nCompression mode                         : Lossy\r\nStream size                              : 465 MiB (3%)\r\nTitle                                    : 英语\r\nLanguage                                 : English\r\nService kind                             : Complete Main\r\nDefault                                  : Yes\r\nForced                                   : No\r\nDialog Normalization                     : -31 dB\r\ncmixlev                                  : -4.5 dB\r\nsurmixlev                                : -6 dB\r\ndialnorm_Average                         : -31 dB\r\ndialnorm_Minimum                         : -31 dB\r\ndialnorm_Maximum                         : -31 dB\r\n\r\nAudio #2\r\nID                                       : 3\r\nFormat                                   : AC-3\r\nFormat/Info                              : Audio Coding 3\r\nCommercial name                          : Dolby Digital\r\nCodec ID                                 : A_AC3\r\nDuration                                 : 1 h 41 min\r\nBit rate mode                            : Constant\r\nBit rate                                 : 192 kb/s\r\nChannel(s)                               : 2 channels\r\nChannel layout                           : L R\r\nSampling rate                            : 48.0 kHz\r\nFrame rate                               : 31.250 FPS (1536 SPF)\r\nCompression mode                         : Lossy\r\nStream size                              : 140 MiB (1%)\r\nTitle                                    : 英语\r\nLanguage                                 : English\r\nService kind                             : Complete Main\r\nDefault                                  : No\r\nForced                                   : No\r\nDialog Normalization                     : -31 dB\r\ndialnorm_Average                         : -31 dB\r\ndialnorm_Minimum                         : -31 dB\r\ndialnorm_Maximum                         : -31 dB\r\n\r\nText #1\r\nID                                       : 4\r\nFormat                                   : UTF-8\r\nCodec ID                                 : S_TEXT/UTF8\r\nCodec ID/Info                            : UTF-8 Plain Text\r\nDuration                                 : 1 h 33 min\r\nBit rate                                 : 22 b/s\r\nFrame rate                               : 0.138 FPS\r\nCount of elements                        : 778\r\nStream size                              : 15.7 KiB (0%)\r\nTitle                                    : 简体中文\r\nLanguage                                 : Chinese-Hans-CN\r\nDefault                                  : Yes\r\nForced                                   : No\r\n\r\nText #2\r\nID                                       : 5\r\nFormat                                   : UTF-8\r\nCodec ID                                 : S_TEXT/UTF8\r\nCodec ID/Info                            : UTF-8 Plain Text\r\nDuration                                 : 1 h 33 min\r\nBit rate                                 : 22 b/s\r\nFrame rate                               : 0.138 FPS\r\nCount of elements                        : 778\r\nStream size                              : 15.7 KiB (0%)\r\nTitle                                    : 繁體中文\r\nLanguage                                 : Chinese-Hant-TW\r\nDefault                                  : Yes\r\nForced                                   : No\r\n\r\nText #3\r\nID                                       : 6\r\nFormat                                   : UTF-8\r\nCodec ID                                 : S_TEXT/UTF8\r\nCodec ID/Info                            : UTF-8 Plain Text\r\nDuration                                 : 1 h 33 min\r\nBit rate                                 : 22 b/s\r\nFrame rate                               : 0.146 FPS\r\nCount of elements                        : 824\r\nStream size                              : 15.5 KiB (0%)\r\nTitle                                    : 繁體中文\r\nLanguage                                 : Chinese-Hant-HK\r\nDefault                                  : Yes\r\nForced                                   : No\r\n\r\nText #4\r\nID                                       : 7\r\nID in the original source medium         : 4608 (0x1200)\r\nFormat                                   : PGS\r\nMuxing mode                              : zlib\r\nCodec ID                                 : S_HDMV/PGS\r\nCodec ID/Info                            : Picture based subtitle format used on BDs/HD-DVDs\r\nDuration                                 : 1 h 31 min\r\nBit rate                                 : 16.0 kb/s\r\nFrame rate                               : 0.294 FPS\r\nCount of elements                        : 1619\r\nStream size                              : 10.5 MiB (0%)\r\nTitle                                    : 英语\r\nLanguage                                 : English\r\nDefault                                  : Yes\r\nForced                                   : No\r\nOriginal source medium                   : Blu-ray\r\n\r\nMenu\r\n00:00:00.000                             : en:第 01 章\r\n00:10:38.583                             : en:第 02 章\r\n00:17:38.958                             : en:第 03 章\r\n00:29:33.416                             : en:第 04 章\r\n00:38:31.458                             : en:第 05 章\r\n00:47:20.791                             : en:第 06 章\r\n00:57:56.583                             : en:第 07 章\r\n01:08:31.666                             : en:第 08 章\r\n01:16:26.375                             : en:第 09 章\r\n01:27:57.833                             : en:第 10 章\r\n01:35:23.250                             : en:第 11 章",
    "cids": null,
    "aids": null,
    "scope": "NORMAL",
    "scopeTeams": null,
    "thanked": false,
    "rewarded": false,
    "albumList": null
  }
}
```

### 2. POST /api/torrent/viewHits
**Summary:** the user tracks torrent page view.

**Description:** 
记录用户对种子详细页面的访问次数，用于统计热度和访问量。每次访问种子详细页面时会调用此API。

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Parameters:
  - id: 种子ID (例如: "1038109")
  - _timestamp: 请求时间戳 (例如: "1758438887948")
  - _sgin: 签名参数 (例如: "aKsVT9sQZBKkRkctjzSYKfMkKK8=")

**Response:**
```json
{
  "code": "0",
  "message": "SUCCESS",
  "data": null
}
```

### 3. POST /api/torrent/rewardStatus
**Summary:** the user checks torrent reward status.

**Description:** 
获取指定种子的奖励状态信息，包括是否已设置奖励、奖励类型等。用于在种子详细页面显示奖励相关信息。

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Parameters:
  - id: 种子ID (例如: "1038109")
  - _timestamp: 请求时间戳
  - _sgin: 签名参数

**Response:**
基于HAR文件分析，此API返回奖励状态相关信息。

### 4. POST /api/torrent/thanksStatus
**Summary:** the user checks torrent thanks status.

**Description:** 
获取指定种子的感谢状态信息，包括是否已感谢、感谢数量等。用于在种子详细页面显示感谢相关信息。

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Parameters:
  - id: 种子ID (例如: "1038109")
  - _timestamp: 请求时间戳
  - _sgin: 签名参数

**Response:**
基于HAR文件分析，此API返回感谢状态相关信息。

### 5. POST /api/subtitle/list
**Summary:** the user fetches subtitle list for torrent.

**Description:** 
获取指定种子的字幕列表，包括各种语言的字幕文件信息。这些字幕可供用户下载使用。

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Parameters:
  - id: 种子ID (例如: "1038109")
  - _timestamp: 请求时间戳
  - _sgin: 签名参数

**Response:**
```json
{
  "code": "0",
  "message": "SUCCESS",
  "data": [
    {
      "id": "52094",
      "createdDate": "2023-03-01 20:34:12",
      "lastModifiedDate": "2025-09-21 14:47:21",
      "torrent": "657646",
      "name": "Aftersun.2022.GBR.BluRay.1080p.x264.DDP5.1-HDChina",
      "filename": "Aftersun.2022.GBR.BluRay.1080p.x264.DDP5.1-HDChina.SRT",
      "savePath": "subtitle/old/657646/52094.srt",
      "size": "63032",
      "lang": "25",
      "author": null,
      "anonymous": true,
      "hits": "75",
      "ext": "srt"
    },
    {
      "id": "51470",
      "createdDate": "2022-12-21 10:29:39",
      "lastModifiedDate": "2024-09-08 01:06:28",
      "torrent": "619088",
      "name": "Aftersun.2022.PROPER.1080p.WEBRip.x265-RARBG",
      "filename": "Aftersun.2022.PROPER.1080p.WEBRip.x265-RARBG.SSA",
      "savePath": "subtitle/old/619088/51470.ssa",
      "size": "63860",
      "lang": "25",
      "author": null,
      "anonymous": true,
      "hits": "65",
      "ext": "ssa"
    },
    {
      "id": "51469",
      "createdDate": "2022-12-21 10:29:29",
      "lastModifiedDate": "2022-12-21 10:29:29",
      "torrent": "619088",
      "name": "Aftersun.2022.PROPER.1080p.WEBRip.x265-RARBG",
      "filename": "Aftersun.2022.PROPER.1080p.WEBRip.x265-RARBG.SRT",
      "savePath": "subtitle/old/619088/51469.srt",
      "size": "63032",
      "lang": "25",
      "author": null,
      "anonymous": true,
      "hits": "119",
      "ext": "srt"
    },
    {
      "id": "51053",
      "createdDate": "2022-10-19 20:05:42",
      "lastModifiedDate": "2022-10-19 20:05:42",
      "torrent": "619088",
      "name": "Aftersun.2022.1080p.WEBRip.AAC2.0.x264-NOGRP.chs",
      "filename": "Aftersun.2022.1080p.WEBRip.AAC2.0.x264-NOGRP.chs.srt",
      "savePath": "subtitle/old/619088/51053.srt",
      "size": "49487",
      "lang": "25",
      "author": null,
      "anonymous": true,
      "hits": "264",
      "ext": "srt"
    }
  ]
}
```

### 6. POST /api/comment/fetchList
**Summary:** the user fetches torrent comment list.

**Description:** 
获取指定种子的评论列表，包括用户评论内容、时间、作者信息等。用于在种子详细页面显示评论区域。

**Request:**
- Method: POST
- Content-Type: application/json
- Parameters:
  - 基于HAR文件，此API使用JSON格式请求体，包含种子ID和分页参数

**Response:**
基于HAR文件分析，此API返回评论列表数据。

### 7. POST /api/media/douban/infoV2
**Summary:** the user fetches douban media information.

**Description:** 
获取豆瓣媒体信息，用于在种子详细页面显示豆瓣相关的电影/电视剧信息，包括评分、简介、演员等详细信息。

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Parameters:
  - code: 豆瓣链接 (例如: "https://movie.douban.com/subject/35876302/")
  - _timestamp: 请求时间戳 (例如: "1758438888023")
  - _sgin: 签名参数 (例如: "iG1uoer1Y8ORApo2lYv52xU/ePA=")

**Response:**
```json
{
  "code": "0",
  "message": "SUCCESS",
  "data": {
    "subjectId": "35876302",
    "imdbId": "tt19770238",
    "type": "movie",
    "title": "晒后假日",
    "coverUrl": "https://api.gateway996.com/api/media/redirect?seconds=1758435029&payload=uri%3Dhttps://img1.doubanio.com/view/photo/m_ratio_poster/public/p2880990688.webp%26zone%3Ddoubanimg2&sign=108c80065b46b95e2e5453b8efa9edb9",
    "subtitle": "2022 / 英国 美国 / 剧情 / 夏洛特·威尔斯 / 保罗·麦斯卡 弗朗西斯卡·科里奥",
    "tags": [],
    "score": "8.2",
    "rating": {
      "count": "118505",
      "max": "10",
      "starCount": "4.0",
      "value": "8.2"
    },
    "pubdate": ["2022-05-21(戛纳电影节)"],
    "intro": "影片是苏格兰出生的纽约作家兼导演夏洛特·威尔斯的电影处女作。背景设定在1990年代尾声，故事随着一个充满好奇的11岁女孩苏菲（弗兰基·科里奥 饰）和她年轻的单身父亲（保罗·麦斯卡 饰）出发。两人一起前往土耳其度假，在那里发生的琐事看似平淡无奇，但那些一闪而过的对话，被说出口的和没有说出口的，却刻划出为人父母与子女的感情，更透露双方如何在不知不觉中成为彼此的磐石。二十年后，当苏菲成长到当年出游时父亲的年纪，她回忆起十一岁的那年夏天的记忆碎片，在真实的影像和想象的回忆空间里，那个熟悉的贴心父亲逐渐显露出那年他不曾向女儿表露过的悲伤。",
    "format": "[img]https://img1.doubanio.com/view/photo/m_ratio_poster/public/p2880990688.webp[/img]\\n\\n◎译　　名　日丽(台)/日丽追忆(港)/假日回响\\n◎片　　名　晒后假日\\n◎年　　代　2022\\n◎产　　地　英国,美国\\n◎类　　别　剧情\\n◎语　　言　英语\\n◎上映日期　2022-05-21(戛纳电影节)\\n◎片　　长　101分钟\\n◎简　　介　\\n\\n影片是苏格兰出生的纽约作家兼导演夏洛特·威尔斯的电影处女作。背景设定在1990年代尾声，故事随着一个充满好奇的11岁女孩苏菲（弗兰基·科里奥 饰）和她年轻的单身父亲（保罗·麦斯卡 饰）出发。两人一起前往土耳其度假，在那里发生的琐事看似平淡无奇，但那些一闪而过的对话，被说出口的和没有说出口的，却刻划出为人父母与子女的感情，更透露双方如何在不知不觉中成为彼此的磐石。二十年后，当苏菲成长到当年出游时父亲的年纪，她回忆起十一岁的那年夏天的记忆碎片，在真实的影像和想象的回忆空间里，那个熟悉的贴心父亲逐渐显露出那年他不曾向女儿表露过的悲伤。",
    "originalTitle": "Aftersun",
    "aka": ["日丽(台)", "日丽追忆(港)", "假日回响"],
    "year": "2022",
    "languages": ["英语"],
    "genres": ["剧情"],
    "durations": ["101分钟"],
    "countries": ["英国", "美国"],
    "directors": [
      {
        "subjectId": "35876994",
        "imdbId": "nm3834799",
        "name": "夏洛特·威尔斯",
        "latinName": "Charlotte Wells",
        "coverUrl": "https://api.gateway996.com/api/media/redirect?seconds=1758435029&payload=uri%3Dhttps://img3.doubanio.com/view/personage/l/public/df24d59fbe0977839551799d69d8aa83.jpg%26zone%3Ddoubanimg2&sign=20e973ed7a3b0acce2f5770975d28c27",
        "title": "夏洛特·威尔斯（同名）苏格兰影视演员",
        "character": "导演"
      }
    ],
    "actors": [
      {
        "subjectId": "34428934",
        "imdbId": "nm8958770",
        "name": "保罗·麦斯卡",
        "latinName": "Paul Mescal",
        "coverUrl": "https://api.gateway996.com/api/media/redirect?seconds=1758435029&payload=uri%3Dhttps://img1.doubanio.com/view/personage/m/public/4ad1976620e337c786e2c205e88c8670.jpg%26zone%3Ddoubanimg2&sign=3f2561969d9b2322a81e1f23dab993a4",
        "title": "保罗·麦斯卡（同名）爱尔兰,梅努斯影视演员",
        "character": "饰 Calum"
      },
      {
        "subjectId": "35909463",
        "imdbId": "nm13592008",
        "name": "弗朗西斯卡·科里奥",
        "latinName": "Francesca Corio",
        "coverUrl": "https://api.gateway996.com/api/media/redirect?seconds=1758435029&payload=uri%3Dhttps://img1.doubanio.com/view/personage/l/public/ab4df9e07b7ee502148e6f6ee633e62d.jpg%26zone%3Ddoubanimg2&sign=64aa43f47a8c67d6263291c6b3bd2f5f",
        "title": "弗朗西斯卡·科里奥（同名）",
        "character": "饰 Sophie"
      }
    ]
  }
}
```

## 支持性 API 端点

除了核心的种子详细信息API外，种子详细页面还调用了以下支持性API：

### 8. POST /api/member/profile
**Summary:** the user fetches member profile information.

**Description:** 
获取当前登录用户的个人资料信息。

### 9. POST /api/system/sysConf
**Summary:** the user fetches system configuration.

**Description:** 
获取系统配置信息，用于页面的基本设置和显示控制。

### 10. POST /api/member/updateLastBrowse
**Summary:** the user updates last browse time.

**Description:** 
更新用户最后浏览时间，用于记录用户活动状态。

## API 调用特点

1. **认证机制**: 所有API都需要authorization header进行身份验证
2. **请求格式**: 大多数API使用multipart/form-data格式，但comment相关API使用application/json
3. **签名验证**: 所有请求都包含_timestamp和_sgin参数用于请求签名验证
4. **响应格式**: 所有API都返回统一的JSON格式，包含code、message和data字段
5. **跨域支持**: API支持CORS，允许来自kp.m-team.cc的跨域请求

## 页面加载流程

根据HAR文件分析，种子详细页面的API调用顺序大致为：
1. 系统配置和用户信息获取（sysConf, profile等）
2. 种子详细信息获取（torrent/detail）
3. 访问量统计（torrent/viewHits）
4. 状态信息获取（rewardStatus, thanksStatus）
5. 相关资源获取（subtitle/list, comment/fetchList, media/douban/infoV2）
6. 用户活动更新（updateLastBrowse）