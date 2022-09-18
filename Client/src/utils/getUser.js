import axios from "./axios";

const getUser = async (setUser, setIsLoading) => {
  try {
    const res = await axios.get("/api/user/isLoggedIn");
    if (res?.data?.code === 200) {
      setUser(res?.data?.data);
    }
    setIsLoading(false);
  } catch (err) {
    console.log(err);
  }
};

export default getUser;
