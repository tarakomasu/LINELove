
'use client'

import { useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'

type CanvasItem = {
  id: string
  type: 'text' | 'image'
  value: string // 文字列 or base64画像
  x: number
  y: number
  width: number
  height: number
}

function generateId() {
  return Math.random().toString(36).substring(2, 10)
}

export default function MergeEditor() {
  const [items, setItems] = useState<CanvasItem[]>([])
  const [textInput, setTextInput] = useState('')
  const [scale, setScale] = useState(1)
  const containerWidth = 1024 + 200
  const containerHeight = 1536 * 3
    // ウィンドウサイズに応じてスケーリング調整
    useEffect(() => {
      const updateScale = () => {
        const maxWidth = window.innerWidth
        const maxHeight = window.innerHeight
        const scaleX = maxWidth / 1024
        const scaleY = maxHeight / 1536
        const newScale = Math.min(scaleX, scaleY, 1)
        setScale(newScale)
      }
  
      updateScale()
      window.addEventListener('resize', updateScale)
      return () => window.removeEventListener('resize', updateScale)
    }, [])

  const addText = () => {
    if (!textInput.trim()) return
    setItems((prev) => [
      ...prev,
      {
        id: generateId(),
        type: 'text',
        value: textInput,
        x: 100,
        y: 100,
        width: 200,
        height: 50,
      },
    ])
    setTextInput('')
  }

  const addImage = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setItems((prev) => [
        ...prev,
        {
          id: generateId(),
          type: 'image',
          value: result,
          x: 100,
          y: 100,
          width: 200,
          height: 200,
        },
      ])
    }
    reader.readAsDataURL(file)
  }

  const updateItem = (id: string, updates: Partial<CanvasItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )
  }

  return (
    <div className={`bg-gray-300 min-w-[1124px] min-h-[5000px] flex justify-center`}>
    <div className="relative w-[1024px] h-[1536px] border mx-auto mt-10 bg-black">
      {/* 背景画像 */}
      <img
        src="/flex-template-view/gpt12.png"
        alt="背景"
        className="absolute z-0"
      />

      {/* ドラッグ＆リサイズ可能な要素 */}
      {items.map((item) => (
        <Rnd
          key={item.id}
          size={{ width: item.width, height: item.height }}
          position={{ x: item.x, y: item.y }}
          bounds="parent"
          onDragStop={(e, d) => updateItem(item.id, { x: d.x, y: d.y })}
          onResizeStop={(e, direction, ref, delta, position) => {
            updateItem(item.id, {
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height),
              x: position.x,
              y: position.y,
            })
          }}
          className="absolute z-10 border border-blue-500 bg-white/50 p-1"
        >
          {item.type === 'text' ? (
            <div className="w-full h-full flex justify-center items-center text-black font-bold text-xl">
              {item.value}
            </div>
          ) : (
            <img src={item.value} className="w-full h-full object-contain" />
          )}
        </Rnd>
      ))}

      {/* コントロールパネル */}
      <div className="fixed bottom-10 left-10 bg-white p-4 rounded shadow-lg flex gap-2 items-center">
        <input
          type="text"
          placeholder="テキストを入力"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="border p-1"
        />
        <button
          onClick={addText}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          テキスト追加
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) addImage(file)
          }}
        />
      </div>
    </div>
    </div>
  )
}
/*
'use client'

import { useState } from 'react'

export default function Home() {
  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const [text, setText] = useState<string>('') // ✅ テキスト入力の state
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [log, setLog] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResultUrl(null)
    setLog([])

    if (!file1 || !file2) {
      setLog((prev) => [...prev, '画像が2枚とも必要です'])
      return
    }

    const formData = new FormData()
    formData.append('image1', file1)
    formData.append('image2', file2)
    formData.append('text', text) // ✅ テキストも追加

    try {
      const res = await fetch('/api/merge-letter', { // ✅ APIルート修正
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setLog((prev) => [...prev, 'サーバーエラー: ' + data?.message])
        return
      }

      setResultUrl(data.url)
      setLog((prev) => [...prev, '合成成功: ' + data.url])
    } catch (err: any) {
      setLog((prev) => [...prev, 'クライアントエラー: ' + err.message])
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">画像合成 App Router</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p>画像1:</p>
          <input type="file" accept="image/*" onChange={(e) => setFile1(e.target.files?.[0] || null)} />
        </div>
        <div>
          <p>画像2:</p>
          <input type="file" accept="image/*" onChange={(e) => setFile2(e.target.files?.[0] || null)} />
        </div>
        <div>
          <p>テキスト:</p>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border px-2 py-1 rounded w-full"
            placeholder="画像に追加するテキスト"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">合成</button>
      </form>

      <div className="mt-6">
        <h2 className="font-semibold">ログ出力:</h2>
        <ul className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
          {log.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </div>

      {resultUrl && (
        <div className="mt-6">
          <h2 className="font-semibold">結果:</h2>
          <img src={resultUrl + '?t=' + Date.now()} alt="合成画像" className="border mt-2" />
        </div>
      )}
    </main>
  )
}
*/