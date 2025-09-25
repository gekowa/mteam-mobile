/**
 * BBCode + Markdown 渲染器
 * 按照先 BBCode 再 Markdown 的顺序处理
 */

/**
 * 转义 HTML 字符
 */
function escapeHtml(text) {
  // 浏览器环境
  if (typeof document !== 'undefined') {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
  
  // Node.js 环境或其他环境的简单转义
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * BBCode 渲染器
 */
function renderBBCode(text) {
  if (!text) return ''
  
  let html = text
  
  // [img]url[/img] -> <img> (只处理未被 Markdown 转换的)
  html = html.replace(/\[img\]((?:(?!<img[^>]*>).)*?)\[\/img\]/gi, (match, url) => {
    return `<img src="${escapeHtml(url.trim())}" alt="图片" class="max-w-full h-auto my-2 rounded" />`
  })
  
  // [quote]content[/quote] -> <blockquote>
  html = html.replace(/\[quote\]([\s\S]*?)\[\/quote\]/gi, (match, content) => {
    return `<blockquote class="border-l-4 border-gray-300 pl-4 my-3 py-2 bg-gray-50 text-gray-700 italic rounded-r">${content.trim()}</blockquote>`
  })
  
  // [quote=author]content[/quote] -> <blockquote with author>
  html = html.replace(/\[quote=([^\]]+)\]([\s\S]*?)\[\/quote\]/gi, (match, author, content) => {
    return `<blockquote class="border-l-4 border-blue-300 pl-4 my-3 py-2 bg-blue-50 text-gray-700 rounded-r">
      <cite class="text-xs text-blue-600 font-medium block mb-1">${escapeHtml(author.trim())} 说：</cite>
      ${content.trim()}
    </blockquote>`
  })
  
  // [b]text[/b] -> <strong> (只处理未被 Markdown 转换的)
  html = html.replace(/\[b\]((?:(?!<\/?strong>).)*?)\[\/b\]/gi, '<strong>$1</strong>')
  
  // [i]text[/i] -> <em> (只处理未被 Markdown 转换的)
  html = html.replace(/\[i\]((?:(?!<\/?em>).)*?)\[\/i\]/gi, '<em>$1</em>')
  
  // [u]text[/u] -> <u>
  html = html.replace(/\[u\](.*?)\[\/u\]/gi, '<u>$1</u>')
  
  // [s]text[/s] -> <del>
  html = html.replace(/\[s\](.*?)\[\/s\]/gi, '<del>$1</del>')
  
  // [url]link[/url] -> <a> (只处理未被 Markdown 转换的)
  html = html.replace(/\[url\]((?:(?!<\/?a[^>]*>).)*?)\[\/url\]/gi, (match, url) => {
    return `<a href="${escapeHtml(url.trim())}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${escapeHtml(url.trim())}</a>`
  })
  
  // [url=link]text[/url] -> <a> (只处理未被 Markdown 转换的)
  html = html.replace(/\[url=([^\]]+)\]((?:(?!<\/?a[^>]*>).)*?)\[\/url\]/gi, (match, url, text) => {
    return `<a href="${escapeHtml(url.trim())}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${text.trim()}</a>`
  })
  
  // [color=color]text[/color] -> <span>
  html = html.replace(/\[color=([^\]]+)\](.*?)\[\/color\]/gi, (match, color, text) => {
    return `<span style="color: ${escapeHtml(color.trim())}">${text}</span>`
  })
  
  // [size=size]text[/size] -> <span>
  html = html.replace(/\[size=([^\]]+)\](.*?)\[\/size\]/gi, (match, size, text) => {
    return `<span style="font-size: ${escapeHtml(size.trim())}">${text}</span>`
  })
  
  // [center]text[/center] -> <div>
  html = html.replace(/\[center\](.*?)\[\/center\]/gi, '<div class="text-center">$1</div>')
  
  // [left]text[/left] -> <div>
  html = html.replace(/\[left\](.*?)\[\/left\]/gi, '<div class="text-left">$1</div>')
  
  // [right]text[/right] -> <div>
  html = html.replace(/\[right\](.*?)\[\/right\]/gi, '<div class="text-right">$1</div>')
  
  // [code]text[/code] -> <code>
  html = html.replace(/\[code\]([\s\S]*?)\[\/code\]/gi, (match, code) => {
    return `<pre class="bg-gray-100 border rounded p-3 my-2 text-sm font-mono overflow-x-auto"><code>${escapeHtml(code)}</code></pre>`
  })
  
  // [list][*]item[/list] -> <ul><li>
  html = html.replace(/\[list\]([\s\S]*?)\[\/list\]/gi, (match, content) => {
    const items = content.replace(/\[\*\]/g, '<li>').split('<li>').filter(item => item.trim())
    const listItems = items.map(item => `<li class="ml-4">${item.trim()}</li>`).join('')
    return `<ul class="list-disc pl-4 my-2">${listItems}</ul>`
  })
  
  // [list=1][*]item[/list] -> <ol><li>
  html = html.replace(/\[list=1\]([\s\S]*?)\[\/list\]/gi, (match, content) => {
    const items = content.replace(/\[\*\]/g, '<li>').split('<li>').filter(item => item.trim())
    const listItems = items.map(item => `<li class="ml-4">${item.trim()}</li>`).join('')
    return `<ol class="list-decimal pl-4 my-2">${listItems}</ol>`
  })
  
  return html
}

