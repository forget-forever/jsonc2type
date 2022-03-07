"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const typeof_jsonc_1 = __importDefault(require("typeof-jsonc"));
const utils_1 = require("./utils");
const basicType = ['string', 'number', 'boolean', "", 'any', 'unknown', 'never', 'object', 'Object', 'undefined', 'null',];
const isArrReg = /\w+\[\]$/;
const splitType = (str, typeName) => {
    const lineReg = new RegExp(`(?<=(type( )+${typeName.trim()}( )*=( )+))(.[\\w]*?)(?=(;[\\s\\t]+)|$)`, 'g');
    const [lineVal] = str.match(lineReg) || [''];
    if (lineVal.trim()) {
        return splitType(str, lineVal.trim());
    }
    const startReg = new RegExp(`(?<=(interface( )+${typeName.trim()}( )+)|(type( )+${typeName.trim()}( )*=( )*))(.[\\s\\S]*?)(?=(export( )+(\\w)+)|(declare( )+(\\w)+)|$)`, 'g');
    const [res] = str.match(startReg) || [''];
    const resVal = (0, utils_1.deleteNullStr)(res);
    return resVal;
};
/**
 * handle types，merge all type to a types
 * @param parseStr type
 * @param typeStr string types
 * @returns
 */
const parseType = (parseStr, typeStr) => {
    return parseStr.replace(/(?<=(\w)+(\?)?:\s+)(.[\w\s|[\]]*)(?=;[\n\\n]?(\t)?)/gs, (subStr) => {
        const subArr = subStr.split('|');
        return subArr.map((item) => {
            let ele = item.trim();
            let suffix = '';
            if (isArrReg.test(ele)) {
                ele = ele.replace(/[[\]]/g, '');
                suffix = '[]';
            }
            if (basicType.includes(ele)) {
                return `${ele}${suffix}`;
            }
            return `${parseType(splitType(typeStr, ele), typeStr) || 'any'}${suffix}`;
        }).join(' | ');
    }).replace(/;$/, '');
};
const getInlineType = (typeStr, node) => {
    const firstTypeReg = /(?<=(interface( )+(\w)+( )+)|(type( )+(\w)+( )*=( )*))(.[\s\S]*?)(?=(export)|(declare)|$)/s;
    const [firstType] = typeStr.match(firstTypeReg) || [''];
    // const firstType = typeStr
    // console.log(typeStr, firstType)
    const reg = new RegExp(`(?<=${node.trim()}\:(\\s)*)(.[\\w]+?)(?=;)`);
    return (firstType.match(reg) || [''])[0];
};
const jsonc2type = (jsonc, options) => {
    const { name, startNode } = options;
    const type = (0, typeof_jsonc_1.default)(jsonc, name, { addExport: false, singleLineJsDocComments: true });
    // console.log(splitType(type, upperFirst(startNode)))
    // writeFileSync(resolve(__dirname, '.type.d.ts' ), type)
    let typeStr = parseType(splitType(type, (0, lodash_1.upperFirst)(startNode)), type);
    // const strtReg = new RegExp(//)
    if (!typeStr) {
        typeStr = getInlineType(type, startNode);
        if (!typeStr) {
            return '';
        }
    }
    return `type ${(0, lodash_1.upperFirst)(name)} = ${typeStr};`;
};
exports.default = jsonc2type;
//# sourceMappingURL=index.js.map