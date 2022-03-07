"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: zml
 * @Date: 2022-03-04 14:54:52
 * @LastEditTime: 2022-03-07 19:33:40
 */
const fs_1 = require("fs");
const path_1 = require("path");
const _1 = __importDefault(require("."));
let str = `
`;
// console.log()
(0, fs_1.writeFileSync)((0, path_1.resolve)(__dirname, '.type.d.ts'), (0, _1.default)(str, { startNode: 'data', name: 'type' }));
// jsonc2type(str, {startNode: 'data', name: 'type'})
//# sourceMappingURL=test.js.map