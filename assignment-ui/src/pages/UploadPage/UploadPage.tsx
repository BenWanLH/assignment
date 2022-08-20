// import { Button, Upload } from "element-react";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/CloseOutlined';
import { useEffect } from "react"
import { useHistory } from "react-router-dom";
import './UploadPage.scss';
import { uploadActions } from "../../store/reducer/upload-reducer";
import { useAppDispatch, useAppSelector } from "../../store/store";

function UploadPage() {

    const fileId = useAppSelector((state) => state.upload.fileId);

    const dispatch = useAppDispatch();
    const history = useHistory();
    let inputRef: HTMLInputElement | null;
    let file = useAppSelector((state) => state.upload.file);
    useEffect(() => {
        if (fileId) {
            history.push(`/file/${fileId}`);
            dispatch(uploadActions.setFileId(""));
            dispatch(uploadActions.setFile(undefined));
        }
    }, [fileId, dispatch, history])

    const onUploadBtnClick = () => {
        inputRef?.click();
    }

    const onInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        if (inputRef && inputRef.files) {
            dispatch(uploadActions.setFile(inputRef.files[0]));
        }
    }

    const onDeleteFile = () => {
        if (inputRef && inputRef.files) {
            inputRef.value = "";
            dispatch(uploadActions.setFile(undefined));
        }
    }
    const submitUpload = () => {
        dispatch(uploadActions.upload(file as File));
    }

    return (
        <div className="upload-page">
            <Button className="upload-page__btn mr-8" variant="contained" disableElevation={true} size="small" onClick={onUploadBtnClick} > Select file </Button>
            <input ref={(ref) => inputRef = ref} className="d-none" type="file" id="upload" accept=".csv" onChange={onInputChange}></input>
            <Button className="upload-page__btn  ml-8" variant="contained" color="success" disabled={!file} disableElevation={true} size="small" onClick={submitUpload}> Upload to server </Button>
            <div className="upload-page__label pbt-8">
                <span>only CSV allowed</span>
            </div>
            {
                file &&
                <div className="filename">
                    <span className="filename__label">{(file as File).name}</span>
                    <DeleteIcon className="filename__delete-btn" fontSize="small" onClick={onDeleteFile} />
                </div>
            }
        </div>
    )


}


export default UploadPage;