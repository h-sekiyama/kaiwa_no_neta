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
        const response = await fetch('/.netlify/functions/generate-topic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ depth, relationship }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `サーバーエラー: ${response.status}`);
        }

        const data = await response.json();
        
        // AIが生成した話題の配列を使ってリストを作成
        if (data.topics && data.topics.length > 0) {
            data.topics.forEach(topic => {
                const listItem = document.createElement('li');
                listItem.textContent = topic;
                topicList.appendChild(listItem);
            });
        } else {
            throw new Error('有効な話題が生成されませんでした。');
        }

    } catch (error) {
        console.error('エラーが発生しました:', error);
        initialMessage.textContent = 'エラーが発生しました。もう一度お試しください。';
        initialMessage.style.display = 'block';
    } finally {
        // ローディング表示を終了
        loadingIndicator.style.display = 'none';
        generateButton.disabled = false;
        generateButton.textContent = 'ネタを生成する';
    }
});