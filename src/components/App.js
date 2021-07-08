import React, { useState, useEffect } from "react";
import AppRouter from "./Router";
import { authService } from "../fBase";

function App() {
  const [ init, setInit ] = useState(false);
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ userObj, setUserObj ] = useState(null)
  //authService.currentUser는 실제 로그인되었는지 잘확인할수가 없다. 그래서 useEffect사용 
  //firebase가 시작도 전에 로그인유무를 체크하기때문
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user){
        setIsLoggedIn(true);
        //user 통째로 가져오는것 그러나 처리하기엔 너무많은양의 내용이들어옴
        // setUserObj(user);
        setUserObj({
          //내가필요한 3가지 정보만 받아옴
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        })
      } else {
        setIsLoggedIn(false)
      }
      setInit(true);
    });
  }, [])
  //username 자동 업데이트해주는기능
  const refreshUser = async () => {
    // console.log(authService.currentUser.displayName)
    //크기가 커서 이름이 바뀌지 않는다 보낸시점의 구분이 힘들기때문 react 가 판단하기 힘듬
    // await setUserObj(authService.currentUser)
    const user = authService.currentUser;
    setUserObj({
      //내가필요한 3가지 정보만 받아옴
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    })
  }
  
  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} userObj={userObj} isLoggedIn={isLoggedIn}/> : "Initializing...."}
      <footer>&copy; {new Date().getFullYear()}Switter</footer>
    </>
  );
}

export default App;
