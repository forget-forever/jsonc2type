/*
 * @Author: zml
 * @Date: 2022-03-04 14:54:52
 * @LastEditTime: 2022-03-04 15:11:21
 */
import jsonc2type from ".";

console.log(jsonc2type(`{a: 'aaa'}`, {startNode: 'a', name: 'type'}))