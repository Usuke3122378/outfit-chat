export type ChatInputs = {
  region: string;
  scene: string;
  mood?: string;
};

export type SendMessagePayload = {
  query: string;
  inputs: ChatInputs;
  conversationId?: string;
};

export type SendMessageResponse = {
  answer: string;
  conversationId: string;
};

const SCENE_LABELS: Record<string, string> = {
  work: '仕事',
  holiday: '休日のお出かけ',
  park: '子どもと公園',
  date: 'デート',
  home: '家でのんびり',
};

function buildDummyAnswer(query: string, inputs: ChatInputs): string {
  const sceneLabel = SCENE_LABELS[inputs.scene] ?? inputs.scene;
  const moodText = inputs.mood ? `（気分：${inputs.mood}）` : '';

  return `### 今日のコーデ提案 👕

**地域：** ${inputs.region}
**予定：** ${sceneLabel}${moodText}

**提案の方向性：**

- ${query} というご要望ですね
- ${inputs.region} の気候にあわせた素材選びが大切です
- ${sceneLabel} のシーンでは動きやすさと清潔感がポイントです

**おすすめの組み合わせ：**

1. **トップス**：季節に合う襟付きシャツ or 切り替えニット
2. **ボトムス**：スラックス or 濃色デニムでバランスよく
3. **羽織り**：朝晩の冷えに備えて薄手のジャケット
4. **靴**：シーンに合うレザーシューズ or スニーカー

> ※ダミーの回答です。API連携後に実際の提案に切り替わります。
`;
}

export async function sendMessage(
  payload: SendMessagePayload,
): Promise<SendMessageResponse> {
  const { query, inputs, conversationId } = payload;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newConversationId =
    conversationId ?? `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const answer = buildDummyAnswer(query, inputs);

  return {
    answer,
    conversationId: newConversationId,
  };
}
