/*
 * @Author: zml
 * @Date: 2022-03-04 14:54:52
 * @LastEditTime: 2022-03-13 17:14:54
 */
import { writeFileSync } from "fs";
import { resolve } from "path";
import jsonc2type from ".";


let str = `{
  // 数据
  data: true,
  msg: 'aaaa'
}
`
// console.log()
writeFileSync(resolve(__dirname, '.type.d.ts' ), jsonc2type(str, {startNode: 'data', name: 'type'}))
// jsonc2type(str, {startNode: 'data', name: 'type'})