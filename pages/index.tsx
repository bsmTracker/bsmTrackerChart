import { useEffect, useState } from "react";
import { chartSocket } from "../socket/chart";
import { ChartTrackSk, ChartTrack } from "../types/chart";
import { AiOutlineLike } from "@react-icons/all-files/ai/AiOutlineLike";
import { AiFillLike } from "@react-icons/all-files/ai/AiFillLike";
import { BsPersonFill } from "@react-icons/all-files/bs/BsPersonFill";
import {
  useCancelRecommendMutation,
  useMyLikesQuery,
  useMyRecommendsQuery,
  useToggleLikeMutation,
} from "../query/chart";
import SearchTrackModal from "../components/SearchTrackModal";
import { ModalUI } from "../components/globalStyle";
import { useUserQuery } from "../query/user";
import { useRouter } from "next/router";

const Home = () => {
  const toggleLikeMutation = useToggleLikeMutation();
  const myRecommendsQuery = useMyRecommendsQuery();
  const myLikesQuery = useMyLikesQuery();
  const userQuery = useUserQuery();

  const [chartTrackList, setChartTrackList] = useState<ChartTrackSk[]>([]);
  const [searchTrackModal, setSearchTrackModal] = useState(false);

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

  const loginInOrOutHandler = () => {
    if (userQuery?.data?.name) {
      //로그아웃
    } else {
      router.push(
        "https://auth.bssm.kro.kr/oauth?clientId=c53c85eb&redirectURI=http://10.129.57.9:5000/callback"
      );
    }
  };

  return (
    <div className="flex flex-col px-[30px] bg-white relative h-full w-full">
      <div className="flex flex-col justify-center items-center p-3">
        <div className="flex flex-row justfiy-center items-center">
          <img
            className="w-[50px]"
            src="https://avatars.githubusercontent.com/u/136763541?s=200&v=4"
          />
          <p className="text-[40px] font-bold">bsmTracker</p>
        </div>
        <p className="text-[16px] font-bold">추천곡 차트 서비스</p>
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

      <div className="mt-[50px] mx-[11px] gap-3 flex flex-col justify-center items-center">
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
      <div className="fixed w-full bottom-0 p-3 left-0  flex flex-row justify-center items-center">
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
          <button onClick={() => setSearchTrackModal(true)}>곡 추천하기</button>
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
    <div className="flex justify-between items-center gap-3 bg-slate-100 min-w-[200px]">
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
      <p className="text-[14px] font-bold">{idx + 1}</p>
      <img
        className="w-[80px] object-cover h-full"
        src={chartTrack.image}
      ></img>
      <div className="w-full">
        <p className=" font-bold text-[15px] line-clamp-2 text-ellipsis overflow-hidden ...">
          {chartTrack.name}
        </p>
        <div className="flex flex-row justify-row gap-3 text-[15px]">
          <div className="flex flex-row justify-center items-center gap-1">
            {isLiked ? (
              <AiFillLike
                onClick={async () =>
                  await toggleLikeMutation.mutateAsync(chartTrack.code)
                }
                cursor={"pointetruncater"}
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
            <p>{chartTrack.user?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
