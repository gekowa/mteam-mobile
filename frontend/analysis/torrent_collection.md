# Torrent Collection API Analysis

## API Overview

Based on the HAR file analysis, the M-Team system uses a single endpoint to handle both collection and uncollection of torrents through the `make` parameter.

## API Specification

### POST /api/torrent/collection

**Summary:** User manages torrent collection status

**Description:** 
This API allows users to add or remove torrents from their collection. The same endpoint handles both collection and uncollection operations based on the `make` parameter value.

- When `make` is `true`, the torrent is added to the user's collection
- When `make` is `false`, the torrent is removed from the user's collection
- The API uses multipart/form-data content type
- Requires authentication via Authorization header
- Includes security parameters like timestamp and signature

**HTTP Method:** POST

**Content-Type:** multipart/form-data

**Headers:**
- `Authorization`: Bearer token (JWT)
- `ts`: Unix timestamp
- `visitorId`: Visitor identifier
- `version`: API version (e.g., "1.1.4")
- `webVersion`: Web version (e.g., "1140")
- `did`: Device identifier

**Request Body Parameters:**
- `id` (string, required): The torrent ID to collect/uncollect
- `make` (string, required): "true" to collect, "false" to uncollect
- `_timestamp` (string, required): Timestamp in milliseconds for security
- `_sgin` (string, required): Security signature

**Example Request (Collect torrent):**
```
Content-Type: multipart/form-data

------geckoformboundaryec13901b95df81b5c2779b188193d919
Content-Disposition: form-data; name="id"

1033919
------geckoformboundaryec13901b95df81b5c2779b188193d919
Content-Disposition: form-data; name="make"

true
------geckoformboundaryec13901b95df81b5c2779b188193d919
Content-Disposition: form-data; name="_timestamp"

1757930578458
------geckoformboundaryec13901b95df81b5c2779b188193d919
Content-Disposition: form-data; name="_sgin"

eFJWGRYuCl8COer268HmTrXbp1I=
------geckoformboundaryec13901b95df81b5c2779b188193d919--
```

**Example Request (Uncollect torrent):**
```
Content-Type: multipart/form-data

------geckoformboundaryf9e07f13ae48e92176546679d1699c24
Content-Disposition: form-data; name="id"

1033919
------geckoformboundaryf9e07f13ae48e92176546679d1699c24
Content-Disposition: form-data; name="make"

false
------geckoformboundaryf9e07f13ae48e92176546679d1699c24
Content-Disposition: form-data; name="_timestamp"

1757930580754
------geckoformboundaryf9e07f13ae48e92176546679d1699c24
Content-Disposition: form-data; name="_sgin"

OCo3xqvuVuyzypUT/OumN2zpKq0=
------geckoformboundaryf9e07f13ae48e92176546679d1699c24--
```

**Response:**

**Success Response (200 OK):**
```json
{
    "code": "0",
    "message": "SUCCESS",
    "data": null
}
```

**Response Fields:**
- `code`: Status code ("0" indicates success)
- `message`: Status message ("SUCCESS" for successful operations)
- `data`: Response data (null for this API)

## Usage Scenarios

1. **Collect Torrent**: Send POST request with `make: "true"` to add torrent to user's collection
2. **Uncollect Torrent**: Send POST request with `make: "false"` to remove torrent from user's collection

## Security Notes

- The API requires proper authentication via JWT token
- Includes timestamp and signature validation for request security
- All requests must include visitor ID and device ID for tracking
- CORS is enabled for the web frontend domain (https://kp.m-team.cc)