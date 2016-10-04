export interface IResponse{
    isOk: string;
    code: string;
    value: Array<string>;
}

export enum DialogButtonOptions {
    Yes = 1 << 0, // 1
    No = 1 << 1,  // 2
    Ok = 1 << 2,  // 4
    Cancel = 1 << 3 // 8
}