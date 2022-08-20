import TextField from "@mui/material/TextField"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useEffect } from "react"
import { fileActions } from "../../store/reducer/file-reducer";
import { useParams } from 'react-router-dom';
import './FilePage.scss';
import { debounce } from "lodash";
import { useAppDispatch, useAppSelector } from "../../store/store";
import tableCol from "../../constant/table-column";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";




export default function FilePage() {
    const invoices = useAppSelector((state) => state.file.invoices);
    const currentPage = useAppSelector((state) => state.file.currentPage);
    const totalInvoices = useAppSelector((state) => state.file.totalInvoices);

    let { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fileActions.getInvoiceById({ fileId: id }));
    }, [id, dispatch])

    const onPageChange = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        dispatch(fileActions.setCurrentPage(page));
        dispatch(fileActions.getInvoiceById({ fileId: id }));
    }

    const onInputChange = debounce((event) => {
        dispatch(fileActions.setCurrentPage(0));
        dispatch(fileActions.setQuery(event.target.value));
        dispatch(fileActions.getInvoiceById({ fileId: id }));
    }, 600);

    return (
        <div className="file-page p-24">
            <TextField
                label="Filter"
                size="small"
                onChange={onInputChange}
            />
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {
                                tableCol.map((item,index) =>{
                                    return <TableCell key={index}>{item.label}</TableCell>
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.map((row) => (
                            <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {row.invoiceNo}
                            </TableCell>
                            <TableCell>{row.stockCode}</TableCell>
                            <TableCell>{row.description}</TableCell>
                            <TableCell>{row.quantity}</TableCell>
                            <TableCell>{row.invoiceDate}</TableCell>
                            <TableCell>{row.unitPrice}</TableCell>
                            <TableCell>{row.customerId}</TableCell>
                            <TableCell>{row.country}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                        <TableCell 
                            colSpan={5}
                        ></TableCell>

                            <TablePagination
                                rowsPerPageOptions={[10]}
                                colSpan={3}
                                count={totalInvoices}
                                rowsPerPage={10}
                                page={currentPage}
                                SelectProps={{
                                    inputProps: {
                                    'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onPageChange={onPageChange}
                                align="right"
                            />
                        </TableRow>
                    </TableFooter>
                </Table>

            </TableContainer>
        </div>
        // <div className="file-page p-24">
        //     <div className="search-field pb-8">
        //         <Input
        //             placeholder="filter"
        //             onChange={(event) => onInputChange(event)}
        //         />
        //     </div>
        //     <Table
        //         style={{ width: '100%' }}
        //         columns={tableCol}
        //         data={invoices}
        //         emptyText={emptyText}
        //     />
        //     <div>
        //         <Pagination
        //             className="paginator"
        //             pageCount={totalPage}
        //             layout={"prev, pager, next"}
        //             onCurrentChange={(page) => onPageChange(page)}
        //         />
        //     </div>

        // </div>
    )
}
