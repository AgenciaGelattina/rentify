import { Box, Typography, TypographyOwnProps, BoxProps, useMediaQuery, useTheme } from "@mui/material";

export type TLabelTextBox = {
    title: string;
    text?: string | number;
    isHtml?: boolean;
    boxProps?: BoxProps;
    titleTypographyProps?: TypographyOwnProps;
    textTypographyProps?: TypographyOwnProps;
}

const LabelTextBox: React.FC<TLabelTextBox> = ({ title, text, isHtml = false, boxProps, titleTypographyProps, textTypographyProps }) => {
    const theme = useTheme();
    const md = useMediaQuery(theme.breakpoints.up('md'));
    
    return (<Box sx={{ display: md ? "flex" : "block", alignContent: "center" }} {...boxProps} >
        <Typography variant="subtitle2" sx={{ marginRight: md ? ".5rem" : "0" }} {...titleTypographyProps}>{title}</Typography>
        {text && <Typography variant="body2" {...textTypographyProps}>{text}</Typography>}
    </Box>)
}

export default LabelTextBox;