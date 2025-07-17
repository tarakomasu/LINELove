"use client";

import { useEffect, useState, useLayoutEffect } from "react";
import { Rnd } from "react-rnd";

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

type CanvasItem = {
  id: string;
  type: "text" | "image";
  value: string; // 文字列 or blob URL
  file?: File;
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
  const [width] = useWindowSize();
  const scale = width < 1124 ? width / 1124 : 1;

  const [pages, setPages] = useState<Page[]>([{ id: generateId(), items: [] }]);
  const [textInput, setTextInput] = useState("");
  const [currentPageId, setCurrentPageId] = useState(pages[0].id);

  useEffect(() => {
    // コンポーネントのアンマウント時にBlob URLをクリーンアップする
    return () => {
      pages.forEach((page) => {
        page.items.forEach((item) => {
          if (item.type === "image" && item.value.startsWith("blob:")) {
            URL.revokeObjectURL(item.value);
          }
        });
      });
    };
  }, [pages]);

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
    const imageUrl = URL.createObjectURL(file);
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
                  value: imageUrl,
                  file,
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

  const handleSave = async () => {
    const formData = new FormData();
    const pagesData = pages.map((page) => ({
      ...page,
      items: page.items.map((item) => {
        if (item.type === "image" && item.file) {
          formData.append("files", item.file);
          return { ...item, value: item.file.name, file: undefined };
        } else {
          return { ...item, file: undefined };
        }
      }),
    }));

    formData.append("pages", JSON.stringify(pagesData));

    try {
      const response = await fetch("/api/merge-letter", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("保存に成功しました");
        const result = await response.json();
        console.log(result);
      } else {
        console.error("保存に失敗しました");
      }
    } catch (error) {
      console.error("エラーが発生しました", error);
    }
  };

  return (
    <div style={{ height: 5000 * scale, backgroundColor: "rgb(229 231 235)" }}>
      <div
        className="bg-gray-300 min-w-[1124px] min-h-[5000px] flex flex-col items-center"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {pages.map((page) => (
          <div
            key={page.id}
            onClick={() => setCurrentPageId(page.id)}
            className={`relative w-[1024px] h-[1532px] mx-auto mt-10 border-4 transition-all cursor-pointer ${
              currentPageId === page.id
                ? "border-blue-500"
                : "border-transparent"
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
                scale={scale}
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
      </div>
      {/* コントロールパネル */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white p-4 rounded shadow-lg flex flex-wrap gap-2 items-center justify-center max-w-full z-50">
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
        <button
          onClick={() => console.log(pages)}
          className="bg-gray-500 text-white px-3 py-1 rounded"
        >
          ページ内容
        </button>
        <button
          onClick={handleSave}
          className="bg-purple-500 text-white px-3 py-1 rounded"
        >
          保存
        </button>
      </div>
    </div>
  );
}
