function getAPIRoot() {
  const match = /^hybrid(.*?)(\..*?)?\.cafuai\.com/.exec(location.host);
  if (match && (match[1] || match[2])) {
    if (match[2]) {
      return `//h-hybrid${match[1]}${match[2]}.cafuai.com`;
    }

    return `//h-hybrid${match[1]}.cafuai.com`;
  }

  return 'https://h.cafuai.com';
}

function getH5Root() {
  const match = /^hybrid(.*?)(\..*?)?((?:\.cafuai\.com)|(?:\.yuagogao\.com))/.exec(location.host);
  if (match && match[2]) {
    if (match[2]) {
      return `//h-hybrid${match[1]}${match[2]}${match[3]}/`;
    }

    return `//h${match[1]}.cafupa.com/`;
  }

  return 'https://h.cafupa.com/';
}

export const API_ROOT = getAPIRoot();
export const H5_ROOT = getH5Root();


//大促活动配置信息
//测试环境
// const act1111Test = {
//   bxPid: 100000116,
//   batchId: 500115,
//   bnPpid: ['3572', '3573', '3574']
// };
//
// //线上环境
// const act1111Prod = {
//   bxPid: 100000008,
//   batchId: 511,
//   bnPpid: ['103774', '103773', '103779']
// };
//
// function getAct1111() {
//   const inTest = location.href.indexOf('test') > -1;
//
//   if (inTest) {
//     return act1111Test;
//   }
//
//   return act1111Prod;
//
// }
//
// export const act1111 = getAct1111();
