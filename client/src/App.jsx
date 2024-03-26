import React from "react";
import { LoadingProvider, useLoading } from "./contexts/LoadingContext";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./Layout";
import LoadingBar from "react-top-loading-bar";

function TopLoader() {
  const { progress, setProgress, isLoading } = useLoading();

  return (
    isLoading && (
      <div className=" absolute top-0">
        <LoadingBar
          progress={progress}
          height={3}
          color="magenta"
          onLoaderFinished={() => setProgress(0)}
        />
      </div>
    )
  );
}

export default function App() {
  return (
    <div>
      <LoadingProvider>
        <TopLoader />
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </LoadingProvider>
    </div>
  );
}
