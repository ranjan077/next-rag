import dotenv from "dotenv";
import { Worker } from "bullmq";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";

dotenv.config();

const worker = new Worker(
  "pdf-processing",
  async (job) => {
    if (job.name === "process-pdf") {
      console.log("executing job process-pdf");
      const { filePath, originalName } = job.data;

      console.log(`Processing PDF: ${originalName} at ${filePath}`);
      try {
        const loader = new PDFLoader(filePath);
        const docs = await loader.load();

        const textSplitter = new CharacterTextSplitter({
          chunkSize: 300,
          chunkOverlap: 0,
        });

        const splitDocs = await textSplitter.splitDocuments(docs);

        console.log("QDRANT_URL: ", process.env.QDRANT_URL);
        const qdrantClient = new QdrantClient({
          url: process.env.QDRANT_URL || "http://localhost:6333",
        });

        const vectorStore = await QdrantVectorStore.fromDocuments(
          splitDocs,
          new OpenAIEmbeddings({
            apiKey: process.env.OPENAI_API_KEY,
            modelName: "text-embedding-3-large",
          }),
          {
            collectionName: "pdf-collection",
            client: qdrantClient,
          },
        );

        console.log("PDF successfully embedded into Qdrant");
      } catch (error) {
        console.error("Qdrant error:", error);
        throw error;
      }
    }
  },
  {
    concurrency: 5,
    connection: {
      host: process.env.VALKEY_HOST || "valkey",
      port: Number(process.env.VALKEY_PORT) || 6379,
    },
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} has completed!`);
});
