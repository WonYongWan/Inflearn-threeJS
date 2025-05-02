// =====================================================
// (export)

// 객체에 담아서 사용하는 방법
// export const object = {
//   hello1: function() {
//     console.log('hello1');
//   },

//   hello2: function() {
//     console.log('hello2');
//   }
// }

// --------------------------------------------

// 하나씩 export하고 전부 불러오는 방법 !!!! three.js에서 가장 많이 사용하는 방법
// export function hello1() {
//   console.log('hello1');
// }

// export function hello2() {
//   console.log('hello2');
// }

// --------------------------------------------

// 중괄호 {} 안쓰고 전부 불러오는 방법
// const object = {
//   hello1: function() {
//     console.log('hello1');
//   },

//   hello2: function() {
//     console.log('hello2');
//   }
// }

// export default object;

// =====================================================
// (import)

// 객체에 담아서 사용하는 방법
// import { object } from './useModule.js';
// object.hello1();
// object.hello2();

// --------------------------------------------

// 하나씩 export하고 전부 불러오는 방법 !!!! three.js에서 가장 많이 사용하는 방법
// import * as object from './useModule.js';
// object.hello1();
// object.hello2();

// --------------------------------------------

// 중괄호 {} 안쓰고 전부 불러오는 방법
// import object from './useModule.js';
// object.hello1();
// object.hello2();