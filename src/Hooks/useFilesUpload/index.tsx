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
    url?: string;
    created?: string;
    isUploading: boolean;
    uploadProgress?: TUploadProgress;
    error: boolean;
    errorMessage?: string;
    xhr?: XMLHttpRequest;
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

const fileStatusDefault: IFileStatus = { id: "", name: "", type: "", size: 0, isUploading: false, error: false };

const fileStatusActions: { [key: string]: string } = {
    ADD_FILES: 'ADD_FILES',
    UPDATE_FILE: 'UPDATE_FILE'
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
                const fileStatus: IFileStatus = { ...fileStatusDefault, id: getUIKey({ removeHyphen: true, toUpperCase: true }), size: file.size }
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
                    fileStatus.xhr = new XMLHttpRequest();
                    const formData = new FormData();
                    formData.append('file', file, file.name);
                    formData.append('id', fileStatus.id);
                    if (data) {
                        for (const [key, value] of Object.entries(data)) {
                            formData.append(key, value);
                        }
                    }
                    fileStatus.xhr.open('POST', endPoint, true);
                    fileStatus.xhr.upload.onloadstart = (ev: ProgressEvent) =>{
                        console.log('onloadstart', fileStatus);
                        fileStatus.uploadProgress = { total: ev.total, loaded: ev.loaded, percent: 0 };
                        fileStatus.isUploading = true;
                        setFiles({ type: fileStatusActions.UPDATE_FILE, data: { 
                            ...fileStatus,
                            uploadProgress: { total: ev.total, loaded: ev.loaded, percent: 0 },
                            isUploading: true
                        } });
                    }
                    fileStatus.xhr.upload.onprogress = (ev: ProgressEvent) => {
                        console.log('onprogress', fileStatus)
                        const { total, loaded } = ev;
                        const percent = Math.round((loaded/total)*100);
                        setFiles({ type: fileStatusActions.UPDATE_FILE, data: {
                            ...fileStatus,
                            uploadProgress: { total, loaded, percent },
                        } });
                    }
                    fileStatus.xhr.upload.onerror = (ev: ProgressEvent) => {
                        console.log('onerror', ev);
                        setUpError(fileStatus);
                    }
                    fileStatus.xhr.upload.onload = (ev: ProgressEvent) => {
                        console.log('onload', ev);
                        const { loaded, total } = ev;
                        setFiles({ type: fileStatusActions.UPDATE_FILE, data: {
                            ...fileStatus,
                            error: false,
                            size: ev.total,
                            uploadProgress: { total, loaded, percent: 100 },
                            isUploading: false
                        } });
                    }

                    fileStatus.xhr.send(formData);                    
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