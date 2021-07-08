import React, {useEffect, useState} from "react";
import Sweet from "../components/sweet";
import { dbService, storageService } from "../fBase";
import SweetFactory from '../components/SweetFactory';

const Home = ({ userObj }) => {
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

    return(
        <div>
            <SweetFactory userObj={userObj}/>
            <div>
                {sweets.map(sweet => (
                    <Sweet 
                        key={sweet.id} 
                        sweetObj={sweet} 
                        isOwner={sweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    )
}
export default Home;