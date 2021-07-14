import React, { useState } from 'react';
import { dbService, storageService } from '../fBase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
        <div className="sweet">
            {editing ? (
                <>
                <form onSubmit={onSubmit} className="container sweetEdit">
                    <input
                        type="text"
                        placeholder="Edit your sweet"
                        value={newSweet}
                        required
                        autoFocus
                        onChange={onChange}
                        className="formInput"
                    />
                    <input type="submit" value="Update sweet" className="formBtn" />
                </form>
                <span onClick={toggleEdditing} className="formBtn cancelBtn">
                    Cancel
                </span>
                </>
            ) : (
                <>
                    {sweetObj.attachmentUrl && <div><img alt="" src={sweetObj.attachmentUrl} /></div>}
                    <h4>{sweetObj.text}</h4>
                    {isOwner && 
                        <div className="sweet__actions">
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEdditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                    }
                </>
            )}
        </div>
    )
}
export default Sweet;