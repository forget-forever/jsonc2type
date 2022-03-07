declare type IOptions = {
    startNode: string;
    name: string;
};
declare const jsonc2type: (jsonc: string, options: IOptions) => string;
export default jsonc2type;
