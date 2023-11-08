import { Box, Typography, TypographyOwnProps, BoxProps } from "@mui/material";

export type TLabelTextBox = {
    title: string;
    text: string;
    isHtml?: boolean;
    boxProps?: BoxProps;
    titleTypographyProps?: TypographyOwnProps;
    textTypographyProps?: TypographyOwnProps;
}

const LabelTextBox: React.FC<TLabelTextBox> = ({ title, text, isHtml = false, boxProps, titleTypographyProps, textTypographyProps }) => {
    return (<Box {...boxProps}>
        <Typography variant="h6" {...titleTypographyProps} gutterBottom>{title}</Typography>
        <Typography variant="body1" {...textTypographyProps} gutterBottom>{text}</Typography>
    </Box>)
}

export default LabelTextBox;