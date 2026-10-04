import OpenAI from "openai";

export default async function handler(req, res) {
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not configured" });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `Ты редактор проекта «Дневной сектор».
Подготовь краткий выпуск по наиболее значимым событиям текущего информационного поля.
Не выдумывай факты. Если актуальных источников в среде выполнения нет, прямо укажи это.
Структура: главное; что изменилось; почему важно; что отслеживать дальше.`;

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5",
    input: prompt
  });

  res.status(200).json({
    ok: true,
    generatedAt: new Date().toISOString(),
    text: response.output_text
  });
}
