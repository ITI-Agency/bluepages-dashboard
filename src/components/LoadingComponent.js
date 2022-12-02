import React from "react";
import CircleLoader from "react-spinners/CircleLoader";
import useLoading from "Hooks/useLoading";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
function LoadingComponent() {
  const { loading } = useLoading();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircleLoader color="#237cea" loading={loading} cssOverride={override} size={150} />
    </div>
  );
}

export default LoadingComponent;
