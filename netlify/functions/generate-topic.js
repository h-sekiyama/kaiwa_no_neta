const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { depth, relationship } = JSON.parse(event.body);

    // Claudeへの命令文（プロンプト）
    const prompt = `
あなたは、会話のきっかけ作りをサポートするプロのアシスタントです。
以下の条件に基づいて、相手との会話が弾むような、面白くて創造的な質問または話題を日本語で「5つ」生成してください。

# 条件
- 会話相手との関係: ${relationship}
- 望む会話の深さ: ${depth}

# 出力形式
- 箇条書きや番号は不要です。
- 各話題を改行だけを使って区切ってください。
- 「はい、承知いたしました。」などの前置きや、説明は一切含めないでください。
`;

    const completion = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 300,
      temperature: 0.8,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const responseText = completion.content[0].text.trim();
    
    // AIが生成した改行区切りのテキストを、配列に変換する
    const topics = responseText.split('\n').filter(topic => topic.trim() !== '');

    // 配列をJSON形式でフロントエンドに返す
    return {
      statusCode: 200,
      body: JSON.stringify({ topics: topics }),
    };
  } catch (error) {
    console.error("AIからの応答エラー:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AIからの応答取得に失敗しました。" }),
    };
  }
};