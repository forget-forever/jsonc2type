/*
 * @Author: zml
 * @Date: 2022-03-04 14:54:52
 * @LastEditTime: 2022-03-07 19:33:40
 */
import { writeFileSync } from "fs";
import { resolve } from "path";
import jsonc2type from ".";


let str = `
`
// console.log()
writeFileSync(resolve(__dirname, '.type.d.ts' ), jsonc2type(str, {startNode: 'data', name: 'type'}))
// jsonc2type(str, {startNode: 'data', name: 'type'})