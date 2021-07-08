import React, { useEffect, useState } from "react";
import { authService, dbService } from "../fBase";
import { useHistory } from "react-router-dom"

export default ({ userObj, refreshUser }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName)
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    }
    // 프로필에 내가쓴글 찾는법
    const getMySweets = async () => {
        const sweets = await dbService // 서버접근
        .collection("sweets") //저장소 찾기
        .where("creatorId","==", userObj.uid) //내가쓴글 찾기 부등호로 비교가능 where
        .orderBy("createdAt") //순서 정렬
        .get(); //가져오기
        console.log(sweets.docs.map((doc) => doc.data()));
    }
    //사용자의 이름 변경하기
    const onChange = (event) => {
        const { target: {value} } = event;
        setNewDisplayName(value) //값 받아와서 넣기
    }
    const onSubmit =  async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName) {  //기존이름이랑 비교하기
            await userObj.updateProfile({  //유저 업데이트 프로필 firebase
                displayName: newDisplayName  //대입하기
            })
            refreshUser();
        }
    }

    useEffect(() => {
        getMySweets();
    },[])


    return (
        <>
        <form onSubmit={onSubmit}>
            <input onChange={onChange} type="text" placeholder="Display name" value={newDisplayName}/>
            <input type="submit" value="Update Profile"/>
        </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
};