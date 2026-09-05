import dotenv from "dotenv";
import { Worker } from "bullmq";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";

dotenv.config();

const worker = new Worker(
  "pdf-processing",
  async (job) => {
    if (job.name === "process-pdf") {
      const { filePath, originalName } = job.data;
      console.log(`Processing PDF: ${originalName} at ${filePath}`);

      const loader = new PDFLoader(filePath);
      const docs: Document[] = await loader.load();

      const textSplitter = new CharacterTextSplitter({
        chunkSize: 300,
        chunkOverlap: 0,
      });
      const splitDocs = await textSplitter.splitDocuments(docs);

      const qdrantClient = new QdrantClient({
        url: process.env.QDRANT_URL || "http://localhost:6333",
      });

      try {
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

        console.log(`vectorStore: ${vectorStore}`);
      } catch (error) {
        console.log("error: ", error);
      }

      // You can add more processing logic here if needed

      // Add your PDF processing logic here
    }
  },
  {
    concurrency: 5,
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} has completed!`);
});
