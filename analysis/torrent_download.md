# Torrent Download API Analysis

## Overview
Analysis of API calls captured from torrent detail page (`/detail/{tid}`) related to torrent download functionality.

## API Endpoints

### Generate Download Token

**Endpoint:** `POST /api/torrent/genDlToken`

**Summary:** Generate download token for torrent

**Description:** 
This API generates a signed download URL token for a specific torrent. The user requests a download token by providing the torrent ID, timestamp, and signature. The system returns a time-limited, signed download URL that can be used to download the torrent file.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Headers:
  - `authorization`: JWT token for authentication
  - `ts`: Timestamp
  - `visitorId`: Unique visitor identifier
  - `version`: API version
  - `webVersion`: Web client version
  - `did`: Device identifier

**Request Body (form-data):**
```
id: 1038109
_timestamp: 1758871869045
_sgin: f2KjAOiIL0JuUd/3lNYvxisu5mE=
```

**Response:**
```json
{
  "code": "0",
  "message": "SUCCESS",
  "data": "https://api.m-team.cc/api/rss/dlv2?sign=45dded6c721ef81671aca3bd5deb1671&t=1758871871&tid=1038109&uid=175643"
}
```

**Response Fields:**
- `code`: Status code ("0" for success)
- `message`: Status message 
- `data`: Signed download URL with parameters:
  - `sign`: Download signature
  - `t`: Timestamp
  - `tid`: Torrent ID
  - `uid`: User ID

## OpenAPI Specification

```yaml
openapi: 3.0.0
info:
  title: M-Team Torrent Download API
  version: 1.0.0
  description: API for generating torrent download tokens

paths:
  /api/torrent/genDlToken:
    post:
      summary: Generate download token for torrent
      description: |
        This API generates a signed download URL token for a specific torrent. 
        The user requests a download token by providing the torrent ID, timestamp, 
        and signature. The system returns a time-limited, signed download URL 
        that can be used to download the torrent file.
      parameters:
        - name: authorization
          in: header
          required: true
          schema:
            type: string
          description: JWT authentication token
        - name: ts
          in: header
          required: true
          schema:
            type: string
          description: Timestamp
        - name: visitorId
          in: header
          required: true
          schema:
            type: string
          description: Unique visitor identifier
        - name: version
          in: header
          required: true
          schema:
            type: string
          description: API version
        - name: webVersion
          in: header
          required: true
          schema:
            type: string
          description: Web client version
        - name: did
          in: header
          required: true
          schema:
            type: string
          description: Device identifier
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                id:
                  type: string
                  description: Torrent ID
                  example: "1038109"
                _timestamp:
                  type: string
                  description: Request timestamp
                  example: "1758871869045"
                _sgin:
                  type: string
                  description: Request signature
                  example: "f2KjAOiIL0JuUd/3lNYvxisu5mE="
              required:
                - id
                - _timestamp
                - _sgin
      responses:
        '200':
          description: Download token generated successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: string
                    description: Status code
                    example: "0"
                  message:
                    type: string
                    description: Status message
                    example: "SUCCESS"
                  data:
                    type: string
                    description: Signed download URL
                    example: "https://api.m-team.cc/api/rss/dlv2?sign=45dded6c721ef81671aca3bd5deb1671&t=1758871871&tid=1038109&uid=175643"
                required:
                  - code
                  - message
                  - data

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - BearerAuth: []
```