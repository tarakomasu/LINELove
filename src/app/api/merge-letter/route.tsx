// app/api/merge-letter/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';

// Define types matching the frontend
type CanvasItem = {
  id: string;
  type: 'text' | 'image';
  value: string; // For text: content; for image: original filename
  x: number;
  y: number;
  width: number;
  height: number;
};

type Page = {
  id:string;
  items: CanvasItem[];
};

export const config = {
  runtime: 'nodejs',
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const pagesJson = formData.get('pages')?.toString();
    const files = formData.getAll('files') as File[];

    if (!pagesJson) {
      return NextResponse.json({ error: 'Pages data is missing' }, { status: 400 });
    }

    const pages: Page[] = JSON.parse(pagesJson);
    const generatedImageUrls: string[] = [];

    // Process each page
    for (const page of pages) {
      const bgPath = path.join(process.cwd(), 'public', 'flex-template-view', 'gpt12.png');
      const canvas = sharp(bgPath);

      const compositeLayers: sharp.OverlayOptions[] = [];

      for (const item of page.items) {
        if (item.type === 'text') {
          // Create an SVG for the text item to allow for better styling
          const svgText = `
            <svg width="${Math.round(item.width)}" height="${Math.round(item.height)}">
              <foreignObject width="100%" height="100%">
                <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-family: sans-serif; font-size: 24px; font-weight: bold; color: black; text-align: center;">
                  ${item.value}
                </div>
              </foreignObject>
            </svg>
          `;
          const textBuffer = await sharp(Buffer.from(svgText)).png().toBuffer();
          compositeLayers.push({
            input: textBuffer,
            top: Math.round(item.y),
            left: Math.round(item.x),
          });
        } else if (item.type === 'image') {
          // Find the corresponding file from the FormData
          const imageFile = files.find(f => f.name === item.value);
          if (imageFile) {
            const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
            // Resize the image to fit the item's dimensions
            const resizedImage = await sharp(imageBuffer)
              .resize(Math.round(item.width), Math.round(item.height))
              .png()
              .toBuffer();
            compositeLayers.push({
              input: resizedImage,
              top: Math.round(item.y),
              left: Math.round(item.x),
            });
          }
        }
      }

      // Generate a unique filename for the output image
      const outputFileName = `output-${page.id}-${Date.now()}.png`;
      const outputPath = path.join(process.cwd(), 'public', outputFileName);

      // Composite all layers onto the background
      await canvas
        .composite(compositeLayers)
        .png()
        .toFile(outputPath);

      generatedImageUrls.push(`/${outputFileName}`);
    }

    return NextResponse.json({ urls: generatedImageUrls });

  } catch (e: any) {
    console.error('Image composition failed:', e);
    return NextResponse.json({ error: 'Server error', message: e.message }, { status: 500 });
  }
}