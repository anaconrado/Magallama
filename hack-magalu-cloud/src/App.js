import React, { useState } from 'react';
import { HfInference } from '@huggingface/inference';
import './App.css';


const client = new HfInference("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")

function App() {
  const [inputText, setInputText] = useState('');
  const [story, setStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateStory = async () => {
    setIsLoading(true);
    setStory(' ');
    let out = "";

    try {
      const stream = client.chatCompletionStream({
        model: "meta-llama/Llama-3.2-3B-Instruct",
        messages: [
          { role: "user", content: `Escreva uma história de terror com os seguintes elementos: ${inputText}` }
        ],
        max_tokens: 100,
        temperature:0.6,
        top_p:0.9
      });
      

      // Verificando se o streaming está disponível
      if (!stream) {
        throw new Error('Erro ao iniciar o streaming.');
      }

    // Processando a resposta do modelo
    for await (const chunk of stream) {
      if (chunk.choices && chunk.choices.length > 0) {
        const newContent = chunk.choices[0].delta.content;
        out += newContent;
        setStory(prev => prev + newContent); // Atualiza a história em tempo real
      }
    }
  } catch (error) {
    console.error("Erro no streaming:", error);
    alert('Erro ao gerar a história. Tente novamente.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="App">
      <h1>🎃 Magallama Coven 🎃</h1>
      <p>Crie sua própria história assustadora!</p>
      <div className="controls">
        <textarea 
          placeholder="Digite um elemento assustador..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button onClick={generateStory} disabled={isLoading}>
          {isLoading ? 'Gerando...' : 'Gerar História'}
        </button>
      </div>
      {story && (
        <div className="story">
          <h2>História</h2>
          <p>{story}</p>
        </div>
      )}
    </div>
  );
}

export default App;
