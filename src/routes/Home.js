import React, {useEffect, useState} from "react";
import Sweet from "../components/sweet";
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from "../fBase";

const Home = ({ userObj }) => {
    const [sweet, setsweet] = useState("");
    const [sweets, setsweets] = useState([]);
    const [ attachment, setAttachment ] = useState();

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
        const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`) //collection 과 같이 firebase 에 이미지 업로드방법
        const response = await fileRef.putString(attachment, "data_url");
        console.log(response);
        // await dbService.collection("sweets").add({
        //     text: sweet,
        //     createdAt: Date.now(),
        //     creatorId: userObj.uid
        // });
        // setsweet("")
    }
    
    const onChange = (event) => {
        const { target: {value} } = event;
        setsweet(value);
    }

    const onFileChange = (event) => {
        const {target: { files }} = event;
        const theFile = files[0]; //파일 추적 하나의 파일만 받기
        const reader = new FileReader(); //파읽읽는 reader 만들기
        reader.onloadend = (finishedEvent) => {
            const {currentTarget: {result}} = finishedEvent //파읽에서 꺼내기
            setAttachment(result) // state 에 파일 이름 넣기
        }
        reader.readAsDataURL(theFile) //파일 읽는 js 함수 , MDN 참조 데이터를 얻기
    }

    const onClearAttachment = () => setAttachment(null);

    return(
        <div>
            <form onSubmit={onSubmit}>
                <input type="input" value={sweet} onChange={onChange}/>
                <input type="file" accept="image/*" onChange={onFileChange}/>
                <input type="submit" value="sweeter"/>
                {attachment && 
                    <div>
                        <img alt="" src={attachment} width="100px" height="auto"/>
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                }
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