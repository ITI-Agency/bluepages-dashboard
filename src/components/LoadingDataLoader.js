import React from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { CircleLoader } from "react-spinners";

function LoadingDataLoader() {
  return (
    <DashboardLayout>
      <div
        style={{
          width: "100%",
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircleLoader color="#237cea" loading={true} size={150} />
      </div>
    </DashboardLayout>
  );
}

export default LoadingDataLoader;
