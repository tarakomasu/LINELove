// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { Profile } from '@/app/types/line-profile';
import { contents } from '@/app/flex-messages/BUbble'

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
          "type": "flex",
          "altText": "This is a Flex Message",
          "contents":{
              "type": "bubble",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "image",
                        "url": "https://developers-resource.landpress.line.me/fx/clip/clip4.jpg",
                        "size": "full",
                        "aspectMode": "cover",
                        "aspectRatio": "150:196",
                        "gravity": "center",
                        "flex": 1
                      },
                      {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                          {
                            "type": "image",
                            "url": "https://developers-resource.landpress.line.me/fx/clip/clip5.jpg",
                            "size": "full",
                            "aspectMode": "cover",
                            "aspectRatio": "150:98",
                            "gravity": "center"
                          },
                          {
                            "type": "image",
                            "url": "https://developers-resource.landpress.line.me/fx/clip/clip6.jpg",
                            "size": "full",
                            "aspectMode": "cover",
                            "aspectRatio": "150:98",
                            "gravity": "center"
                          }
                        ],
                        "flex": 1
                      },
                      {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [
                          {
                            "type": "text",
                            "text": "NEW",
                            "size": "xs",
                            "color": "#ffffff",
                            "align": "center",
                            "gravity": "center"
                          }
                        ],
                        "backgroundColor": "#EC3D44",
                        "paddingAll": "2px",
                        "paddingStart": "4px",
                        "paddingEnd": "4px",
                        "flex": 0,
                        "position": "absolute",
                        "offsetStart": "18px",
                        "offsetTop": "18px",
                        "cornerRadius": "100px",
                        "width": "48px",
                        "height": "25px"
                      }
                    ]
                  }
                ],
                "paddingAll": "0px"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                          {
                            "type": "text",
                            
                            "size": "xl",
                            "wrap": true,
                            "text": "Cony Residence",
                            "color": "#ffffff",
                            "weight": "bold"
                          },
                          {
                            "type": "text",
                            "text": "3 Bedrooms, ¥35,000",
                            "color": "#ffffffcc",
                            "size": "sm"
                          }
                        ],
                        "spacing": "sm"
                      },
                      {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                          {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                              {
                                "type": "text",
                                
                                "size": "sm",
                                "wrap": true,
                                "margin": "lg",
                                "color": "#ffffffde",
                                "text": "Private Pool, Delivery box, Floor heating, Private Cinema"
                              }
                            ]
                          }
                        ],
                        "paddingAll": "13px",
                        "backgroundColor": "#ffffff1A",
                        "cornerRadius": "2px",
                        "margin": "xl"
                      }
                    ]
                  }
                ],
                "paddingAll": "20px",
                "backgroundColor": "#464F69"
              }
            }
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
      <p><strong>ユーザーID：</strong>{profile.userId}</p>

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
        シェアする
      </button>
    </div>
  );
}
