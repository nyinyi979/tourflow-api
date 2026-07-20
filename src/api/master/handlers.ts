import { FastifyReply, FastifyRequest } from "fastify";
import { countryData } from "../../data";
import { messages } from "../messages";
import { TypeBoxRequest } from "../request";
import { cityQuerySchema, stateQuerySchema } from "./schemas";

export const handleGetCountries = (_req: FastifyRequest, res: FastifyReply) => {
  const countries = Object.keys(countryData);
  return res.status(200).send({ data: countries });
};

export const handleGetStates = (
  req: TypeBoxRequest<{ querystring: typeof stateQuerySchema }>,
  res: FastifyReply,
) => {
  const { country } = req.query;
  const countryEntry = countryData[country];

  if (!countryEntry) {
    return res.status(404).send({
      ...messages.notFound,
      message: `Country "${country}" was not found.`,
    });
  }

  const states = Object.keys(countryEntry);
  return res.status(200).send({ data: states });
};

export const handleGetCities = (
  req: TypeBoxRequest<{ querystring: typeof cityQuerySchema }>,
  res: FastifyReply,
) => {
  const { state, country } = req.query;
  const countryEntry = countryData[country];

  if (!countryEntry) {
    return res.status(404).send({
      ...messages.notFound,
      message: `Country "${country}" was not found.`,
    });
  }

  if (!Object.prototype.hasOwnProperty.call(countryEntry, state)) {
    return res.status(404).send({
      ...messages.notFound,
      message: `State "${state}" was not found in ${country}.`,
    });
  }

  const cities = countryEntry[state];
  return res.status(200).send({ data: cities });
};
