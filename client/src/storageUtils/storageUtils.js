// storageUtils.js
export const getUser = () => {
  const localStorageUser = JSON.parse(localStorage.getItem("rememberMeUser"));
  const sessionStorageUser = JSON.parse(sessionStorage.getItem("userRecord"));
  return localStorageUser || sessionStorageUser;
};