/**
 * Markdown 渲染器
 * 处理常见的 Markdown 语法
 */
function renderMarkdown(text) {
  if (!text) return ''
  
  let html = text
  
  // ### Heading 3 -> <h3>
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">$1</h3>')
  
  // ## Heading 2 -> <h2>
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-gray-900 mt-5 mb-3">$1</h2>')
  
  // # Heading 1 -> <h1>
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-6 mb-4">$1</h1>')
  
  // **bold** -> <strong>
  html = html.replace(/\*\*((?:(?!\*\*).)+)\*\*/g, '<strong>$1</strong>')
  
  // *italic* -> <em>
  html = html.replace(/\*((?:(?!\*).)+)\*/g, '<em>$1</em>')
  
  // `code` -> <code>
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
  
  // ```code block``` -> <pre><code>
  html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
    return `<pre class="bg-gray-100 border rounded p-3 my-2 text-sm font-mono overflow-x-auto"><code>${escapeHtml(code.trim())}</code></pre>`
  })
  
  // ![alt](url) -> <img> (Markdown 图片语法)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
    return `<img src="${escapeHtml(url.trim())}" alt="${escapeHtml(alt.trim())}" class="max-w-full h-auto my-2 rounded" />`
  })
  
  // [text](url) -> <a>
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    return `<a href="${escapeHtml(url.trim())}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${text.trim()}</a>`
  })
  
  // - list item -> <ul><li>
  html = html.replace(/^[\s]*[-*+] (.+)$/gm, '<li class="ml-4">$1</li>')
  html = html.replace(/(<li[^>]*>.*<\/li>)/s, '<ul class="list-disc pl-4 my-2">$1</ul>')
  
  // 1. numbered list -> <ol><li>
  html = html.replace(/^[\s]*\d+\. (.+)$/gm, '<li class="ml-4">$1</li>')
  html = html.replace(/(<li[^>]*>.*<\/li>)/s, '<ol class="list-decimal pl-4 my-2">$1</ol>')
  
  // > quote -> <blockquote>
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 my-3 py-2 bg-gray-50 text-gray-700 italic rounded-r">$1</blockquote>')
  
  return html
}

/**
 * 处理换行和段落
 */
function processLineBreaks(text) {
  if (!text) return ''
  
  // 将连续的换行符转换为段落分隔
  let html = text.replace(/\r\n\r\n/g, '\n\n').replace(/\n\n/g, '</p><p class="mb-3">')
  
  // 包装第一个段落
  if (html.includes('</p><p')) {
    html = '<p class="mb-3">' + html + '</p>'
  }
  
  // 单个换行符转换为 <br>
  html = html.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>')
  
  return html
}

/**
 * 主渲染函数 - 先 Markdown 再 BBCode
 * @param {string} text - 原始文本内容
 * @returns {string} - 渲染后的 HTML
 */
export function renderBBCodeAndMarkdown(text) {
  if (!text) return ''
  
  // 1. 先处理 Markdown
  let html = renderMarkdown(text)
  
  // 2. 再处理 BBCode（可以覆盖 Markdown 的某些格式）
  html = renderBBCode(html)
  
  // 3. 最后处理换行和段落
  html = processLineBreaks(html)
  
  return html
}

/**
 * 为了向后兼容，也导出单独的 BBCode 渲染器
 */
export { renderBBCode }