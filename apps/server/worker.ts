import { Worker } from "bullmq";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";

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

      console.log(`Split into ${splitDocs.length} chunks.`);
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
