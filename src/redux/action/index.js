export const login = (user) => {
  return {
    type: "LOGIN",
    payload: user,
  };
};

export const logout = () => {
  return {
    type: "LOGOUT",
  };
};

export const isUserSaved = () => {
  return { type: "IS_USER_SAVED" };
};
export const profilePicUpdate = (img) => {
  return { type: "PROFILE_PIC_UPDATE", payload: img };
};
