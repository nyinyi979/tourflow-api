"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetCities = exports.handleGetStates = exports.handleGetCountries = void 0;
const data_1 = require("../../data");
const messages_1 = require("../messages");
const handleGetCountries = (req, res) => {
    const countries = Object.keys(data_1.countryData);
    res.status(200).send({ data: countries });
};
exports.handleGetCountries = handleGetCountries;
const handleGetStates = (req, res) => {
    const { country } = req.query;
    const countryEntry = data_1.countryData[country];
    if (!countryEntry) {
        return res.status(404).send({
            ...messages_1.messages.notFound,
            message: `Country "${country}" was not found.`,
        });
    }
    const states = Object.keys(countryEntry);
    res.status(200).send({ data: states });
};
exports.handleGetStates = handleGetStates;
const handleGetCities = (req, res) => {
    const { state, country } = req.query;
    const countryEntry = data_1.countryData[country];
    if (!countryEntry) {
        return res.status(404).send({
            ...messages_1.messages.notFound,
            message: `Country "${country}" was not found.`,
        });
    }
    if (!Object.prototype.hasOwnProperty.call(countryEntry, state)) {
        return res.status(404).send({
            ...messages_1.messages.notFound,
            message: `State "${state}" was not found in ${country}.`,
        });
    }
    const cities = countryEntry[state];
    res.status(200).send({ data: cities });
};
exports.handleGetCities = handleGetCities;
