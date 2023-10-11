const Policy = ({ close }: { close: any }) => {
  return (
    <div className="flex flex-col justify-center items-start bg-white p-[20px]">
      <h1 className="font-bold text-[30px]">사용규칙</h1>
      <p>
        1. 공익의 목적으로 학생들이 원하는 다양한 음악을 사감선생님이 참고 하실
        수 있도록 하기 위해 설계한 서비스입니다.
      </p>
      <p>
        2. 음악 추가,삭제, 좋아요등의 기능들이 실시간으로 보여지는 서비스이니,
        신중하게 사용하시길 바랍니다.
      </p>
      <p>
        3. 선정적인 곡, 욕이 나오는 곡, 불편함을 유발하는 오디오가 있는 유튜브
        영상은 자제 부탁드립니다.
      </p>
      <p>
        4. 최근에 시작한 서비스이니 사감선생님께서 잘 활용할 수 있도록 많은 호응
        부탁드립니다.
      </p>
      <p>5. 주 또는 달마다 플레이리스트 초기화가 될 수 있습니다!</p>
      <p>
        결론 : 모두에게 도움이 될 수 있는 곡으로 추천해주시면 감사하겠습니다.
      </p>
      <br></br>
      <div className="flex flex-col justify-center items-end w-full">
        <p className="text-[10px] font-bold">
          * 메시지는 확인 후 24시간이 지나면 다시 나타납니다.
        </p>

        <button onClick={close} className="bg-black text-white p-[7px]">
          네 확인했습니다.
        </button>
      </div>
    </div>
  );
};

export default Policy;
