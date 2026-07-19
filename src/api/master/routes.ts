import { FastifyInstance } from "fastify";
import {
  handleGetCities,
  handleGetCountries,
  handleGetStates,
} from "./handlers";

export default function masterRoutes(app: FastifyInstance) {
  app.get(
    "/countries",
    {
      schema: {
        tags: ["Master Data"],
        summary: "List countries",
      },
    },
    handleGetCountries,
  );
  app.get(
    "/states",
    {
      schema: {
        tags: ["Master Data"],
        summary: "List states for a country",
        querystring: {
          type: "object",
          required: ["country"],
          properties: { country: { type: "string", minLength: 1 } },
        },
      },
    },
    handleGetStates,
  );
  app.get(
    "/cities",
    {
      schema: {
        tags: ["Master Data"],
        summary: "List cities for a state",
        querystring: {
          type: "object",
          required: ["country", "state"],
          properties: {
            country: { type: "string", minLength: 1 },
            state: { type: "string", minLength: 1 },
          },
        },
      },
    },
    handleGetCities,
  );
}
