import React, { useState} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from '../fBase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const SweetFactory = ({userObj}) => {
    const [sweet, setsweet] = useState("");
    const [ attachment, setAttachment ] = useState("");

    //promise 를 리턴하기 때문에 async로 써줌
    const onSubmit = async (event) => {
        if (sweet === "") {
            return;
        }
        event.preventDefault();
        let attachmentUrl = ""; //if문 안쪽에서 묶여있는걸 밖으로 빼줌
        if (attachment !== ""){
            //firebase 이미지 storage 추가하는 방법
            const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`) //collection 과 같이 firebase 에 이미지 업로드방법
            const response = await fileRef.putString(attachment, "data_url");
            //이미지 ulr 추적하기
            attachmentUrl = await response.ref.getDownloadURL();
            //이미지 sweet에 넣기
        };
        const sweetObj = {
            text: sweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        };
        await dbService.collection("sweets").add(sweetObj);
        setsweet("");
        setAttachment("");
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
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                className="factoryInput__input"
                value={sweet}
                onChange={onChange}
                type="text"
                placeholder="What's on your mind?"
                maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                opacity: 0,
                }}
            />
            {attachment && 
                 <div className="factoryForm__attachment">
                    <img
                        alt=""    
                        src={attachment}
                        style={{
                            backgroundImage: attachment,
                    }}
                    />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                    <span>Remove</span>
                    <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            }
        </form>
    )
}
export default SweetFactory;