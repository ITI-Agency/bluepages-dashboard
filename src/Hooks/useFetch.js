import { useEffect, useReducer, useRef } from "react";

function useFetch(fetchMethod, options = null) {
  const cache = useRef({});

  // Used to prevent state update if the component is unmounted
  const cancelRequest = useRef;

  const initialState = {
    error: undefined,
    data: undefined,
  };

  // Keep state logic separated
  const fetchReducer = (state, action) => {
    switch (action.type) {
      case "loading":
        return { ...initialState };
      case "fetched":
        return { ...initialState, data: action.payload };
      case "error":
        return { ...initialState, error: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    // Do nothing if the fetchMethod is not given
    if (!fetchMethod) return;

    cancelRequest.current = false;

    const fetchData = async () => {
      dispatch({ type: "loading" });

      // If a cache exists for this fetchMethod, return it
      if (cache.current[fetchMethod]) {
        dispatch({ type: "fetched", payload: cache.current[fetchMethod] });
        return;
      }

      try {
        const response = await fetchMethod();

        if (response.statusText !== "OK") {
          throw new Error(response.statusText);
        }

        cache.current[fetchMethod] = response.data;
        if (cancelRequest.current) return;

        dispatch({ type: "fetched", payload: response.data });
      } catch (error) {
        if (cancelRequest.current) return;

        dispatch({ type: "error", payload: error });
      }
    };

    void fetchData();

    // Use the cleanup function for avoiding a possibly...
    // ...state update after the component was unmounted
    return () => {
      cancelRequest.current = true;
    };
  }, [fetchMethod]);

  return state;
}

export default useFetch;
