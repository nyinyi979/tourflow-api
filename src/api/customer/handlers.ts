import { FastifyReply, FastifyRequest } from "fastify";
import { authenticateCustomer } from "../../utils/auth";
import { messages } from "../messages";
import {
  signupCustomer,
  loginCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} from "./controllers";
import {
  CustomerReadRequest,
  TCustomerLogin,
  TCustomerSignup,
  TCustomerUpdate,
} from "./types";
import { handleCustomerAvatar, removeCustomerAvatars } from "./utils";
import { NotFoundError } from "../../utils/errors";

export const handleCustomerSignup = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  let uploadedAvatar: string | null = null;
  let customerCreated = false;

  try {
    const avatarResult = await handleCustomerAvatar(
      req.body as TCustomerSignup,
    );
    const { body } = avatarResult;
    uploadedAvatar = avatarResult.uploadedAvatar;

    const customer = await signupCustomer(body);
    if (!customer) {
      await removeCustomerAvatars([uploadedAvatar]);
      return res.code(409).send({ ...messages.duplicateEmail });
    }

    customerCreated = true;
    await removeCustomerAvatars(body.removedImageUrls, customer.avatar);

    return res.code(201).send({ ...messages.createOk, data: customer });
  } catch (err) {
    if (!customerCreated) {
      await removeCustomerAvatars([uploadedAvatar]);
    }
    throw err;
  }
};

export const handleCustomerLogin = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const data = await loginCustomer(req.body as TCustomerLogin);
    if (!data) {
      return res.code(401).send({ ...messages.loginError });
    }
    return res.code(200).send({ ...messages.verifyOk, ...data });
  } catch (err) {
    throw err;
  }
};

export const handleGetCustomers = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const params = req.query as CustomerReadRequest;
    if (params.page === undefined || params.perPage === undefined) {
      return res.status(400).send({ ...messages.schemaError });
    }

    const response = await getCustomers({
      ...params,
      page: +params.page,
      perPage: +params.perPage,
    } as CustomerReadRequest);

    return res
      .status(200)
      .send({ ...messages.verifyOk, ...params, ...response });
  } catch (err) {
    throw err;
  }
};

export const handleGetCustomerByToken = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const customer = await authenticateCustomer(req, res);
    if (!customer) return;
    return res.code(200).send({ ...messages.verifyOk, data: customer });
  } catch (err) {
    throw err;
  }
};

export const handleUpdateCustomer = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  let uploadedAvatar: string | null = null;
  let customerUpdated = false;

  try {
    const customer = await authenticateCustomer(req, res);
    if (!customer) return;

    const avatarResult = await handleCustomerAvatar(
      req.body as TCustomerUpdate,
    );
    const { body } = avatarResult;
    uploadedAvatar = avatarResult.uploadedAvatar;

    const data = await updateCustomer(customer.id, body);
    if (!data) throw new NotFoundError("Customer not found");
    customerUpdated = true;

    const replacedAvatar =
      body.avatar !== undefined && body.avatar !== customer.avatar
        ? customer.avatar
        : null;

    await removeCustomerAvatars(
      [...(body.removedImageUrls || []), replacedAvatar],
      data.avatar,
    );

    return res.code(200).send({ ...messages.updateOk, data });
  } catch (err) {
    if (!customerUpdated) {
      await removeCustomerAvatars([uploadedAvatar]);
    }
    throw err;
  }
};

export const handleDeleteCustomer = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  try {
    const customer = await authenticateCustomer(req, res);
    if (!customer) return;
    const data = await deleteCustomer(customer.id);
    if (!data) throw new NotFoundError("Customer not found");
    await removeCustomerAvatars([data.avatar]);
    return res.code(200).send({ ...messages.deleteOk, data });
  } catch (err) {
    throw err;
  }
};
