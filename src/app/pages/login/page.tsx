'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import liff from "@line/liff";
import { Profile } from '@/app/types/line-profile'


const LIFF_ID = '2007545363-o6yDADGR'

export default function LiffPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const Router = useRouter()
  useEffect(() => {
    const initializeLiff = async () => {
      if (typeof liff === "undefined") return;

      await liff.init({ liffId: LIFF_ID });

      if (!liff.isLoggedIn()) {
        liff.login();
        Router.push('../home')
      } else {
        const profile = await liff.getProfile();
        setProfile(profile);
        Router.push('../home')
      }
    };

    initializeLiff();
  }, []);

  return (
    <>
      <Script
        src="https://static.line-scdn.net/liff/edge/2/sdk.js"
        strategy="beforeInteractive"
      />
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>LIFF Login Demo</h1>
        {profile ? (
          <>
            <p>名前: {profile.displayName}</p>
            <img src={profile.pictureUrl} width="100" alt="profile" />
          </>
        ) : (
          <p>LINEログイン中...</p>
        )}
      </main>
    </>
  );
}