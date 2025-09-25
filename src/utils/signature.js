// M-Team API 签名实现
// 基于原始混淆代码提取的算法

// 临时使用crypto-js验证逻辑，然后再替换为自定义实现
import CryptoJS from 'crypto-js'

export const env = {
  server: "https://api.m-team.cc/api",
  langDefault: "cht",
  turnstile: "0x4AAAAAAAGmQlZPus1Y93sD",
  version: "1.1.4",
  secret: "HLkPcWmycL57mfJt",
  imgApi: {
    url: "https://img.m-team.cc/api/1/upload",
    key: "chv_R_69c9b8590fa411662aecfa580ef6553fedafce215c569b7cadb0fca08e4966b9a7b29272798af37a7d1e45a8984d223179bbc926d814c4fe1c1d2753f362b1b0",
  },
};

// 实现自定义的HMAC-SHA1算法
const g = {
  HMAC: {
    init: function(hashFunction, key) {
      this.hashFunction = hashFunction;
      this.key = key;
      return this;
    },
    finalize: function(message) {
      return hmacSHA1(message, this.key);
    }
  }
};

// SHA-1实现
function sha1(message) {
  function rotateLeft(n, s) {
    return (n << s) | (n >>> (32 - s));
  }

  function cvtHex(val) {
    let str = "";
    for (let i = 7; i >= 0; i--) {
      const v = (val >>> (i * 4)) & 0x0f;
      str += v.toString(16);
    }
    return str;
  }

  function utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    let utftext = "";
    for (let n = 0; n < string.length; n++) {
      const c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }

  const msgLength = message.length;
  const msg = utf8Encode(message);
  const msgArray = [];
  
  for (let i = 0; i < msg.length; i++) {
    msgArray[i] = msg.charCodeAt(i) & 0xFF;
  }

  // Pre-processing: adding a single 1 bit
  msgArray[msgLength] = 0x80;

  // Pre-processing: padding with zeros
  while ((msgArray.length % 64) !== 56) {
    msgArray.push(0x00);
  }

  // Append original length in bits mod 2^64 to message
  const msgLengthBits = msgLength * 8;
  for (let i = 0; i < 8; i++) {
    msgArray.push((msgLengthBits >>> (7 - i) * 8) & 0xFF);
  }

  // Initialize hash value
  let h0 = 0x67452301;
  let h1 = 0xEFCDAB89;
  let h2 = 0x98BADCFE;
  let h3 = 0x10325476;
  let h4 = 0xC3D2E1F0;

  // Process the message in 512-bit chunks
  for (let chunk = 0; chunk < msgArray.length; chunk += 64) {
    const w = [];
    
    // Break chunk into sixteen 32-bit big-endian words
    for (let i = 0; i < 16; i++) {
      w[i] = (msgArray[chunk + i * 4] << 24) |
             (msgArray[chunk + i * 4 + 1] << 16) |
             (msgArray[chunk + i * 4 + 2] << 8) |
             (msgArray[chunk + i * 4 + 3]);
    }

    // Extend the sixteen 32-bit words into eighty 32-bit words
    for (let i = 16; i < 80; i++) {
      w[i] = rotateLeft(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
    }

    // Initialize hash value for this chunk
    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;

    // Main loop
    for (let i = 0; i < 80; i++) {
      let f, k;
      if (i < 20) {
        f = (b & c) | ((~b) & d);
        k = 0x5A827999;
      } else if (i < 40) {
        f = b ^ c ^ d;
        k = 0x6ED9EBA1;
      } else if (i < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8F1BBCDC;
      } else {
        f = b ^ c ^ d;
        k = 0xCA62C1D6;
      }

      const temp = (rotateLeft(a, 5) + f + e + k + w[i]) & 0xFFFFFFFF;
      e = d;
      d = c;
      c = rotateLeft(b, 30);
      b = a;
      a = temp;
    }

    // Add this chunk's hash to result so far
    h0 = (h0 + a) & 0xFFFFFFFF;
    h1 = (h1 + b) & 0xFFFFFFFF;
    h2 = (h2 + c) & 0xFFFFFFFF;
    h3 = (h3 + d) & 0xFFFFFFFF;
    h4 = (h4 + e) & 0xFFFFFFFF;
  }

  // Produce the final hash value as a 160-bit number (hex string)
  return cvtHex(h0) + cvtHex(h1) + cvtHex(h2) + cvtHex(h3) + cvtHex(h4);
}

// HMAC-SHA1实现（临时使用crypto-js）
function hmacSHA1(message, key) {
  const hmac = CryptoJS.HmacSHA1(message, key);
  
  // 转换为类似我们期望的格式
  return {
    words: hmac.words,
    sigBytes: hmac.sigBytes,
    clamp: function() {
      // crypto-js的WordArray已经是clamped的
    }
  };
}

const _createHmacHelper = function (t) {
  return function (e, r) {
    return new g.HMAC.init(t, r).finalize(e);
  };
};

// 自定义Base64编码实现（保持原有transform2函数形态）
const transform2 = function (e, t) {
  return (function (e) {
    var t = e.words,
      n = e.sigBytes,
      s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    e.clamp && e.clamp();
    for (var r = [], o = 0; o < n; o += 3)
      for (
        var i =
            (((t[o >>> 2] >>> (24 - (o % 4) * 8)) & 255) << 16) |
            (((t[(o + 1) >>> 2] >>> (24 - ((o + 1) % 4) * 8)) & 255) << 8) |
            ((t[(o + 2) >>> 2] >>> (24 - ((o + 2) % 4) * 8)) & 255),
          a = 0;
        a < 4 && o + 0.75 * a < n;
        a++
      )
        r.push(s.charAt((i >>> (6 * (3 - a))) & 63));
    var l = s.charAt(64);
    if (l) for (; r.length % 4; ) r.push(l);
    return r.join("");
  })(e);
};

// URL解析函数（简化版）
const b = {
  parse: function(url) {
    try {
      const urlObj = new URL(url);
      return {
        path: urlObj.pathname
      };
    } catch (e) {
      return {
        path: url
      };
    }
  }
};

/**
 * 生成签名参数
 * @param {string} e - 请求路径，如/login
 * @param {string} t - HTTP方法，如POST
 * @returns {object} 包含_timestamp和_sgin的对象
 */
export const L = (e, t) => {
  const n = {},
    s = env.secret,
    r = Date.now(),
    o = b.parse("".concat(env.server).concat(e)).path || "",
    a = "".concat(t, "&").concat(o, "&").concat(r);
  
  const hmacResult = hmacSHA1(a, s);
  const signature = transform2(hmacResult);
  
  return (n["_timestamp"] = r), (n["_sgin"] = signature), n;
};

// 导出主要的签名生成函数
export const generateSignature = L;

// 用于测试的函数，可以指定timestamp
export const generateSignatureWithTimestamp = (path, method, timestamp) => {
  const n = {},
    s = env.secret,
    r = timestamp,
    o = b.parse("".concat(env.server).concat(path)).path || "",
    a = "".concat(method, "&").concat(o, "&").concat(r);
  
  const hmacResult = hmacSHA1(a, s);
  const signature = transform2(hmacResult);
  
  return (n["_timestamp"] = r), (n["_sgin"] = signature), n;
};
