"use client";

import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";

type CanvasItem = {
  id: string;
  type: "text" | "image";
  value: string; // 文字列 or base64画像
  x: number;
  y: number;
  width: number;
  height: number;
};

type Page = {
  id: string;
  items: CanvasItem[];
};

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function MergeEditor() {
  const [pages, setPages] = useState<Page[]>([{ id: generateId(), items: [] }]);
  const [textInput, setTextInput] = useState("");
  const [currentPageId, setCurrentPageId] = useState("");

  const addPage = () => {
    const genId = generateId();
    setPages((prev) => [...prev, { id: genId, items: [] }]);
    setCurrentPageId(genId);
  };

  const addText = (pageId: string) => {
    if (!textInput.trim()) return;
    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId
          ? {
              ...page,
              items: [
                ...page.items,
                {
                  id: generateId(),
                  type: "text",
                  value: textInput,
                  x: 100,
                  y: 100,
                  width: 200,
                  height: 50,
                },
              ],
            }
          : page
      )
    );
    setTextInput("");
  };

  const addImage = (pageId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPages((prev) =>
        prev.map((page) =>
          page.id === pageId
            ? {
                ...page,
                items: [
                  ...page.items,
                  {
                    id: generateId(),
                    type: "image",
                    value: result,
                    x: 100,
                    y: 100,
                    width: 200,
                    height: 200,
                  },
                ],
              }
            : page
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const updateItem = (
    pageId: string,
    itemId: string,
    updates: Partial<CanvasItem>
  ) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId
          ? {
              ...page,
              items: page.items.map((item) =>
                item.id === itemId ? { ...item, ...updates } : item
              ),
            }
          : page
      )
    );
  };

  return (
    <div className="bg-gray-300 min-w-[1124px] min-h-[5000px] flex flex-col items-center">
      {pages.map((page) => (
        <div
          key={page.id}
          onClick={() => setCurrentPageId(page.id)}
          className={`relative w-[1024px] h-[1532px] mx-auto mt-10 border-4 transition-all cursor-pointer ${
            currentPageId === page.id ? "border-blue-500" : "border-transparent"
          }`}
        >
          <img
            src="/flex-template-view/gpt12.png"
            alt="背景"
            className="absolute z-0"
          />
          {page.items.map((item) => (
            <Rnd
              key={item.id}
              size={{ width: item.width, height: item.height }}
              position={{ x: item.x, y: item.y }}
              bounds="parent"
              onDragStop={(e, d) =>
                updateItem(page.id, item.id, { x: d.x, y: d.y })
              }
              onResizeStop={(e, direction, ref, delta, position) => {
                updateItem(page.id, item.id, {
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                  x: position.x,
                  y: position.y,
                });
              }}
              className="absolute z-10 border border-blue-500 bg-white/50 p-1"
            >
              {item.type === "text" ? (
                <div className="w-full h-full flex justify-center items-center text-black font-bold text-xl">
                  {item.value}
                </div>
              ) : (
                <img
                  src={item.value}
                  className="w-full h-full object-contain"
                />
              )}
            </Rnd>
          ))}
        </div>
      ))}

      {/* コントロールパネル */}
      <div className="fixed bottom-10 left-10 bg-white p-4 rounded shadow-lg flex gap-2 items-center">
        <button
          onClick={addPage}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          +
        </button>
        <input
          type="text"
          placeholder="テキストを入力"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="border p-1"
        />
        <button
          onClick={() => addText(currentPageId)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          テキスト追加
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) addImage(currentPageId, file);
          }}
        />
      </div>
    </div>
  );
}
