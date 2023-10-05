import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";

const RESPONSE = {
  STATUS: {
    OK: 200,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    UNVERIFY: 400,
    NOTFOUND: 404,
  },
};

const responseInterceptors = (response: AxiosResponse) => {
  return response;
};

const responseErrorInterceptors = async (errorResponse: any) => {
  const { response } = errorResponse;
  if (response?.status === RESPONSE.STATUS.UNAUTHORIZED) {
    toast("로그인을 해야합니다.");
    await new Promise((resolve) =>
      setTimeout(() => {
        location.href = "/";
      }, 1000)
    );
  } else if (response?.status === RESPONSE.STATUS.FORBIDDEN) {
    toast("해당 작업은 권한에 맞는 작업이 아닙니다.");
  } else if (response?.status !== RESPONSE.STATUS.OK) {
    if (response?.data?.message) {
      toast(response?.data?.message);
    }
  }
  return Promise.reject(errorResponse);
};

function requestInterceptors(config: any) {
  if (typeof window !== "undefined") {
    const accessToken = localStorage.getItem("access_token");
    config.headers["access_token"] = accessToken;
  }
  return config;
}

// axios.defaults.withCredentials = true;
axios.interceptors.request.use(requestInterceptors);
axios.interceptors.response.use(
  responseInterceptors,
  responseErrorInterceptors
);

export default axios;
