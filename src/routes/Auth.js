import React, {useState} from "react";
import { authService, firebaseInstance } from "../fBase";

const Auth = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [ newAccount, setnewAccount ] = useState(true)
    const [ error, setError ] = useState("");
    const onChange = e => {
        const {target: {name, value}} = e;
        if ( name === "email") {
            setEmail(value);
        } else if ( name === "password") {
            setPassword(value);
        }
    }
    const onSubmit = async(e) => {
        e.preventDefault();
        try{
            let data;
            if(newAccount){
                //create account
                data = await authService.createUserWithEmailAndPassword(email, password)
            } else {
                //log in
                data = await authService.signInWithEmailAndPassword(email, password)
            }
        } catch(error) {
            setError(error.message)
        }
    };
    const toggleAccount = () => setnewAccount((prev) => !prev)
    
    // 구글, 깃헙 로그인하기
    const onSocialClick = async (event) => {
        //event.target.name 이랑 같은역활 name 찾기
        const {target: {name}} = event;
        let provider;
        if ( name === "google"){
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        } else if (name === "github") {
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }
        await authService.signInWithPopup(provider);
    }
    
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input name="email" type="text" placeholder="Email" required value={email} onChange={onChange}/>
                <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange}/>
                <input type="submit" value={newAccount? 'Create Account': 'Log In'}/>
                {error}
            </form>
            <span onClick={toggleAccount}>
                {newAccount? "Sign In" : "Create Account"}
            </span>
            <div>
                <button name="google" onClick={onSocialClick}>Continue with Google</button>
                <button name="github" onClick={onSocialClick}>Continue with Github</button>
            </div>
        </div>
    )

}
export default Auth;