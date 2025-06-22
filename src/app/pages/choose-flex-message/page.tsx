"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

const templateImages = [
  {
    id: "template1",
    name: "ビジネステンプレート",
    src: "/flex-images/letter-sick.png",
    description: "プロフェッショナルなビジネス向けデザイン",
  },
  {
    id: "template2",
    name: "カジュアルテンプレート",
    src: "/placeholder.svg?height=120&width=200",
    description: "親しみやすいカジュアルなデザイン",
  },
  {
    id: "template3",
    name: "モダンテンプレート",
    src: "/placeholder.svg?height=120&width=200",
    description: "洗練されたモダンなデザイン",
  },
  {
    id: "template4",
    name: "シンプルテンプレート",
    src: "/placeholder.svg?height=120&width=200",
    description: "ミニマルでシンプルなデザイン",
  },
]

export default function Component() {
  const [selectedTemplate, setSelectedTemplate] = useState("template1")
  const router = useRouter()
  const handleNext = () => {
    if (selectedTemplate) {
      console.log("選択されたテンプレート:", selectedTemplate)
      router.push('/pages/choose-flex-message/letter-content')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50">
      <div className="container max-w-md mx-auto px-4 py-6">
        {/* タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">テンプレートを選択</h1>
          <p className="text-gray-600 text-sm">お好みのデザインテンプレートを選んでください</p>
        </div>

        {/* 画像選択フィールド */}
        <div className="mb-8">
          <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate} className="space-y-4">
            {templateImages.map((template) => (
              <div key={template.id}>
                <Label htmlFor={template.id} className="cursor-pointer">
                  <Card
                    className={`transition-all duration-200 hover:shadow-md ${
                      selectedTemplate === template.id ? "ring-2 ring-lime-400 bg-lime-50" : "hover:bg-lime-25"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-full">
                          <Image
                            src={template.src || "/placeholder.svg"}
                            alt={template.name}
                            width={200}
                            height={120}
                            className="rounded-lg border object-cover w-full"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={template.id} id={template.id} className="text-lime-600" />
                          <div className="space-y-1">
                            <h3 className="font-medium text-gray-800 text-base">{template.name}</h3>
                            <p className="text-gray-500 text-sm">{template.description}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* 次のステップボタン */}
        <div className="space-y-4">
          <Button
            onClick={handleNext}
            disabled={!selectedTemplate}
            className="w-full bg-lime-500 hover:bg-lime-600 text-white font-medium py-3 text-base disabled:bg-gray-300 disabled:text-gray-500"
            size="lg"
          >
            次のステップへ進む
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-center text-xs text-gray-500">テンプレートを選択してから次に進んでください</p>
        </div>
      </div>
    </div>
  )
}
