export const authReducer = async (state = null, action) => {
  switch (action.type) {
    case "IS_USER_SAVED":
      return state;

    case "LOGIN":
      state = action.payload;
      return state;

    case "LOGOUT":
      state = null;
      return state;
    case "PROFILE_PIC_UPDATE":
      let user = state;
      user.profilePic = action.payload;
      state = user;
      return state;

    default:
      return state;
  }
};
