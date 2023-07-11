import { useReducer, createContext, useEffect } from "react";

const INITIAL_STATE = {
  user: null,
  error: null,
};

export const ViewUserContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { user: action.payload, error: null };
    case "UNSET_USER":
      return { user: action.payload, error: null };
    default:
      return state;
  }
};
export const ViewUserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  return (
    <ViewUserContext.Provider
      value={{
        user: state.user,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </ViewUserContext.Provider>
  );
};
