
# API: 搜索种子 (Torrent Search)

> [!TIP]
> 此 API 允许用户根据多种复杂的条件筛选和搜索种子资源。

## `POST /api/torrent/search`

+ **summary**: the user searches for torrents
+ **description**:
    ```
    此端点用于执行种子搜索。用户可以提供关键字、分类、编码格式、国家/地区、优惠状态等多种参数来精确查找种子。
    API支持分页，并可以指定排序字段和方向。
    ```

### Parameters

此 API 的参数主要通过 Request Body 以 JSON 格式传递，同时部分元数据和认证信息通过请求头(Header)传递。

#### Header Parameters

| Name          | In     | Type   | Required | Description                                                                                                |
|---------------|--------|--------|----------|------------------------------------------------------------------------------------------------------------|
| `authorization` | header | string | Yes      | 用户的认证令牌 (JWT Token)。                                                                               |
| `did`           | header | string | Yes      | 设备ID。                                                                                                   |
| `visitorId`     | header | string | Yes      | 访客ID。                                                                                                   |
| `version`       | header | string | Yes      | 前端应用的版本号, 例如: `1.1.4`。                                                                          |
| `webVersion`    | header | string | Yes      | 前端应用的数字版本号, 例如: `1140`。                                                                       |
| `ts`            | header | string | Yes      | 请求时间戳 (Unix timestamp)。                                                                              |

### Request Body

+ **Content-Type**: `application/json`

```json
{
  "type": "object",
  "required": [
    "mode",
    "visible",
    "pageNumber",
    "pageSize"
  ],
  "properties": {
    "mode": {
      "type": "string",
      "description": "搜索模式",
      "example": "normal"
    },
    "visible": {
      "type": "integer",
      "description": "是否可见，1表示可见",
      "example": 1
    },
    "keyword": {
      "type": "string",
      "description": "搜索关键字",
      "example": "剧情"
    },
    "categories": {
      "type": "array",
      "description": "分类ID列表",
      "items": {
        "type": "string"
      },
      "example": []
    },
    "videoCodecs": {
      "type": "array",
      "description": "视频编码ID列表",
      "items": {
        "type": "string"
      },
      "example": [
        "1",
        "16"
      ]
    },
    "audioCodecs": {
      "type": "array",
      "description": "音频编码ID列表",
      "items": {
        "type": "string"
      },
      "example": [
        "1"
      ]
    },
    "standards": {
      "type": "array",
      "description": "视频规格ID列表",
      "items": {
        "type": "string"
      },
      "example": [
        "1"
      ]
    },
    "countries": {
      "type": "array",
      "description": "国家/地区ID列表",
      "items": {
        "type": "string"
      },
      "example": [
        "2"
      ]
    },
    "teams": {
      "type": "array",
      "description": "制作组ID列表",
      "items": {
        "type": "string"
      },
      "example": [
        "9"
      ]
    },
    "labelsNew": {
      "type": "array",
      "description": "标签列表",
      "items": {
        "type": "string"
      },
      "example": [
        "中配"
      ]
    },
    "discount": {
      "type": "string",
      "description": "优惠类型",
      "enum": ["PERCENT_50", "PERCENT_30", "FREE", "PERCENT_100"],
      "example": "PERCENT_50"
    },
    "uploadDateStart": {
      "type": "string",
      "format": "date-time",
      "description": "上传日期开始时间",
      "example": "2025-09-01 00:00:00"
    },
    "uploadDateEnd": {
      "type": "string",
      "format": "date-time",
      "description": "上传日期结束时间",
      "example": "2025-10-31 00:00:00"
    },
    "sortDirection": {
      "type": "string",
      "description": "排序方向",
      "enum": ["ASC", "DESC"],
      "example": "DESC"
    },
    "sortField": {
      "type": "string",
      "description": "排序字段",
      "enum": ["NAME", "UPLOAD_DATE", "SIZE"],
      "example": "NAME"
    },
    "pageNumber": {
      "type": "integer",
      "description": "页码，从1开始",
      "example": 1
    },
    "pageSize": {
      "type": "integer",
      "description": "每页返回的记录数",
      "example": 100
    },
    "_timestamp": {
      "type": "integer",
      "description": "客户端生成的时间戳 (毫秒)",
      "example": 1757814475697
    },
    "_sgin": {
      "type": "string",
      "description": "客户端生成的请求签名",
      "example": "cr41Y1UuDYC0wOLiQV6YplJr/MM="
    }
  }
}
```

### Responses

#### `200 OK`

请求成功，返回分页的种子列表。

+ **Content-Type**: `application/json`

```json
{
  "type": "object",
  "properties": {
    "code": {
      "type": "string",
      "description": "状态码, '0' 表示成功",
      "example": "0"
    },
    "message": {
      "type": "string",
      "description": "状态信息",
      "example": "SUCCESS"
    },
    "data": {
      "type": "object",
      "properties": {
        "pageNumber": {
          "type": "string",
          "description": "当前页码",
          "example": "1"
        },
        "pageSize": {
          "type": "string",
          "description": "每页大小",
          "example": "100"
        },
        "total": {
          "type": "string",
          "description": "总记录数",
          "example": "0"
        },
        "totalPages": {
          "type": "string",
          "description": "总页数",
          "example": "0"
        },
        "data": {
          "type": "array",
          "description": "种子项目列表",
          "items": {
            "$ref": "#/components/schemas/Torrent"
          }
        }
      }
    }
  }
}
```

---

## Components

### Schemas

#### `Torrent`

> [!NOTE]
> `Torrent` 对象的具体字段需要一个包含实际数据的 HAR 文件才能确定。此处为一个基本结构示例。

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "description": "种子ID"
    },
    "name": {
      "type": "string",
      "description": "种子标题"
    },
    "category": {
      "type": "string",
      "description": "分类名称"
    },
    "size": {
      "type": "integer",
      "description": "文件大小 (bytes)"
    },
    "leecher": {
      "type": "integer",
      "description": "下载人数"
    },
    "seeder": {
      "type": "integer",
      "description": "做种人数"
    },
    "uploadDate": {
      "type": "string",
      "format": "date-time",
      "description": "上传日期"
    }
  }
}
```
