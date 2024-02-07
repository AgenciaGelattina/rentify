import { Box, Typography, TypographyOwnProps, BoxProps } from "@mui/material";

export type TLabelTextBox = {
    title: string;
    text?: string | number;
    isHtml?: boolean;
    boxProps?: BoxProps;
    titleTypographyProps?: TypographyOwnProps;
    textTypographyProps?: TypographyOwnProps;
}

const LabelTextBox: React.FC<TLabelTextBox> = ({ title, text, isHtml = false, boxProps, titleTypographyProps, textTypographyProps }) => {
    return (<Box {...boxProps}>
        <Typography variant="subtitle2" {...titleTypographyProps}>{title}</Typography>
        {text && <Typography variant="body2" {...textTypographyProps} gutterBottom>{text}</Typography>}
    </Box>)
}

export default LabelTextBox;