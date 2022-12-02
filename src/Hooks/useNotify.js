import React, { createContext, useContext, useState, useEffect } from "react";
import MDSnackbar from "components/MDSnackbar";

const notifyContext = createContext();

function useNotify() {
  return useContext(notifyContext);
}

const SuccessSB = (props) => {
  if (!props.open) return null;
  console.log("this is from sucess:>", props);
  return (
    <MDSnackbar
      color="success"
      icon="check"
      title={props.title}
      content={props.content}
      dateTime={props.time}
      open={props.open}
      onClose={props.onClose}
      close={props.onClose}
      bgWhite
    />
  );
};

const InfoSB = (props) => {
  return (
    <MDSnackbar
      icon="notifications"
      title={props.title}
      content={props.content}
      dateTime={props.time}
      open={props.open}
      onClose={props.close}
      close={props.close}
      bgWhite
    />
  );
};

const WarningSB = (props) => {
  return (
    <MDSnackbar
      color="warning"
      icon="star"
      title={props.title}
      content={props.content}
      dateTime={props.time}
      open={props.open}
      onClose={props.close}
      close={props.close}
      bgWhite
    />
  );
};

const ErrorSB = (props) => {
  return (
    <MDSnackbar
      color="error"
      icon="warning"
      title={props.title}
      content={props.content}
      dateTime={props.time}
      open={props.open}
      onClose={props.close}
      close={props.close}
      bgWhite
    />
  );
};

export const NotifyProvider = ({ children }) => {
  const [notification, setNotification] = useState({});
  // useEffect(() => {
  //   setTimeout(() => {}, 400);
  //   setOpenToast(notification.open);
  // }, [notification.open]);

  return (
    <notifyContext.Provider value={{ notification, setNotification }}>
      {children}
      <NotificationComponent {...notification} />
    </notifyContext.Provider>
  );
};
export default useNotify;

const NotificationComponent = (props) => {
  const [openToast, setOpenToast] = useState({
    sucess: props.open,
    info: props.open,
    warning: props.open,
    error: props.open,
  });
  const handleClose = (type) => {
    openToast[type] = false;
    setOpenToast(openToast);
  };
  return (
    <>
      <SuccessSB
        open={openToast[props.type]}
        close={() => handleClose(props.type)}
        onClose={() => handleClose(props.type)}
        {...props}
      />
      <InfoSB
        open={openToast[props.type]}
        close={() => handleClose(props.type)}
        onClose={() => handleClose(props.type)}
        {...props}
      />
      <WarningSB
        open={openToast[props.type]}
        close={() => handleClose(props.type)}
        onClose={() => handleClose(props.type)}
        {...props}
      />
      <ErrorSB
        open={openToast[props.type]}
        close={() => handleClose(props.type)}
        onClose={() => handleClose(props.type)}
        {...props}
      />
    </>
  );
  switch (props.type) {
    case "success":
      return <SuccessSB {...props} />;
    case "info":
      return <InfoSB {...props} />;
    case "warning":
      return <WarningSB {...props} />;
    case "error":
      return <ErrorSB {...props} />;
  }
};
