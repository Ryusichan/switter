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
        setUserObj(user);
      } else {
        setIsLoggedIn(false)
      }
      setInit(true);
    });
  }, [])
  
  return (
    <>
      {init ? <AppRouter userObj={userObj} isLoggedIn={isLoggedIn}/> : "Initializing...."}
      <footer>&copy; {new Date().getFullYear()}Switter</footer>
    </>
  );
}

export default App;
