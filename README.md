# jsonc2type

## description

json with comment string translate to typescript to type!

## how to use

```typescript
import jsonc2type from 'jsonc2type';

const jsonc2type(`{
  a: 'aaaa', // comments
  b: 1234, // comments
  c: {a: 13432, d: '13424'}
}`, { startNode: 'c', name: 'type'})
/* type Type = {
  a: number,
  d: string,
}
*/

const jsonc2type(`{
  a: 'aaaa', // comments
  b: 1234, // comments
  c: {a: 13432, d: '13424'}
}`, { startNode: 'type', name: 'type'})
/* type Type = {
*  /* comments */
*  a: string,
*  /* comments */
*  d: string,
*  c: {
*    a: number,
*    d: string,
*  }
* }
*/
```
