import React, {useEffect, useState} from "react";
import Sweet from "../components/sweet";
import { dbService } from "../fBase";

const Home = ({ userObj }) => {
    const [sweet, setsweet] = useState("");
    const [sweets, setsweets] = useState([]);

    //트윗들 가져오는 방법(구식)
    // const getsweets = async () => {
    //     const dbsweets = await dbService.collection("sweets").get();
    //     dbsweets.forEach((document) => {
    //         const sweetObject = {
    //             ...document.data(),
    //             id: document.id,
    //         }
    //         setsweets((prev) => [sweetObject, ...prev])
    //     })
    // }

    useEffect(() => {
        //구식 getsweets()
        //새로운 방법으로 트윗 받아오기 onsnapshot 이용 더적게 rerender해줌
        dbService.collection("sweets").onSnapshot((snapshot) => {
            const sweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setsweets(sweetArray);
        })
    },[])

    //promise 를 리턴하기 때문에 async로 써줌
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("sweets").add({
            text: sweet,
            createdAt: Date.now(),
            creatorId: userObj.uid
        });
        setsweet("")
    }
    
    const onChange = (event) => {
        const { target: {value} } = event;
        setsweet(value);
    }

    return(
        <div>
            <form onSubmit={onSubmit}>
                <input type="input" value={sweet} onChange={onChange}/>
                <input type="submit" value="sweeter"/>
            </form>
            <div>
                {sweets.map(sweet => (
                    <Sweet key={sweet.id} sweetObj={sweet} isOwner={sweet.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    )
}
export default Home;