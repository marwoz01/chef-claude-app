import "dotenv/config";
import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post("/api/recipe", async (req, res) => {
  try {
    const { ingredients } = req.body;

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [{ role: "user", content: `I have ${ingredients.join(", ")}` }],
    });

    res.json({ recipe: msg.content[0].text });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to generate recipe" });
  }
});

app.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});
