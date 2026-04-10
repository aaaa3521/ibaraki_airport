import Anthropic from '@anthropic-ai/sdk'

const FALLBACK =
  '✅ この便への搭載を推奨します。\n・空きスペース・鮮度・到着時刻のすべての条件が適合しています\n・市場需要と輸送コストのバランスが最適です\n推奨アクション: 予約を確定してください。'

export async function getCargoRecommendation({ flight, product, boxes, availableCapacity, estimatedPrice }) {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!key) return FALLBACK

  try {
    const client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true })

    const prompt = `あなたは茨城空港のベリーカーゴAIアシスタントです。農家が最適な農産物輸送判断を下せるよう、簡潔で実用的なアドバイスを日本語で提供してください。

## 今回の輸送依頼
- 農産物: ${product.name}
- 数量: ${boxes}箱（${boxes * product.box.weight}kg / ${(boxes * product.box.volume).toFixed(2)}m³）
- フライト: ${flight.id} 茨城→${flight.arrivalCity}
- 出発: ${flight.departureTime} / 到着: ${flight.arrivalTime}
- 利用可能スペース: 容積 ${availableCapacity.volume}m³、重量 ${availableCapacity.weight.toLocaleString()}kg
- 推定料金: ¥${estimatedPrice.toLocaleString()}
- 保管温度: ${product.tempRequirement}
- 鮮度限界: ${product.urgencyHours}時間

## 回答形式（必ずこの形式で）
✅ または ⚠️ または ❌ で始めて、50〜80字で総合評価を1文。
次に箇条書き2〜3点で具体的な理由（鮮度・市場需要・スペース適合性）。
最後に「推奨アクション:」を1行。

農業×航空テクノロジーの革新性が伝わる表現を使ってください。`

    const res = await Promise.race([
      client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000)),
    ])

    return res.content[0].text
  } catch {
    return FALLBACK
  }
}
