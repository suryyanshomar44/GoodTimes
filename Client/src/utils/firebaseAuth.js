import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export const signInWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const userCred = await firebase.auth().signInWithPopup(provider);
    console.log(userCred);
    return userCred?.user?._delegate?.accessToken;
  } catch (e) {
    console.log(e);
  }
};

export const signInWithFacebook = async () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  try {
    const userCred = await firebase.auth().signInWithPopup(provider);
    console.log(userCred);
    return userCred?.user?._delegate?.accessToken;
  } catch (e) {
    console.log(e);
  }
};
