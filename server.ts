import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// API endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/clima', async (req, res) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
         headers: {
           'User-Agent': 'aistudio-build'
         }
      }
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: "Quais são as condições atuais de clima, tempo, vento, lua e maré para pescadores artesanais no Brasil (ex: Soure/PA ou litoral)? Obtenha as informações de agora. Retorne usando o json schema solicitado.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
             location: { type: Type.STRING, description: "Localização (ex: Município/Estado)" },
             temperature: { type: Type.STRING, description: "Temperatura atual, ex: 29°C" },
             condition: { type: Type.STRING, description: "Condição do tempo, ex: Parcialmente Nublado" },
             humidity: { type: Type.STRING, description: "Umidade, ex: 78%" },
             wind: { type: Type.STRING, description: "Vento, ex: 14 km/h NE" },
             moonPhase: { type: Type.STRING, description: "Fase da lua atual" },
             moonStatus: { type: Type.STRING, description: "Dica curta sobre como a lua atual afeta as correntes ou pesca" },
             tideLow: { type: Type.STRING, description: "Maré baixa, formato: 0.4m às 08:45" },
             tideHigh: { type: Type.STRING, description: "Maré alta, formato: 2.8m às 14:20" }
          },
          required: ["location", "temperature", "condition", "humidity", "wind", "moonPhase", "moonStatus", "tideLow", "tideHigh"]
        }
      }
    });

    res.json(JSON.parse(response.text.trim()));
  } catch (error) {
    console.error("Error fetching clima:", error);
    res.status(500).json({ error: "Falha ao buscar dados climáticos." });
  }
});

app.get('/api/noticias', async (req, res) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
         headers: {
           'User-Agent': 'aistudio-build'
         }
      }
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: "Busque no google as 3 últimas notícias mais relevantes sobre aquicultura e pesca (foco em Ministério da Agricultura e Pecuária - MAPA, ou pescadores). Retorne as informações exatas exigidas no schema.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
             type: Type.OBJECT,
             properties: {
               id: { type: Type.STRING, description: "Um id numérico em string" },
               title: { type: Type.STRING, description: "Título da notícia" },
               date: { type: Type.STRING, description: "Data de publicação curta" },
               source: { type: Type.STRING, description: "Fonte ou órgão emissor (ex: MAPA)" },
               summary: { type: Type.STRING, description: "Resumo da notícia em no máximo duas linhas" },
               url: { type: Type.STRING, description: "Link (url) original para a notícia" }
             },
             required: ["id", "title", "date", "source", "summary", "url"]
          }
        }
      }
    });

    res.json(JSON.parse(response.text.trim()));
  } catch (error) {
    console.error("Error fetching noticias:", error);
    res.status(500).json({ error: "Falha ao buscar notícias." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
