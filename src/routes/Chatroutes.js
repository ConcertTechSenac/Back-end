// routes/chatRoutes.js
// Rota que usa a API gratuita do Groq (Llama 3)

const express = require("express");
const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { mensagens, contexto } = req.body;

    if (!mensagens || !Array.isArray(mensagens)) {
      return res
        .status(400)
        .json({ success: false, erro: "Mensagens inválidas." });
    }

    const systemContent = contexto
      ? contexto
      : `Você é o assistente virtual da Hard Tech, uma loja de tecnologia e eletrônicos.
Responda sempre em português brasileiro de forma amigável, clara e objetiva.
Você pode ajudar com:
- Dúvidas sobre produtos de tecnologia (celulares, notebooks, acessórios, etc.)
- Informações sobre pedidos e entregas
- Problemas com conta e cadastro
- Dúvidas gerais sobre a loja
- Recomendações de produtos
Seja sempre prestativo e use emojis ocasionalmente.
Mantenha respostas concisas — no máximo 3 parágrafos.`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1000,
          temperature: 0.7,
          messages: [
            { role: "system", content: systemContent },
            ...mensagens,
          ],
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro Groq:", data);
      throw new Error(data.error?.message || "Erro na API do Groq");
    }

    const resposta =
      data.choices?.[0]?.message?.content ||
      "Não consegui processar sua mensagem.";
    res.json({ success: true, resposta });
  } catch (error) {
    console.error("Erro no chat:", error.message);
    res.status(500).json({ success: false, erro: error.message });
  }
});

module.exports = router;
