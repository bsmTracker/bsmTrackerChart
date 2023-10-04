import { SearchedTrack } from "../types/track";
import tw from "tailwind-styled-components";
import Marquee from "react-fast-marquee";

const SearchedTrackCo = ({
  searchedTrack,
  selected,
  onClick,
}: {
  searchedTrack: SearchedTrack;
  selected: boolean;
  onClick: any;
}) => {
  const isOverTitleLength = searchedTrack.name.length > 18;
  return (
    <SearchedTrackUI selected={selected} onClick={onClick}>
      <RowUI>
        <SearchedTrackImgUI src={searchedTrack.image} />
        <ColUI>
          {selected && isOverTitleLength ? (
            <SearchedTrackInfoTitleUI>
              <Marquee speed={10} direction={"left"} pauseOnHover={true}>
                {searchedTrack.name}
              </Marquee>
            </SearchedTrackInfoTitleUI>
          ) : (
            <SearchedTrackInfoTitleUI>
              {searchedTrack.name}
            </SearchedTrackInfoTitleUI>
          )}
          <SearchedTrackInfoTextUI>
            {searchedTrack.duration_ms / 1000} 초
          </SearchedTrackInfoTextUI>
        </ColUI>
      </RowUI>
      <SearchedTrackSaveInfoUI saveStatus={false}>
        저장됨
      </SearchedTrackSaveInfoUI>
    </SearchedTrackUI>
  );
};

const SearchedTrackUI = tw.div<{
  selected: boolean;
}>`flex flex-row justify-between cursor-pointer hover:bg-slate-400 min-h-[50px] ${(
  props
) => (props?.selected ? "border-black border-[2px]" : "border-none")}`;
const SearchedTrackImgUI = tw.img`w-[80px] object-cover `;
const SearchedTrackInfoTitleUI = tw.p`text-[18px] w-full text-ellipsis overflow-hidden`;
const SearchedTrackInfoTextUI = tw.p`text-[12px]`;
const ColUI = tw.div`flex flex-col`;
const RowUI = tw.div`flex flex-row gap-2`;
const SearchedTrackSaveInfoUI = tw(SearchedTrackInfoTextUI)<{
  saveStatus: boolean;
}>`
w-[100px] font-bold flex flex-row justify-end ${({ saveStatus }) =>
  saveStatus ? "" : "hidden"}
`;

export default SearchedTrackCo;
