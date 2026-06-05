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
      model: 'gemini-2.5-flash',
      contents: `Quais são as condições atuais de clima, tempo, vento, lua e maré para Soure/PA? Utilize as informações atualizadas do site https://pt.tideschart.com/Brazil/Para/Soure/ - Retorne estritamente um JSON no seguinte formato e não envolva a resposta em \`\`\`json:
{
  "location": "Localização (ex: Município/Estado)",
  "temperature": "Temperatura atual, ex: 29°C",
  "condition": "Condição do tempo, ex: Parcialmente Nublado",
  "humidity": "Umidade, ex: 78%",
  "wind": "Vento, ex: 14 km/h NE",
  "moonPhase": "Fase da lua atual",
  "moonStatus": "Dica curta sobre como a lua atual afeta as correntes ou pesca",
  "tideLow": "Maré baixa, formato: 0.4m às 08:45",
  "tideHigh": "Maré alta, formato: 2.8m às 14:20"
}
Os dados numéricos de maré devem ser strings curtas.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "{}";
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    res.json(JSON.parse(cleanText));
  } catch (error: any) {
    console.error("Error fetching clima, using fallback:", error);
    res.json({
      location: "Soure/PA (Fallback)",
      temperature: "28°C",
      condition: "Ensolarado",
      humidity: "80%",
      wind: "12 km/h E",
      moonPhase: "Lua Crescente",
      moonStatus: "Correntes fortes, ideal para pesca de rede.",
      tideLow: "0.5m às 09:30",
      tideHigh: "2.7m às 15:45"
    });
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
      model: 'gemini-2.5-flash',
      contents: `Busque as 3 últimas notícias mais relevantes sobre aquicultura e pesca publicadas no site do Ministério da Pesca e Aquicultura: https://www.gov.br/mpa/pt-br . Retorne estritamente um array JSON no seguinte formato e não envolva a resposta em \`\`\`json:
[
  {
    "id": "Um id numérico em string",
    "title": "Título da notícia",
    "date": "Data de publicação curta",
    "source": "Fonte ou órgão emissor (ex: MAPA)",
    "summary": "Resumo da notícia em no máximo duas linhas",
    "url": "Link (url) original para a notícia"
  }
]`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "[]";
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    res.json(JSON.parse(cleanText));
  } catch (error: any) {
    console.error("Error fetching noticias, using fallback:", error);
    res.json([
      {
        id: "1",
        title: "MAPA anuncia recursos para pescadores de Soure",
        date: "Hoje",
        source: "MPA",
        summary: "Governo federal libera auxílio para comunidades pesqueiras afetadas pelas mudanças climáticas.",
        url: "https://www.gov.br/mpa/pt-br"
      },
      {
        id: "2",
        title: "Novo período de defeso estabelecido",
        date: "Ontem",
        source: "MPA",
        summary: "Confira as novas datas para o defeso de espécies nativas na região Norte.",
        url: "https://www.gov.br/mpa/pt-br"
      },
      {
        id: "3",
        title: "Boas práticas na pesca artesanal",
        date: "3 dias atrás",
        source: "MPA",
        summary: "Cartilha com orientações para garantir a sustentabilidade dos rios e mares.",
        url: "https://www.gov.br/mpa/pt-br"
      }
    ]);
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
