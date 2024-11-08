import { Box, Card, CardContent, Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
import { mapKey } from "@src/Utils";
import { ChangeEvent, Dispatch, FC, SetStateAction } from "react";

export interface IFolder {
    name: string;
    title: string;
    description: string;
    files: number;
    selected: boolean;
}

interface IFoldersProps {
    folders: IFolder[];
    setFolders: Dispatch<SetStateAction<IFolder[]>>;
}

const Folders: FC<IFoldersProps> = ({ folders, setFolders }) => {

    const onCheckBoxChange = (folder: IFolder, checked: boolean) => {
        setFolders((folders: IFolder[]) => {
            return folders.map((fld: IFolder) => {
                if (folder === fld) {
                    return {...fld, selected: checked }
                }
                return fld;
            });
        });
    }

    return (<Card>
         <CardContent>
            <Typography variant="subtitle2">Carpetas de Archivos:</Typography>
            <Stack spacing={1}>
                {folders.map((folder: IFolder, ix:number) => {
                    return (<Box key={mapKey("fld",ix)} sx={{ display: "flex" }}>
                        <Checkbox checked={folder.selected} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            onCheckBoxChange(folder, e.currentTarget.checked);
                        }} />
                        <Box>
                            <Typography variant="body2">{folder.title}</Typography>
                            <Typography variant="caption">{`${folder.files} archivos.`}</Typography>
                        </Box>
                    </Box>)
                })}
            </Stack>
        </CardContent>
    </Card>)
};

export default Folders;