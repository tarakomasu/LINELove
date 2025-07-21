"use client";

import { useState, useRef } from "react";
import { Rnd } from "react-rnd";

export default function RndEditableWithFocusButton() {
  const [text, setText] = useState("ここが編集エリア");
  const [isEditing, setIsEditing] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);
  const wasDragging = useRef(false);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#f0f0f0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <h1 className="text-xl p-2">
        📌 Rnd + contentEditable + フォーカスボタン
      </h1>

      {/* ドラッグ＆リサイズ可能な編集エリア */}
      <Rnd
        default={{
          x: 100,
          y: 100,
          width: 200,
          height: 50,
        }}
        onDragStart={() => {
          wasDragging.current = true;
        }}
        onDragStop={() => {
          // ドラッグ直後にクリック判定が誤作動しないように少し遅延させる
          setTimeout(() => {
            wasDragging.current = false;
          }, 50);
        }}
        onMouseDown={(e) => {
          // Rndコンポーネント自体をクリックした場合も編集可能にする
          console.log("koyoi");
          if (!wasDragging.current) {
            editableRef.current?.focus();
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(editableRef.current!);
            range.collapse(false);
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
        }}
      >
        <div
          ref={editableRef}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setText(e.currentTarget.textContent || "")}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            height: "100%",
            outline: "none",
            textAlign: "center",
            wordBreak: "break-word",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {text}
        </div>
      </Rnd>

      {/* 下部パネル（フォーカス用ボタンと他のボタン） */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#fff",
          padding: "8px 16px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          display: "flex",
          gap: "8px",
          zIndex: 9999,
        }}
      >
        {/* 🔥 フォーカスを当てるボタン */}
        <button
          onClick={() => {
            editableRef.current?.focus();
          }}
          style={{
            backgroundColor: "#f59e0b",
            color: "white",
            padding: "6px 12px",
            borderRadius: "4px",
          }}
        >
          ✏️ フォーカスを当てる
        </button>

        {/* 保存ボタン */}
        <button
          onClick={() => alert(`保存しました: ${text}`)}
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "6px 12px",
            borderRadius: "4px",
          }}
        >
          💾 保存
        </button>

        {/* 初期化ボタン */}
        <button
          onClick={() => setText("ここが編集エリア")}
          style={{
            backgroundColor: "#10b981",
            color: "white",
            padding: "6px 12px",
            borderRadius: "4px",
          }}
        >
          🔄 初期化
        </button>
      </div>
    </div>
  );
}
