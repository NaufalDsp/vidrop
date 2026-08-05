import { handleResolveRequest } from "../server/resolve-handler.js";

export const maxDuration = 60;

export default {
  fetch: handleResolveRequest,
};
