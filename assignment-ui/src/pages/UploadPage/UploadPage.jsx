import React from "react"
import { Button, Upload } from "element-react";
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from "react"
import { useHistory } from "react-router-dom";
import 'element-theme-default';
import './UploadPage.scss';
import { uploadActions } from "../../store/reducer/upload-reducer";


function UploadPage() {

        const fileId = useSelector((state) => state.upload.fileId);
        const dispatch = useDispatch();
        const history = useHistory();
        const uploadRef = React.createRef();

        useEffect(() =>{
            if(fileId) {
                history.push(`/file/${fileId}`);
                dispatch(uploadActions.setFileId(""));
            }
        }, [fileId, dispatch, history])
        
        const submitUpload = () => {
            dispatch(uploadActions.upload(uploadRef.current.state.fileList));
        }

        return (
            <div className="upload-page">
                <Upload
                    action =""
                    className="upload-demo"
                    ref={uploadRef}
                    accept={".csv"}
                    multiple={false}
                    limit={1}
                    autoUpload={false}
                    tip={<div className="el-upload__tip">only CSV files allowed</div>}
                    trigger={<Button size="small" type="primary">select file</Button>}
                >
                    <Button style={{ marginLeft: '10px' }} size="small" type="success" onClick={(response, file, fileList) => submitUpload(response, file, fileList)}>upload to server</Button>
                </Upload>
            </div>
        )

    
}


export default UploadPage;