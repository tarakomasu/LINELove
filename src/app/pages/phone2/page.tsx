"use client";
import React, { useState, MouseEvent } from "react";
import { Rnd, DraggableData } from "react-rnd";

// 各要素の状態を管理する型定義
type EditableElement = {
  id: number;
  text: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  tapCount: number;
  isSelected: boolean;
  isEditing: boolean;
};

const PhonePageWithRnd = () => {
  // 2つの要素の初期状態
  const [elements, setElements] = useState<EditableElement[]>([
    {
      id: 1,
      text: "タップして編集 (要素1)",
      position: { x: 50, y: 100 },
      size: { width: 200, height: 50 },
      tapCount: 0,
      isSelected: false,
      isEditing: false,
    },
    {
      id: 2,
      text: "タップして編集 (要素2)",
      position: { x: 50, y: 200 },
      size: { width: 200, height: 50 },
      tapCount: 0,
      isSelected: false,
      isEditing: false,
    },
  ]);

  // タップ処理のロジック (onMouseDownでトリガー)
  const handleTap = (e: React.MouseEvent<Element>, id: number) => {
    e.stopPropagation();

    setElements((prevElements) =>
      prevElements.map((el) => {
        if (el.id === id) {
          const newTapCount = el.tapCount + 1;
          // 2回タップで編集モード
          if (newTapCount >= 2) {
            return { ...el, isSelected: true, isEditing: true, tapCount: 0 };
          }
          // 1回タップで選択モード
          return {
            ...el,
            isSelected: true,
            isEditing: false,
            tapCount: newTapCount,
          };
        }
        // 他方の要素は非選択状態に戻す
        return { ...el, isSelected: false, isEditing: false, tapCount: 0 };
      })
    );
  };

  // テキスト編集処理
  const handleTextChange = (id: number, newText: string) => {
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === id ? { ...el, text: newText } : el))
    );
  };

  // 編集モードを終了
  const handleBlur = (id: number) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id ? { ...el, isEditing: false, tapCount: 0 } : el
      )
    );
  };

  // ドラッグ終了時の位置更新
  const handleDragStop = (id: number, d: DraggableData) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id ? { ...el, position: { x: d.x, y: d.y } } : el
      )
    );
  };

  // 背景をクリックしたときに全ての選択を解除
  const handleBackgroundMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // クリックされた要素が、イベントリスナーが設定されている要素自身(背景)である場合のみ処理を実行
    if (e.target === e.currentTarget) {
      setElements((prevElements) =>
        prevElements.map((el) => ({
          ...el,
          isSelected: false,
          isEditing: false,
          tapCount: 0,
        }))
      );
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        background: "#f0f0f0",
      }}
      onMouseDown={handleBackgroundMouseDown}
    >
      <h1
        style={{ textAlign: "center", paddingTop: "20px", userSelect: "none" }}
      >
        RNDコンポーネントのテスト
      </h1>
      {elements.map((el) => (
        <Rnd
          key={el.id}
          size={{ width: el.size.width, height: el.size.height }}
          position={{ x: el.position.x, y: el.position.y }}
          onDragStop={(e, d) => handleDragStop(el.id, d)}
          onResizeStop={(e, direction, ref, delta, position) => {
            setElements((prevElements) =>
              prevElements.map((elem) =>
                elem.id === el.id
                  ? {
                      ...elem,
                      size: {
                        width: parseInt(ref.style.width),
                        height: parseInt(ref.style.height),
                      },
                      ...position,
                    }
                  : elem
              )
            );
          }}
          onMouseDown={(e) => handleTap(e, el.id)}
          style={{
            border: `2px solid ${el.isSelected ? "blue" : "grey"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "white",
          }}
          disableDragging={el.isEditing} // 編集中はドラッグを無効化
        >
          {el.isEditing ? (
            <input
              type="text"
              value={el.text}
              onChange={(e) => handleTextChange(el.id, e.target.value)}
              onBlur={() => handleBlur(el.id)}
              autoFocus
              onMouseDown={(e) => e.stopPropagation()} // 親へのイベント伝播を防止
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                outline: "none",
                textAlign: "center",
                background: "transparent",
              }}
            />
          ) : (
            <span style={{ userSelect: "none" }}>{el.text}</span>
          )}
        </Rnd>
      ))}
    </div>
  );
};

export default PhonePageWithRnd;
