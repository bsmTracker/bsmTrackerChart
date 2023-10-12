import { useEffect, useState } from "react";
import { chartSocket } from "../socket/chart";
import { ChartTrackSk, ChartTrack } from "../types/chart";
import { AiOutlineLike } from "@react-icons/all-files/ai/AiOutlineLike";
import { AiFillLike } from "@react-icons/all-files/ai/AiFillLike";
import { BsPersonFill } from "@react-icons/all-files/bs/BsPersonFill";
import { AiFillPlayCircle } from "@react-icons/all-files/ai/AiFillPlayCircle";
import { RiFolderMusicLine } from "@react-icons/all-files/ri/RiFolderMusicLine";
import {
  useCancelRecommendMutation,
  useMyLikesQuery,
  useMyRecommendsQuery,
  useToggleLikeMutation,
} from "../query/chart";
import SearchTrackModal from "../components/SearchTrackModal";
import { ModalUI } from "../components/globalStyle";
import { useLogoutMutation, useUserQuery } from "../query/user";
import { useRouter } from "next/router";
import Policy from "./policy";

const Home = () => {
  const toggleLikeMutation = useToggleLikeMutation();
  const myRecommendsQuery = useMyRecommendsQuery();
  const myLikesQuery = useMyLikesQuery();
  const userQuery = useUserQuery();
  const logoutMutation = useLogoutMutation();

  const [chartTrackList, setChartTrackList] = useState<ChartTrackSk[]>([]);
  const [searchTrackModal, setSearchTrackModal] = useState(false);
  const [policyModal, setPolicyModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    chartSocket.connect();
    chartSocket.on("chart", (chartTrackList) => {
      setChartTrackList(chartTrackList);
    });
    return () => {
      chartSocket.disconnect();
    };
  }, [chartSocket]);

  const loginInOrOutHandler = async () => {
    if (userQuery?.data?.name) {
      //로그아웃
      await logoutMutation.mutateAsync();
    } else {
      router.push(
        "https://auth.bssm.kro.kr/oauth?clientId=c53c85eb&redirectURI=http://10.129.57.9:5000/callback"
      );
    }
  };

  useEffect(() => {
    const policyModalCheckDateStr = localStorage.getItem(
      "policy_modal_check_date"
    ) as string;
    if (policyModalCheckDateStr) {
      let expiredCheckDate = new Date(policyModalCheckDateStr);
      expiredCheckDate.setHours(expiredCheckDate.getHours() + 24);
      if (expiredCheckDate < new Date()) {
        setPolicyModal(true);
      }
    } else {
      setPolicyModal(true);
    }
  }, []);

  const policyModalClose = () => {
    localStorage.setItem("policy_modal_check_date", new Date().toISOString());
    setPolicyModal(false);
  };

  return (
    <div className="flex flex-col px-[10px] bg-white relative h-full w-full">
      <div className="flex flex-col justify-center items-center p-3">
        <div className="flex flex-row justfiy-center items-center">
          <img
            className="w-[50px]"
            src="https://avatars.githubusercontent.com/u/136763541?s=200&v=4"
          />
          <p className="text-[40px] font-bold">BsmPlaylist</p>
        </div>
        <p className="text-[16px] font-bold">추천곡 실시간 차트 서비스</p>
      </div>
      <div className=" flex flex-row justify-center items-center gap-3">
        <p className="text-[15px] font-bold">
          {userQuery.data?.name ? `${userQuery?.data?.name}님 반가워요 :)` : ""}
        </p>
        <a
          onClick={loginInOrOutHandler}
          className="bg-black text-white p-2 cursor-pointer rounded-lg text-[8px]"
        >
          {userQuery?.data?.name ? "로그아웃" : "bsm 계정 로그인"}
        </a>
      </div>
      <div className="mt-[50px] mx-[11px] pb-[200px] gap-3 flex flex-col justify-center items-center">
        {chartTrackList?.map((chartTrack, idx) => {
          const isLiked = myLikesQuery.data?.find(
            (myLikeTrack) => myLikeTrack.code === chartTrack.code
          )
            ? true
            : false;
          return (
            <ChartTrackCo
              key={chartTrack.id}
              chartTrack={chartTrack}
              idx={idx}
              isLiked={isLiked}
              toggleLikeMutation={toggleLikeMutation}
            />
          );
        })}
      </div>
      <div className="fixed w-full bottom-0 p-3 left-0 flex flex-row justify-center items-center">
        {(myRecommendsQuery.data?.length ?? 0) > 0 ? (
          myRecommendsQuery.data?.map((chartTrack, idx) => {
            return (
              <MyRecommendChartTrackCo
                key={chartTrack.code}
                chartTrack={chartTrack}
              />
            );
          })
        ) : (
          <button
            className="bg-black text-white p-3 rounded-lg flex flex-row gap-2"
            onClick={() => setSearchTrackModal(true)}
          >
            <RiFolderMusicLine size={20} />
            노래 추천하기
          </button>
        )}
      </div>
      <ModalUI
        open={searchTrackModal}
        onClose={() => setSearchTrackModal(false)}
      >
        <SearchTrackModal
          open={searchTrackModal}
          close={() => setSearchTrackModal(false)}
        />
      </ModalUI>
      <ModalUI open={policyModal}>
        <Policy close={policyModalClose} />
      </ModalUI>
    </div>
  );
};

