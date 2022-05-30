// 返回图片Blob地址
const toBlobURL = (function() {
  const urlMap = {}

  // @param {string} url 传入图片资源地址
  return function(url, detail = false) {
    // 过滤重复值
    if (urlMap[url]) return Promise.resolve(urlMap[url])

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = document.createElement('img')

      img.src = url
      img.setAttribute('crossOrigin', 'Anonymous')
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        // 关键
        canvas.toBlob((blob) => {
          const blobURL = URL.createObjectURL(blob)
          if (detail) {
            resolve({ url: blobURL, width: img.width, height: img.height })
          } else {
            resolve(blobURL)
          }
        })
      }
      img.onerror = () => {
        resolve(null)
      }
    })
  }
}())

// 批量处理
function convertToBlobImage(targetNode, timeout) {
  if (!targetNode) return Promise.resolve()

  let nodeList = targetNode

  if (targetNode instanceof Element) {
    if (targetNode.tagName.toLowerCase() === 'img') {
      nodeList = [targetNode]
    } else {
      nodeList = targetNode.getElementsByTagName('img')
    }
  } else if (!(nodeList instanceof Array) && !(nodeList instanceof NodeList)) {
    throw new Error('[convertToBlobImage] 必须是Element或NodeList类型')
  }

  if (nodeList.length === 0) return Promise.resolve()

  // 仅考虑<img>
  return new Promise((resolve) => {
    let resolved = false

    // 超时处理
    if (timeout) {
      setTimeout(() => {
        if (!resolved) resolve()
        resolved = true
      }, timeout)
    }

    let count = 0

    // 逐一替换<img>资源地址
    for (let i = 0, len = nodeList.length; i < len; ++i) {
      const v = nodeList[i]
      let p = Promise.resolve()

      if (v.tagName.toLowerCase() === 'img') {
        if (v.src.match(/^blob:http/g)) {
          p = new Promise(res => res())
        } else {
          p = toBlobURL(v.src).then((blob) => {
            if (blob) v.src = blob
          })
        }
      }

      p.finally(() => {
        if (++count === nodeList.length && !resolved) resolve()
      })
    }
  })
}

export {
  toBlobURL,
  convertToBlobImage
}
