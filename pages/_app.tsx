import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import instance from "../axiosInstance";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
      },
    })
  );

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    instance.defaults.headers["access_token"] = accessToken;
    instance.defaults.headers.common["access_token"] = accessToken;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer limit={1} />
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;
