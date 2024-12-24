function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    chatbot.style.display = (chatbot.style.display === 'none' || chatbot.style.display === '') ? 'flex' : 'none';
}

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();

    if (message) {
        displayMessage(message, 'user-message');
        userInput.value = '';

        const thinkingMessage = displayMessage('Thinking...', 'bot-message');

        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'ENTER API KEY HERE - https://platform.openai.com/api-keys'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: message }]
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            thinkingMessage.remove();
            if (data.choices && data.choices.length > 0) {
                const botResponse = data.choices[0].message.content;
                displayMessage(botResponse, 'bot-message');
            } else {
                throw new Error('No choices returned from OpenAI API');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            thinkingMessage.remove();
            displayMessage('Sorry, there was an error processing your request. Please try again later.', 'bot-message');
        });
    }
}

function displayMessage(text, className) {
    const chatWindow = document.getElementById('chat-window');
    const messageDiv = document.createElement('div');
    messageDiv.className = className;
    messageDiv.innerText = text;
    chatWindow.appendChild(messageDiv);

    chatWindow.scrollTop = chatWindow.scrollHeight;

    return messageDiv;
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}
