/*
 * @Author: zml
 * @Date: 2022-02-25 18:57:05
 * @LastEditTime: 2022-03-04 15:18:06
 */
import { upperFirst } from "lodash"
import typeofJsonc from "typeof-jsonc"
import { deleteNullStr } from "./utils"

const basicType = ['string', 'number', 'boolean', "", 'any', 'unknown', 'never', 'object', 'Object', 'undefined', 'null',]

const isArrReg = /\w+\[\]$/

const splitType = (str: string, typeName: string): string => {
  // const interfaceReg = new RegExp(`(?<=interface( )+${typeName.trim()}( )+)(.[\\s\\S]*?)(?=.*(((export)|(declare))?( )+interface)|$)`, 'g')
  // const typeReg = new RegExp(`(?<=declare( )+type( )+${typeName.trim()}( )+=)(.[\\s\\S]*?)(?=.)`)
  // console.log(typeName)
  const startReg = new RegExp(`(?<=(interface( )+${typeName.trim()}( )+)|(type( )+${typeName.trim()}( )*=( )*))(.[\\s\\S]*?)(?=(export)|(declare)|$)`, 'g')
  const [res] = str.match(startReg) || ['']
  const resVal = deleteNullStr(res)
  if (/\w+;?$/.test(resVal) && !basicType.includes(resVal)) {
    return splitType(str, resVal.replace(/;/g, ''))
  }
  return resVal
}

type IOptions = {
  startNode: string;
  name: string;
}

type TypeParseStr = string;

/**
 * handle types，merge all type to a types
 * @param parseStr type
 * @param typeStr string types
 * @returns 
 */
const parseType = (parseStr: string, typeStr: string): TypeParseStr => {
  return parseStr.replace(/(?<=\w(\?)?:\s+)(.[\w\s|[\]]*)(?=;[\n\\n]?(\t)?)/gs, (subStr) => {
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
      return `${parseType(splitType(typeStr, ele), typeStr)}${suffix}`
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

const jsonc2type = (jsonc: string, options: IOptions) => {
  const { name, startNode } = options
  const type = typeofJsonc(jsonc, name, { addExport: false, singleLineJsDocComments: true })
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