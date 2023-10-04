import { useMutation, useQuery } from "react-query";
import { USER_CACH_KEYS } from "./queryKey";
import instance from "../axiosInstance";
import { User, UserLoginDto } from "../types/user";

const useUserQuery = () => {
  return useQuery({
    queryKey: USER_CACH_KEYS.userKey,
    queryFn: async () => {
      return instance
        .get("/api/oauth/getUser")
        .then((res) => res?.data as User);
    },
  });
};

const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      localStorage.setItem("access_token", "");
      location.reload();
    },
  });
};

const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (loginDto: UserLoginDto) => {
      const { data } = await instance.post("/api/oauth/login", loginDto);
      localStorage.setItem("access_token", data.accessToken);
      instance.defaults.headers["access_token"] = data.access_token;
    },
  });
};

const useBsmLoginMutation = () => {
  return useMutation({
    mutationFn: async (authCode: string) => {
      const { data } = await instance.post("/api/oauth/bsmLogin", {
        code: authCode,
      });
      localStorage.setItem("access_token", data.accessToken);
      instance.defaults.headers["access_token"] = data.access_token;
    },
  });
};

export {
  useUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useBsmLoginMutation,
};
