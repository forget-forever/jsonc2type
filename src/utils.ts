/*
 * @Author: zml
 * @Date: 2022-03-04 14:41:15
 * @LastEditTime: 2022-03-04 14:44:51
 */

/**
 * delete start and end extra byte
 * @param str 
 * @returns 
 */
 export const deleteNullStr = (str: string) => str.replace(/^[\n\s\t]*|[\n\s\t]*$/g, '')