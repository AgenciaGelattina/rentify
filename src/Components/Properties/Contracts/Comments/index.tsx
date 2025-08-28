import { useFetchData } from "@phoxer/react-components";
import { StoreContext } from "@src/DataProvider";
import { FC, useContext, useEffect, useState } from "react";
import { IComment } from "./Comment";
import useDataResponse from "@src/Hooks/useDataResponse";
import { Box, IconButton, Stack } from "@mui/material";
import Header from "@src/Components/Header";
import LoadingBox from "@src/Components/LoadingBox";
import CommentsForm, { TCommentsForm } from "./Form";
import Comment from "./Comment";
import { mapKey } from "@src/Utils";
import { AddComment } from "@mui/icons-material";

interface IContractCommentsProps {
    property: { id: number };
    contract: { id: number };
};

const ContractComments: FC<IContractCommentsProps> = ({ property, contract }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [comments, setCommentsData] = useState<IComment[]>([]);
    const [commentsForm, setCommentsForm] = useState<TCommentsForm>({ open: false });

    const getComments = () => {
        setCommentsData([]);
        setCommentsForm({ open: false });
        fetchData.get('/properties/contracts/comments/list.php', { property: property.id, contract: contract.id }, (response: any) => {
            const data = validateResult(response.result);
            if (data) {
                setCommentsData(data);
            };
        });
    };

    useEffect(() => {
        getComments();
    }, []);

    const setEditComment = (comment: IComment) => {
        setCommentsForm({ comment, open: true });
    }

    const setDeleteComment = (comment: IComment) => {
        fetchData.delete('/properties/contracts/comments/comment.php', { comment: comment.id }, (response: any) => {
            const deleted = validateResult(response.result);
            if (deleted) {
                getComments();
            };
        });
    }

    return (<Box sx={{ border: '1px solid #ccc', padding: '1rem' }}>
        <Header title="COMENTARIOS">
            <IconButton onClick={() => setCommentsForm({ open: true })}>
                <AddComment fontSize="inherit" color='primary' />
            </IconButton>
        </Header>
        {loading && <LoadingBox />}
        {!loading && <Stack spacing={1}>
            {comments.map((comment: IComment, ix: number) => {
                return <Comment key={mapKey('cmm', ix)} comment={comment} setEditComment={setEditComment} setDeleteComment={setDeleteComment} />
            })}
        </Stack>}
        <CommentsForm {...commentsForm} property={property} contract={contract} getComments={getComments} setCommentsForm={setCommentsForm} />
    </Box>)

};

export default ContractComments;