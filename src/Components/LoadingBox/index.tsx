import { Box, CircularProgress, SxProps, Theme } from "@mui/material";
import { styled } from '@mui/material/styles';

type TLoadingBox = {
    sx?: SxProps<Theme> | undefined;
    minWidth?: number | string;
    minHeight?: number | string;
}

const SBox = styled(Box)`
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #fff;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 2rem;
`

const LoadingBox: React.FC<TLoadingBox> = ({ sx = {}, minWidth = 50, minHeight = 50 }) => {
    return (<SBox sx={{ ...sx, minWidth, minHeight }} >
        <CircularProgress color="inherit" />
    </SBox>)
}

export default LoadingBox;