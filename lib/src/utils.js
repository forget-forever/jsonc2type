"use strict";
/*
 * @Author: zml
 * @Date: 2022-03-04 14:41:15
 * @LastEditTime: 2022-03-04 14:44:51
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNullStr = void 0;
/**
 * delete start and end extra byte
 * @param str
 * @returns
 */
const deleteNullStr = (str) => str.replace(/^[\n\s\t]*|[\n\s\t]*$/g, '');
exports.deleteNullStr = deleteNullStr;
//# sourceMappingURL=utils.js.map