const generateButton = document.getElementById('generate-button');
const topicList = document.getElementById('topic-list');
const loadingIndicator = document.getElementById('loading-indicator');
const initialMessage = document.getElementById('initial-message');
const depthSelect = document.getElementById('depth');
const relationshipSelect = document.getElementById('relationship');

generateButton.addEventListener('click', async () => {
    const depth = depthSelect.value;
    const relationship = relationshipSelect.value;

    // 以前の結果と初期メッセージをクリア
    topicList.innerHTML = '';
    initialMessage.style.display = 'none';
    
    // ローディング表示を開始
    loadingIndicator.style.display = 'block';
    generateButton.disabled = true;
    generateButton.textContent = '生成中...';

    try {
        console.log('リクエスト送信中:', { depth, relationship });
        const response = await fetch('/.netlify/functions/generate-topic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ depth, relationship }),
        });

        console.log('レスポンス受信:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('APIエラー:', errorData);
            throw new Error(errorData.error || `サーバーエラー: ${response.status}`);
        }

        const data = await response.json();
        console.log('受信データ:', data);
        
        // AIが生成した話題の配列を使ってリストを作成
        if (data.topics && data.topics.length > 0) {
            // 生成された話題の前にメッセージを表示
            const messageItem = document.createElement('li');
            messageItem.className = 'generation-message';
            messageItem.textContent = `${relationship}との会話用の質問や話題を${data.topics.length}つ生成しました。`;
            topicList.appendChild(messageItem);

            // 話題を表示
            data.topics.forEach(topic => {
                const listItem = document.createElement('li');
                listItem.textContent = topic;
                topicList.appendChild(listItem);
            });
        } else {
            console.error('トピックが空:', data);
            throw new Error('有効な話題が生成されませんでした。');
        }

    } catch (error) {
        console.error('エラーの詳細:', error);
        initialMessage.textContent = 'エラーが発生しました。もう一度お試しください。';
        initialMessage.style.display = 'block';
    } finally {
        // ローディング表示を終了
        loadingIndicator.style.display = 'none';
        generateButton.disabled = false;
        generateButton.textContent = 'ネタを生成する';
    }
});