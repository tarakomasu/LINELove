// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { Profile } from '@/app/types/line-profile'

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await liff.init({ liffId: '2007545363-o6yDADGR' }); // ← 実際の LIFF ID に置き換えてください

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
      <p><strong>ユーザーID：</strong>{profile.userId}</p>
    </div>
  );
}
