// app/api/merge/route.ts
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'

export const config = {
  runtime: 'nodejs',
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const image2 = formData.get('image2') as File
    const text = formData.get('text')?.toString() || ''

    if (!image2) {
      return NextResponse.json({ error: '合成用画像が足りません' }, { status: 400 })
    }

    // ✅ 背景画像を public フォルダから読み込み
    const bgPath = path.join(process.cwd(), 'public', '/flex-template-view/gpt12.png')
    const buffer1 = await fs.readFile(bgPath)

    const buffer2 = Buffer.from(await image2.arrayBuffer())

    // ✅ 背景画像のサイズを取得
    const baseMeta = await sharp(buffer1).metadata()
    const { width = 800, height = 600 } = baseMeta

    // ✅ 合成画像を縮小
    const overlayWidth = Math.floor(width * 0.3)
    const overlayHeight = Math.floor(height * 0.3)
    const resizedOverlay = await sharp(buffer2)
      .resize(overlayWidth, overlayHeight)
      .png()
      .toBuffer()

    // ✅ テキストをSVGで作成
    const svgText = `
      <svg width="${width}" height="100">
        <style>
          .title {
            fill: white;
            font-size: 32px;
            font-weight: bold;
            text-anchor: middle;
          }
        </style>
        <text x="50%" y="50%" class="title" dominant-baseline="middle">${text}</text>
      </svg>
    `
    const textImage = await sharp(Buffer.from(svgText)).png().toBuffer()

    // ✅ 出力ファイル名（ランダムでも固定でも可）
    const outputPath = path.join(process.cwd(), 'public', 'output.png')

    // ✅ 合成実行：背景 → 合成画像 → テキスト
    await sharp(buffer1)
      .composite([
        { input: resizedOverlay, gravity: 'center' },
        { input: textImage, top: height - 110, left: 0 },
      ])
      .png()
      .toFile(outputPath)

    return NextResponse.json({ url: '/output.png' })
  } catch (e: any) {
    console.error('合成失敗:', e.message)
    return NextResponse.json({ error: 'サーバーエラー', message: e.message }, { status: 500 })
  }
}