import { useRouter } from "next/router";
import { useEffect } from "react";
import { useBsmLoginMutation } from "../query/user";

const Callback = () => {
  const router = useRouter();
  const bsmLoginMutation = useBsmLoginMutation();

  useEffect(() => {
    (async () => {
      if (!router.query.code) {
        return;
      }
      await bsmLoginMutation.mutateAsync(router.query.code as string, {
        onSuccess: () => {
          router.replace("/");
        },
      });
    })();
  }, [router.query.code]);

  return (
    <div>
      <p>리디렉션중..</p>
    </div>
  );
};

export default Callback;
