import React from 'react'
import ReactDOM from 'react-dom/client'
import Globe from './components/Globe'
import './index.css'

// 获取 URL 参数
const urlParams = new URLSearchParams(window.location.search)
const isPreview = urlParams.get('preview') === 'true'
const isEmbed = urlParams.get('embed') === 'true'

// 如果是嵌入模式，添加相应的样式
if (isEmbed) {
  document.documentElement.style.margin = '0'
  document.documentElement.style.padding = '0'
  document.documentElement.style.overflow = 'hidden'
  document.documentElement.style.width = '100%'
  document.documentElement.style.height = '100%'
  
  document.body.style.margin = '0'
  document.body.style.padding = '0'
  document.body.style.overflow = 'hidden'
  document.body.style.width = '100%'
  document.body.style.height = '100%'
  document.body.style.background = 'transparent'

  const root = document.getElementById('root')
  if (root) {
    root.style.width = '100%'
    root.style.height = '100%'
    root.style.overflow = 'hidden'
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Globe isPreview={isPreview} />
  </React.StrictMode>,
)
