import { FastifyReply, FastifyRequest } from "fastify";
import { countryData } from "../../data";
import { messages } from "../messages";

export const handleGetCountries = (req: FastifyRequest, res: FastifyReply) => {
  const countries = Object.keys(countryData);
  res.status(200).send({ data: countries });
};

export const handleGetStates = (req: FastifyRequest, res: FastifyReply) => {
  const { country } = req.query as { country: string };
  const countryEntry = countryData[country];

  if (!countryEntry) {
    return res.status(404).send({
      ...messages.notFound,
      message: `Country "${country}" was not found.`,
    });
  }

  const states = Object.keys(countryEntry);
  res.status(200).send({ data: states });
};

export const handleGetCities = (req: FastifyRequest, res: FastifyReply) => {
  const { state, country } = req.query as { state: string; country: string };
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
  res.status(200).send({ data: cities });
};