const MyRecommendChartTrackCo = ({
  chartTrack,
}: {
  chartTrack: ChartTrack;
}) => {
  const cancelRecommendMutation = useCancelRecommendMutation();
  return (
    <div className="flex justify-between items-center gap-3 bg-gray-200 opacity-95 min-w-[200px]">
      <div className="flex flex-row justify-center items-center gap-3">
        <img className="w-[100px]" src={chartTrack.image}></img>
        <p className="font-bold text-[16px] line-clamp-2 text-ellipsis overflow-hidden ...">
          {chartTrack.name}
        </p>
      </div>
      <p
        onClick={async () =>
          await cancelRecommendMutation.mutateAsync(chartTrack.code)
        }
        className="cursor-pointer w-[15px] mx-3"
      >
        X
      </p>
    </div>
  );
};

const ChartTrackCo = ({
  chartTrack,
  idx,
  isLiked,
  toggleLikeMutation,
}: {
  chartTrack: ChartTrackSk;
  idx: number;
  isLiked: boolean;
  toggleLikeMutation: any;
}) => {
  return (
    <div
      className="flex flex-row items-center gap-2 bg-slate-100 rounded-lg p-[10px] min-h-[65px] max-h-[80px] max-w-[600px] w-full min-w-[300px]"
      key={chartTrack.id}
    >
      <p className="text-[18px] font-bold">{idx + 1}</p>
      <img
        className="min-h-[50px] h-[50px] min-w-[80px] object-cover"
        src={chartTrack.image}
      ></img>
      <div className="w-full">
        <p className=" font-bold text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] line-clamp-1 text-ellipsis overflow-hidden ...">
          {chartTrack.name}
        </p>
        <div className="flex flex-row justify-row gap-3 text-[15px]">
          <div className="flex flex-row justify-center items-center gap-1">
            {isLiked ? (
              <AiFillLike
                onClick={async () =>
                  await toggleLikeMutation.mutateAsync(chartTrack.code)
                }
                cursor={"pointer"}
                size={20}
              />
            ) : (
              <AiOutlineLike
                onClick={async () =>
                  await toggleLikeMutation.mutateAsync(chartTrack.code)
                }
                cursor={"pointer"}
                size={20}
              />
            )}
            <p>{chartTrack.likeCount}</p>
          </div>
          <div className="flex flex-row justify-center items-center gap-1">
            <BsPersonFill size={20} />
            <p className="">{chartTrack.user?.name}</p>
          </div>
        </div>
      </div>
      <AiFillPlayCircle
        onClick={() =>
          window.open(`https://youtube.com/watch?v=${chartTrack.code}`)
        }
        cursor="pointer"
        size={30}
      />
    </div>
  );
};

export default Home;
