POST /torrent/search
Content-Type: application/json
`{"mode":"movie","visible":1,"categories":[],"pageNumber":1,"pageSize":100}`
Response:

```json
{
    "code": "0",
    "message": "SUCCESS",
    "data": {
        "pageNumber": "1",
        "pageSize": "100",
        "total": "10000",
        "totalPages": "100",
        "data": [
            {
                "id": "1019628",
                "createdDate": "2025-08-19 20:57:29",
                "lastModifiedDate": "2025-08-19 20:57:34",
                "name": "The Conjuring 2013 UHD BluRay 2160p HEVC DTS-HD MA5.1-MTeam",
                "smallDescr": "招魂/诡屋惊凶实录(港)/厉阴宅(台)",
                "imdb": "",
                "imdbRating": null,
                "douban": "https://movie.douban.com/subject/3804629/",
                "doubanRating": "8.1",
                "dmmCode": "",
                "author": null,
                "category": "421",
                "source": null,
                "medium": null,
                "standard": "6",
                "videoCodec": "16",
                "audioCodec": "11",
                "team": "9",
                "processing": null,
                "countries": [
                    "2"
                ],
                "numfiles": "1",
                "size": "61949018112",
                "labels": "0",
                "labelsNew": [
                    "中字",
                    "4k",
                    "hdr",
                    "hdr10"
                ],
                "msUp": "10",
                "anonymous": true,
                "infoHash": null,
                "status": {
                    "id": "1019628",
                    "createdDate": "2025-08-19 20:57:29",
                    "lastModifiedDate": "2025-08-20 00:10:15",
                    "pickType": "normal",
                    "toppingLevel": "2",
                    "toppingEndTime": "2025-08-29 20:57:29",
                    "discount": "FREE",
                    "discountEndTime": "2025-08-20 20:57:29",
                    "timesCompleted": "0",
                    "comments": "0",
                    "lastAction": "2025-08-20 00:01:58",
                    "lastSeederAction": "2025-08-19 23:36:06",
                    "views": "226",
                    "hits": "0",
                    "support": "0",
                    "oppose": "0",
                    "status": "NORMAL",
                    "seeders": "1",
                    "leechers": "498",
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
                "imageList": [
                    "https://api.gateway996.com/api/media/redirect?seconds=1755608253&payload=uri%3Dhttps://img3.doubanio.com/view/photo/m_ratio_poster/public/p1936517673.webp%26zone%3Ddoubanimg2&sign=d330b1c70a9a3ff25ccad1b6221c6488"
                ],
                "resetBox": null
            },
            {
                "id": "1019301",
                "createdDate": "2025-08-19 08:06:13",
                "lastModifiedDate": "2025-08-19 08:08:43",
                "name": "The Happening 2008 BluRay 1080p x264 DTS-HD MA 5.1-MTeam",
                "smallDescr": "灭顶之灾/破天·慌/破．天．慌/破天荒丨原盘繁體中文字幕",
                "imdb": "https://www.imdb.com/title/tt0949731/",
                "imdbRating": "5",
                "douban": "https://movie.douban.com/subject/2073674/",
                "doubanRating": "6.1",
                "dmmCode": "",
                "author": null,
                "category": "419",
                "source": null,
                "medium": null,
                "standard": "1",
                "videoCodec": "1",
                "audioCodec": "11",
                "team": "9",
                "processing": null,
                "countries": [
                    "2",
                    "70",
                    "6"
                ],
                "numfiles": "1",
                "size": "10888317056",
                "labels": "0",
                "labelsNew": [
                    "中字"
                ],
                "msUp": "10",
                "anonymous": true,
                "infoHash": null,
                "status": {
                    "id": "1019301",
                    "createdDate": "2025-08-19 08:06:13",
                    "lastModifiedDate": "2025-08-20 00:10:13",
                    "pickType": "normal",
                    "toppingLevel": "0",
                    "toppingEndTime": null,
                    "discount": "FREE",
                    "discountEndTime": "2025-08-20 08:06:13",
                    "timesCompleted": "1004",
                    "comments": "0",
                    "lastAction": "2025-08-20 00:02:06",
                    "lastSeederAction": "2025-08-20 00:02:06",
                    "views": "535",
                    "hits": "0",
                    "support": "0",
                    "oppose": "0",
                    "status": "NORMAL",
                    "seeders": "501",
                    "leechers": "6",
                    "banned": false,
                    "visible": true,
                    "promotionRule": null,
                    "mallSingleFree": null
                },
                "dmmInfo": null,
                "editedBy": null,
                "editDate": "2025-08-19 08:08:39",
                "collection": false,
                "inRss": false,
                "canVote": false,
                "imageList": [
                    "https://api.gateway996.com/api/media/redirect?seconds=1755561979&payload=uri%3Dhttps://m.media-amazon.com/images/M/MV5BMTc2MjcwNjI0MF5BMl5BanBnXkFtZTcwMjM4NjM3MQ@@._V1_QL75_UY281_CR0,0,190,281_.jpg%26zone%3Dimdbv2img2&sign=b623541dfaf7f3d3d9fb7b1211405faf"
                ],
                "resetBox": null
            }
        ]
    }
}
```