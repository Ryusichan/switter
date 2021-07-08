import React, { useState } from 'react';
import { dbService, storageService } from '../fBase';

const Sweet = ({sweetObj, isOwner }) => {
    const [ editing, setEditing ] = useState(false);
    const [ newSweet, setNewSweet ] = useState(sweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this sweet?");
        if(ok) {
            //텍스트 지우기 삭제할 위치 cloud firestore 에서 찾기
            await dbService.doc(`sweets/${sweetObj.id}`).delete();
            //사진 지우기 삭제할 위치 cloud 에서 지우기
            await storageService.refFromURL(sweetObj.attachmentUrl).delete()
        }
    }

    const toggleEdditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`sweets/${sweetObj.id}`).update({
            text: newSweet
        });
        setEditing(false)
    };
    const onChange = (event) => {
        const {target: {value}} = event;
        setNewSweet(value);
    };
    return(
        <div >
            {editing ? (
                <>
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        placeholder="Edit your sweet"
                        value={newSweet}
                        required
                        onChange={onChange}
                    />
                    <input type="submit" value="Update Sweet"/>
                </form>
                <button onClick={toggleEdditing}>Cancel</button>
                </>
            ) : (
                <>
                    <h4>{sweetObj.text}</h4>
                    {sweetObj.attachmentUrl && <img src={sweetObj.attachmentUrl} width="auto" height="50px"/>}
                    {isOwner && 
                    <>
                        <button onClick={onDeleteClick}>Delete Sweet</button>
                        <button onClick={toggleEdditing}>Edit Sweet</button>
                    </>}
                </>
            )}
        </div>
    )
}
export default Sweet;