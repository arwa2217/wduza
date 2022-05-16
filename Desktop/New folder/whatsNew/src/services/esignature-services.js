import axios from "axios";
import server from "server";
import { AuthHeader } from "../utilities/app-preference";
const instance = axios.create({
  baseURL: `${server.apiUrl}`,
});
instance.defaults.headers.common["Authorization"] = "";
instance.interceptors.response.use(
  async (response) => {
    return response.data;
  },
  async (error) => {
    return error?.response?.data;
  }
);
instance.interceptors.request.use((config) => {
  config.headers = AuthHeader();
  return config;
});
const ESignatureServices = {
  uploadEsignMetadata: (metaData) =>
    instance.post(`/ent/v1/e-sign/file`, metaData),
  uploadEsignFile: (fileId, file, actionCorrect) =>
    instance.post(`/ent/v1/e-sign/file/${fileId}${actionCorrect ? '?actionCorrect=true' : ''}`, file),
  addRecipients: (fileId, payload) =>
    instance.post(`/ent/v1/e-sign/recipient/${fileId}`, payload),
  getRecipients: (fileId) =>
    instance.get(`/ent/v1/e-sign/recipients/${fileId}`),
  updateRecipients: (fileId, payload) =>
    instance.put(`/ent/v1/e-sign/recipient/${fileId}`, payload),
  sendFile: (fileId, payload) =>
    instance.post(`/ent/v1/e-sign/send-file/${fileId}`, payload),
  addPrivateMessage: (fileId, payload) =>
    instance.post(`/ent/v1/e-sign/private-message/${fileId}`, payload),
  voidEsignDocument: (fileId, requestingEmail, payload) =>
    instance.post(
      `/ent/v1/e-sign/void-file/${fileId}?email=${requestingEmail}`,
      payload
    ),
  generateOtpEsign: (payload, fileId) =>
    instance.post(`/ent/v1/e-sign/otpGenerator?fileId=${fileId}`, payload),
  verifyPassCode: (payload) =>
    instance.post(`ent/v1/e-sign/otpVerify`, payload),
  deleteESign: (payload) =>
    instance.put(`/ent/v1/e-sign/file`, payload),
  getHistory: (fileId) =>
    instance.get(`/ent/v1/e-sign/file/${fileId}/history`),
  getElectronicRecond: () =>
    instance.get(`/ent/v1/e-sign/ersd`),
};
export default ESignatureServices;
