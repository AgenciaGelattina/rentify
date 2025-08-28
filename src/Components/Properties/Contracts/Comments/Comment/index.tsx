import { DeleteForever, Edit } from "@mui/icons-material";
import { Box, Divider, IconButton, Paper, Typography } from "@mui/material";
import { DATE_FORMAT } from "@src/Constants";
import { StoreContext } from "@src/DataProvider";
import { formatDate } from "@src/Utils";
import { FC, useContext } from "react";

export interface IComment {
    id: number;
    account: ICommentAccount;
    property: number;
    contract?: number;
    text: string;
    checked: ICommentAccount | number;
    created: Date | string;
}

export interface ICommentAccount {
    id: number;
    fullName: string;
}

interface ICommentProps {
    comment: IComment;
    setEditComment: (comment: IComment) => void;
    setDeleteComment: (comment: IComment) => void;
}

const Comment: FC<ICommentProps> = ({ comment, setEditComment, setDeleteComment }) => {
    const { state: { user } } = useContext(StoreContext);
    const { account, text, created } = comment;
    const { fullName } = account;

    return (<Paper sx={{ padding: '1rem' }} elevation={2}>
        {(user.id === account.id) && <Box>
            <IconButton onClick={() => setEditComment(comment)}>
                <Edit fontSize="inherit" />
            </IconButton>
            <IconButton onClick={() => setDeleteComment(comment)}>
                <DeleteForever fontSize="inherit" />
            </IconButton>
            <Divider sx={{ mb: '.5rem' }} />
        </Box>}
        <Box>
            <Typography variant="caption">
                {fullName} | {formatDate(created, DATE_FORMAT.DATE)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} gutterBottom>
                {text}
            </Typography>
        </Box>
    </Paper>);
};

export default Comment;