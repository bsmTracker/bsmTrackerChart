import { useMutation, useQuery, useQueryClient } from "react-query";
import { CHART_CASH_KEYS } from "./queryKey";
import instance from "../axiosInstance";
import { ChartTrack } from "../types/chart";
import { SearchedTrack } from "../types/track";

const useMyRecommendsQuery = () => {
  return useQuery({
    queryKey: CHART_CASH_KEYS.MyRecommends,
    queryFn: async () => {
      return instance
        .get("/api/chart/getMyRecommends")
        .then((res) => res?.data as ChartTrack[]);
    },
  });
};

const useMyLikesQuery = () => {
  return useQuery({
    queryKey: CHART_CASH_KEYS.MyLikes,
    queryFn: async () => {
      return instance
        .get("/api/chart/getMyLikes")
        .then((res) => res?.data as ChartTrack[]);
    },
  });
};

const useRecommendMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      await instance.post(`/api/chart/recommend?code=${code}`);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(CHART_CASH_KEYS.MyRecommends);
    },
  });
};
const useCancelRecommendMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      await instance.post(`/api/chart/cancelRecommend?code=${code}`);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(CHART_CASH_KEYS.MyRecommends);
    },
  });
};

const useToggleLikeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      await instance.post(`/api/chart/toggleLike?code=${code}`);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(CHART_CASH_KEYS.MyLikes);
    },
  });
};

const useSearchTrackQuery = (keyword: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryFn: async () => {
      return instance
        .get(`/api/chart/search?keyword=${keyword}`)
        .then((res) => res?.data as SearchedTrack[]);
    },
  });
};

export {
  useMyRecommendsQuery,
  useMyLikesQuery,
  useRecommendMutation,
  useCancelRecommendMutation,
  useToggleLikeMutation,
  useSearchTrackQuery,
};
