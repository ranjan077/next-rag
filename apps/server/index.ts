import exprtess from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { Queue } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Embeddings } from "@langchain/core/embeddings";
import { OpenAIEmbeddings } from "@langchain/openai";

dotenv.config();

const queue = new Queue("pdf-processing", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "text-embedding-3-large",
});
const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
  url: process.env.QDRANT_URL,
  collectionName: "pdf-collection",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const app = exprtess();
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  await queue.add("process-pdf", {
    filePath: req.file.path,
    originalName: req.file.originalname,
  });
  res.send(`File ${req.file.originalname} uploaded successfully.`);
});

app.get("/chat", async (req, res) => {
  const userQuery = "how many years of expierence Ranjan has?";
  const retriver = vectorStore.asRetriever({
    k: 2,
  });
  const retriverResponse = await retriver.invoke(userQuery);
  console.log("retriverResponse:", retriverResponse);
  return res.json({
    retriverResponse: retriverResponse,
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
