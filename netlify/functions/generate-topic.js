// OpenAI APIを叩くための準備
const OpenAI = require("openai");

// このファイルはサーバーで動くので、ここにAPIキーを直接書かずに環境変数から読み込む
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event, context) => {
  // POST以外のリクエストは拒否
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // フロントエンドから送られてきたデータを取得
    const { depth, relationship } = JSON.parse(event.body);

    // AIへの命令文（プロンプト）を組み立てる
    const prompt = `
あなたは、会話のきっかけ作りをサポートするプロのアシスタントです。
以下の条件に基づいて、相手との会話が弾むような、面白くて創造的な質問または話題を日本語で「1つだけ」生成してください。

# 条件
- 会話相手との関係: ${relationship}
- 望む会話の深さ: ${depth}

# 出力形式
- 質問文または話題のテキストのみを生成してください。
- 「はい、承知いたしました。」などの前置きや、説明、引用符（""）は一切含めないでください。
`;

    // OpenAI APIにリクエストを送信
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4" for higher quality
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.8, // 少し創造的にするために数値を調整
    });

    const topic = completion.choices[0].message.content.trim();

    // 結果をJSON形式でフロントエンドに返す
    return {
      statusCode: 200,
      body: JSON.stringify({ topic: topic }),
    };
  } catch (error) {
    console.error("AIからの応答エラー:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AIからの応答取得に失敗しました。" }),
    };
  }
};