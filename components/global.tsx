import { ModalUI } from "./globalStyle";

export const LoadingCo = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <ModalUI open={isLoading}>
      <div className="flex flex-col justify-center items-center">
        <img src="https://img.mk.co.kr/mkde/ic_loading_img.gif"></img>
      </div>
    </ModalUI>
  );
};
