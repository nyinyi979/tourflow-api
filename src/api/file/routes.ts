import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import {
  handleCreateBatchFiles,
  handleFileUploadTmp,
  handleUploadFile,
} from "./handlers";
import { fileUrlBodySchema } from "./schemas";

const fileRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.post("/", {
    schema: { tags: ["Files"], summary: "Upload a temporary file" },
    handler: handleFileUploadTmp,
  });
  app.post("/batch", {
    schema: { tags: ["Files"], summary: "Upload temporary files" },
    handler: handleCreateBatchFiles,
  });
  app.post("/upload", {
    schema: {
      tags: ["Files"],
      summary: "Move a temporary file to permanent storage",
      body: fileUrlBodySchema,
    },
    handler: handleUploadFile,
  });
};

export default fileRoutes;
