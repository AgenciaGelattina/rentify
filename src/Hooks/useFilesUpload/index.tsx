import { useEffect, useReducer, useRef } from 'react';
import { isNil, isNotNil } from 'ramda';
import { getUIKey } from '@src/Utils';

export type TUploadProgress = {
    total: number;
    loaded: number;
    percent: number;
}

export interface IFileStatus {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    isUploading: boolean;
    uploadProgress?: TUploadProgress;
    error: boolean;
    errorMessage?: string;
    XHR?: XMLHttpRequest;
}

type TUseFilesUploadOptions = {
    endPoint: string;
    maxFileSize?: number;
    acceptedFilesType?: string[];
    deniedFilesType?: string[];
    multiple?: boolean;
    data?: { [key: string]: any };
}

type TUseFilesUpload = {
    files: IFileStatus[];
    selectFiles: () => void;
    cancelUpload: (fileID?: string) => void;
}

const fileStatusDefault: IFileStatus = { id: "", name: "", type: "", size: 0, url: "", isUploading: false, error: false };

const fileStatusActions: { [key: string]: string } = {
    ADD_FILES: 'ADD_FILES',
    UPDATE_FILE: 'UPDATE_FILE',
    ON_PROGRESS: 'ON_PROGRESS',
    UPLOADED: 'UPLOADED'
}

type TFileStatusReducer = {
    [key: string]: (state: IFileStatus[], data: any) => IFileStatus[];
}

const setFileStatusUpdate = (data: Partial<IFileStatus>, state: IFileStatus[]): { files: IFileStatus[], file?: IFileStatus } => {
    const file = state.find((fl: IFileStatus) => fl.id === data.id);
    const files = state.filter((fl: IFileStatus) => fl.id !== data.id) || [];
    return { files, file };
}

const fileStatusReducer: TFileStatusReducer = {
    [fileStatusActions.ADD_FILES]: (state: IFileStatus[], data: IFileStatus[]): IFileStatus[] => {
        return [ ...state, ...data ];
    },
    [fileStatusActions.UPDATE_FILE]: (state: IFileStatus[], data: Partial<IFileStatus>): IFileStatus[] => {
        const { files, file } = setFileStatusUpdate(data, state);
        return isNotNil(file)? [ ...files, { ...file, ...data } ] :  state;
    }
}

const useFilesUpload = (options: TUseFilesUploadOptions): TUseFilesUpload => {
    const [files, setFiles] = useReducer((state: IFileStatus[], action: { type: string, data: any }) => fileStatusReducer[action.type](state, action.data), []);
    const input = useRef<HTMLInputElement>(document.createElement("input"));

    useEffect(() => {
        input.current.setAttribute('type', 'file');
        input.current.multiple = options.multiple || false;
        input.current.onchange = () => {
            onSelectedFiles(input.current.files);
        };
    }, [input]);

    const cancelUpload = (fileID?: string) => {
        if (isNotNil(fileID)) {

        }
    }

    const setUpError = (file: IFileStatus) => {
        setFiles({ type: fileStatusActions.UPDATE_FILE, data: { 
            ...file,
            isUploading: false,
            uploadProgress: undefined,
            error: true,
            errorMessage: 'No se pudo subir el archivo.'
        }});
    }

    const onSelectedFiles = (fls: FileList | null) => {
        if (isNotNil(fls)) {
            const { endPoint, acceptedFilesType, deniedFilesType, maxFileSize, data } = options;
            const newFiles: IFileStatus[] = Array.from(fls).map((file: File): IFileStatus => {
                const flNM = file.name.match(/(.+?)(\.[^.]*$|$)/);
                const fileStatus: IFileStatus = { ...fileStatusDefault, id: getUIKey({ removeHyphen: true, toUpperCase: true }) }
                if (flNM && flNM.length >= 2) {
                    fileStatus.name = flNM[1].toLowerCase().replace(/[\W]/gm,'');
                    fileStatus.type = flNM[2].replace('.', '');
                    if (acceptedFilesType && acceptedFilesType.length > 0 && !acceptedFilesType.includes(fileStatus.type)) {
                        fileStatus.error = true;
                        fileStatus.errorMessage = `Tipo de archivo no permitido (${fileStatus.type})`;
                        return fileStatus;
                    }
                    if (deniedFilesType && deniedFilesType.length > 0 && deniedFilesType.includes(fileStatus.type)) {
                        fileStatus.error = true;
                        fileStatus.errorMessage = `Tipo de archivo no permitido (${fileStatus.type})`;
                        return fileStatus;
                    }
                    if (maxFileSize && maxFileSize > 0 && file.size > maxFileSize) {
                        fileStatus.error = true;
                        fileStatus.errorMessage = `El archivo supera el peso permitido (${file.size})`;
                        return fileStatus;
                    }
                    fileStatus.XHR = new XMLHttpRequest();
                    const formData = new FormData();
                    formData.append('file', file, file.name);
                    formData.append('id', fileStatus.id);
                    if (data) {
                        for (const [key, value] of Object.entries(data)) {
                            formData.append(key, value);
                        }
                    }
                    fileStatus.XHR.open('POST', endPoint);
                    fileStatus.XHR.upload.onloadstart = (e: ProgressEvent) =>{
                        fileStatus.uploadProgress = { total: e.total, loaded: e.loaded, percent: 0 };
                        fileStatus.isUploading = true;
                        setFiles({ type: fileStatusActions.UPDATE_FILE, data: { 
                            ...fileStatus,
                            uploadProgress: { total: e.total, loaded: e.loaded, percent: 0 },
                            isUploading: true
                        } });
                    }
                    fileStatus.XHR.upload.onprogress = (ev: ProgressEvent) => {
                        const { total, loaded } = ev;
                        const percent = Math.round((loaded/total)*100);
                        setFiles({ type: fileStatusActions.UPDATE_FILE, data: {
                            ...fileStatus,
                            uploadProgress: { total, loaded, percent },
                            isUploading: true
                        } });
                    }
                    fileStatus.XHR.upload.onerror = (ev: ProgressEvent) => {
                        console.log(`ERROR-> ${ev}`)
                        setUpError(fileStatus);
                    }
                    fileStatus.XHR.upload.onloadend = (ev: ProgressEvent) => {
                        if (fileStatus.XHR?.status === 200) {

                        } else {
                            setUpError(fileStatus);
                        }
                        console.log(`STATUS-> ${fileStatus.XHR?.status}`)
                        console.log(`STATUSTEXT-> ${fileStatus.XHR?.statusText}`)
                        console.log(`RESPONSE-> ${fileStatus.XHR?.response}`)
                    }
                    fileStatus.XHR.send(formData);
                    /*
                    XHR.onload = () => {
                        if (XHR.status === 200) {
                            setFiles({ type: fileStatusActions.UPLOADED, data: { id: fileStatus.id }});
                        }
                    }
                    */
                    
                    return fileStatus;
                } 
                return { ...fileStatus, error: true, errorMessage: 'El archivo no se pudo leer.' };
            });
            setFiles({ type: fileStatusActions.ADD_FILES, data: newFiles });
        }
    }

    const selectFiles = () => {
        input.current.click();
    }

    return { files, selectFiles, cancelUpload };
}

export default useFilesUpload;