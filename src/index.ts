/*
 * @Author: zml
 * @Date: 2022-02-25 18:57:05
 * @LastEditTime: 2022-03-10 14:52:10
 */
import { upperFirst } from "lodash"
import typeofJsonc from "typeof-jsonc"
import type { Options } from 'typeof-jsonc'
import { deleteNullStr } from "./utils"

const basicType = ['string', 'number', 'boolean', "", 'any', 'unknown', 'never', 'object', 'Object', 'undefined', 'null',]

const isArrReg = /\w+\[\]$/

const splitType = (str: string, typeName: string): string => {
  const lineReg = new RegExp(`(?<=(type( )+${typeName.trim()}( )*=( )+))(.[\\w]*?)(?=(;[\\s\\t]+)|$)`, 'g')
  const [lineVal] = str.match(lineReg) || ['']
  if (lineVal.trim()) {
    return splitType(str, lineVal.trim())
  }
  const startReg = new RegExp(`(?<=(interface( )+${typeName.trim()}( )+)|(type( )+${typeName.trim()}( )*=( )*))(.[\\s\\S]*?)(?=(export( )+(\\w)+)|(declare( )+(\\w)+)|$)`, 'g')
  const [res] = str.match(startReg) || ['']
  const resVal = deleteNullStr(res)
  return resVal
}

type IOptions = {
  /**
   * field where you want to start collecting ts type，can set the same as ‘name’ field to collect whole types
   * @requires -true
   */
  startNode: string;
  /**
   * name of the ts type
   */
  name: string;
  /**
   * typeof-jsonc plugin's options
   */
  typeofJsoncOptions?: Options
}

type TypeParseStr = string;

/**
 * handle types，merge all types to a type
 * @param parseStr type
 * @param typeStr string types
 * @returns 
 */
const parseType = (parseStr: string, typeStr: string): TypeParseStr => {
  return parseStr.replace(/(?<=(\w)+(\?)?:\s+)(.[\w\s|[\]]*)(?=;[\n\\n]?(\t)?)/gs, (subStr) => {
    const subArr = subStr.split('|')
    return subArr.map((item) => {
      let ele = item.trim()
      let suffix = ''
      if (isArrReg.test(ele)) {
        ele = ele.replace(/[[\]]/g, '')
        suffix = '[]'
      }
      if (basicType.includes(ele)) {
        return `${ele}${suffix}`
      }
      return `${parseType(splitType(typeStr, ele), typeStr) || 'any'}${suffix}`
    }).join(' | ')
  }).replace(/;$/, '')
}

const getInlineType = (typeStr: string, node: string) => {
  const firstTypeReg = /(?<=(interface( )+(\w)+( )+)|(type( )+(\w)+( )*=( )*))(.[\s\S]*?)(?=(export)|(declare)|$)/s;
  const [firstType] = typeStr.match(firstTypeReg) || ['']
  // const firstType = typeStr
  // console.log(typeStr, firstType)
  const reg = new RegExp(`(?<=${node.trim()}\:(\\s)*)(.[\\w]+?)(?=;)`)
  return (firstType.match(reg) || [''])[0]
}

/**
 * create ts type from jsonc
 * @param jsonc jsonc string
 * @param options config
 * @returns 
 */
const jsonc2type = (jsonc: string, options: IOptions) => {
  const { name, startNode, typeofJsoncOptions } = options
  const type = typeofJsonc(jsonc, name, { addExport: false, singleLineJsDocComments: true, ...typeofJsoncOptions })
  // console.log(splitType(type, upperFirst(startNode)))
  // writeFileSync(resolve(__dirname, '.type.d.ts' ), type)
  let typeStr = parseType(splitType(type, upperFirst(startNode)), type)
  // const strtReg = new RegExp(//)
  if (!typeStr) {
    typeStr = getInlineType(type, startNode)
    if (!typeStr) {
      return ''
    }
  }
  return `type ${upperFirst(name)} = ${typeStr};`
}

export default jsonc2type