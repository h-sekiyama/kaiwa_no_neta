const generateButton = document.getElementById('generate-button');
const topicText = document.getElementById('topic-text');
const spinner = document.getElementById('spinner');
const depthSelect = document.getElementById('depth');
const relationshipSelect = document.getElementById('relationship');

generateButton.addEventListener('click', async () => {
    // ユーザーが選択した値を取得
    const depth = depthSelect.value;
    const relationship = relationshipSelect.value;

    // ローディング表示を開始
    topicText.style.display = 'none';
    spinner.style.display = 'block';
    generateButton.disabled = true;

    try {
        // Netlify Function (サーバー) にリクエストを送信
        const response = await fetch('/.netlify/functions/generate-topic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ depth, relationship }),
        });

        if (!response.ok) {
            throw new Error(`サーバーエラー: ${response.status}`);
        }

        const data = await response.json();
        
        // AIが生成した話題を表示
        topicText.textContent = data.topic;

    } catch (error) {
        console.error('エラーが発生しました:', error);
        topicText.textContent = 'エラーが発生しました。もう一度お試しください。';
    } finally {
        // ローディング表示を終了
        topicText.style.display = 'block';
        spinner.style.display = 'none';
        generateButton.disabled = false;
    }
});