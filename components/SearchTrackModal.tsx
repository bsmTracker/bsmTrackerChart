import { useEffect, useMemo, useState } from "react";
import { SearchedTrack as SearchedTrackType } from "../types/track";
import SearchedTrack from "./SearchedTrackCo";
import tw from "tailwind-styled-components";
import { LoadingCo } from "./global";
import { ModalUI } from "./globalStyle";
import { useQueryClient } from "react-query";
import { useRecommendMutation, useSearchTrackQuery } from "../query/chart";
import { CHART_CASH_KEYS } from "../query/queryKey";

const SearchTrackModal = ({ open, close }: { open: boolean; close: any }) => {
  const [keyword, setKeyword] = useState<string>("");
  const [keywordTimeout, setKeywordTimeout] = useState<any>(null);
  const [selectedTrack, setSelectedTrack] = useState<SearchedTrackType | null>(
    null
  );
  const recommendTrackMutation = useRecommendMutation();
  const searchTrackQuery = useSearchTrackQuery(keyword);

  const queryClient = useQueryClient();

  const searchedTracks = useMemo(() => {
    if (searchTrackQuery.isLoading) return [];
    return searchTrackQuery.data;
  }, [searchTrackQuery.data, selectedTrack]);

  useEffect(() => {
    const timeoutO = setTimeout(async () => {
      setSelectedTrack(null);
      await searchTrackQuery.refetch();
    }, 500);
    setKeywordTimeout(timeoutO);
    return () => {
      if (keywordTimeout) clearTimeout(keywordTimeout);
    };
  }, [keyword]);

  const searchBtnHandler = () => searchTrackQuery.refetch();
  const searchInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };
  const searchedTrackClickHandler = (searchedTrack: SearchedTrackType) => {
    if (selectedTrack?.code === searchedTrack.code) {
      setSelectedTrack(null);
    } else {
      setSelectedTrack(searchedTrack);
    }
  };
  const recommendSelectedTrackBtnHandler = async () => {
    if (selectedTrack) {
      await recommendTrackMutation.mutateAsync(selectedTrack.code, {
        onSuccess: async () => {
          await queryClient.invalidateQueries(CHART_CASH_KEYS.MyRecommends);
        },
      });
    }
  };

  const listenSelectedTrackBtnHandler = () => {
    if (selectedTrack) {
      window.open("https://youtube.com/watch?v=" + selectedTrack.code);
    }
  };

  return (
    <SearchTrackUI>
      <ModalExplainText>음악 검색</ModalExplainText>
      <SearchGroupUI>
        <SearchInputUI
          value={keyword}
          onChange={searchInputHandler}
          placeholder="원하는 음악명을 입력해주세요"
        />
        <SearchBtnUI onClick={searchBtnHandler}>검색</SearchBtnUI>
      </SearchGroupUI>
      {searchTrackQuery.isLoading && <p>로딩중</p>}
      <SearchedTrackScrollWrapperUI>
        {searchedTracks?.map(
          (searchedTrack: SearchedTrackType, idx: number) => {
            const selectedStatus = selectedTrack?.code === searchedTrack.code;
            return (
              <SearchedTrack
                key={searchedTrack.code}
                searchedTrack={searchedTrack}
                selected={selectedStatus}
                onClick={() => {
                  searchedTrackClickHandler(searchedTrack);
                }}
              />
            );
          }
        )}
      </SearchedTrackScrollWrapperUI>
      <SearchedTrackBtnGroupUI>
        {selectedTrack && (
          <>
            <SearchedTrackBtnUI onClick={recommendSelectedTrackBtnHandler}>
              ♫ 추천하기
            </SearchedTrackBtnUI>
            <SearchedTrackBtnUI onClick={listenSelectedTrackBtnHandler}>
              👂 미리듣기
            </SearchedTrackBtnUI>
          </>
        )}
        <SearchedTrackBtnUI onClick={close}>닫기</SearchedTrackBtnUI>
      </SearchedTrackBtnGroupUI>
      <LoadingCo isLoading={recommendTrackMutation.isLoading} />
    </SearchTrackUI>
  );
};

const SearchTrackUI = tw.div`bg-white p-10 flex flex-col min-w-[180px] w-[500px] rounded-lg`;
const ModalExplainText = tw.p`text-[35px] mb-[10px]`;
const SearchGroupUI = tw.div`flex flex-row items-center h-[40px]`;
const SearchInputUI = tw.input`bg-[#F5F5F5] w-full h-full px-5 py-2`;
const SearchBtnUI = tw.button`w-[50px] h-full bg-black text-white`;
const SearchedTrackScrollWrapperUI = tw.div`overflow-y-scroll h-[300px] py-[5px] my-[30px] flex flex-col gap-3`;
const SearchedTrackBtnGroupUI = tw.div`flex flex-row gap-2 items-center justify-center`;
const SearchedTrackBtnUI = tw.button`bg-black text-white w-[100px] h-[40px]`;

export default SearchTrackModal;
