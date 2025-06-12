// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { Profile } from '@/app/types/line-profile';
import { letter } from '@/app/flex-message-templates/letter'

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await liff.init({ liffId: '2007545363-o6yDADGR' });

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const profileData = await liff.getProfile();
        setProfile(profileData);
      } catch (err: any) {
        setError("プロフィールの取得に失敗しました");
        console.error("LIFFエラー:", err);
      }
    };

    fetchProfile();
  }, []);

  // シェアボタンが押されたときの処理
  const handleShare = async () => {
    if (!liff.isApiAvailable("shareTargetPicker")) {
      alert("この端末ではシェアターゲットピッカーは使えません。");
      return;
    }

    try {
      await liff.shareTargetPicker([
        {
          type: "flex",
          altText: "This is a Flex Message",
          //敗北
          contents:contents as any
        }
      ]);
    } catch (err) {
      console.error("シェアに失敗しました:", err);
      alert("シェアに失敗しました");
    }
  };

  if (error) return <p>{error}</p>;
  if (!profile) return <p>読み込み中...</p>;

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>プロフィール</h1>
      <img
        src={profile.pictureUrl}
        alt="プロフィール画像"
        style={{ borderRadius: "50%", width: "120px", height: "120px" }}
      />
      <p><strong>名前：</strong>{profile.displayName}</p>
      {profile.statusMessage && (
        <p><strong>ステータスメッセージ：</strong>{profile.statusMessage}</p>
      )}
      <p><strong>ユーザーID:</strong>{profile.userId}</p>

      <button
        onClick={handleShare}
        style={{
          marginTop: "1.5rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#06C755",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        シェアハピ
      </button>
    </div>
  );
}
