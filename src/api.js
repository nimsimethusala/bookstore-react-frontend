import axios from "axios";

// Change this to your GCP Gateway IP when deploying to cloud
// e.g. http://34.xx.xx.xx:8080
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const gateway = axios.create({ baseURL: BASE_URL });

export const bookApi    = { ...gateway, ...{ baseURL: BASE_URL + "/api/v1/books" } };
export const orderApi   = { ...gateway, ...{ baseURL: BASE_URL + "/api/v1/orders" } };

// All requests go through the API Gateway
export default gateway;
