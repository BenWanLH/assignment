import { useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { Table, Pagination, Input } from "element-react";
import 'element-theme-default';
import { fileActions } from "../../store/reducer/file-reducer";
import { useParams } from 'react-router-dom';
import tableCol from "../../constant/table-column";
import './FilePage.scss';
import { debounce } from "lodash";




export default function UploadPage() {
    const invoices = useSelector((state) => state.file.invoices);
    const totalPage = useSelector((state) => state.file.totalPage);
    const currentPage = useSelector((state) => state.file.currentPage);
    const emptyText = "No Data Available"

    let { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fileActions.getInvoiceById({ fileId: id }));
    }, [id, dispatch])

    const onPageChange = (page) => {
        dispatch(fileActions.setCurrentPage(page));
        dispatch(fileActions.getInvoiceById({ fileId: id }));
    }

    const onInputChange = debounce((event) => {
        dispatch(fileActions.setCurrentPage(1));
        dispatch(fileActions.setQuery(event));
        dispatch(fileActions.getInvoiceById({ fileId: id }));
    }, 600);

    return (
        <div className="file-page p-24">
            <div className="search-field pb-8">
                <Input
                    placeholder="filter"
                    onChange={(event) => onInputChange(event)}
                />
            </div>
            <Table
                style={{ width: '100%' }}
                columns={tableCol}
                data={invoices}
                emptyText={emptyText}
            />
            <div>
                <Pagination
                    className="paginator"
                    pageCount={totalPage}
                    layout={"prev, pager, next"}
                    onCurrentChange={(page) => onPageChange(page)}
                />
            </div>

        </div>
    )
}
