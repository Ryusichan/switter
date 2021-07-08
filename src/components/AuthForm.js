import React,{ useState } from 'react'
import { authService } from '../fBase'

const AuthForm = () => {
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

    return(
        <>
            <form onSubmit={onSubmit} className="container">
                <input name="email" type="text" placeholder="Email" required value={email} onChange={onChange} className="authInput"/>
                <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange} className="authInput"/>
                <input type="submit" value={newAccount? 'Create Account': 'Log In'} className="authInput authSubmit"/>
                {error && <span className="authError">{error}</span>}
            </form>
            <span onClick={toggleAccount} className="authSwitch">
                {newAccount? "Sign In" : "Create Account"}
            </span>
        </>
    )
}
export default AuthForm;