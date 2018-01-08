import assign from 'object-assign';

const kTestImages = {
  lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
  /*lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
  alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",*/
  animation: 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA'
};

function checkWebpFeature(feature) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = function() {
      const result = (img.width > 0) && (img.height > 0);
      resolve({[feature]: result});
    };
    img.onerror = function() {
      resolve({[feature]: false});
    };
    img.src = `data:image/webp;base64,${kTestImages[feature]}`;
  });
}

let webpFeatures;
//获取浏览器webp特性的支持情况
export function detectWebpFeatures() {
  return new Promise(resolve => {
    if (webpFeatures) {
      resolve(webpFeatures);
      return;
    }
    const allFeatures = Object.keys(kTestImages).map(feature => checkWebpFeature(feature));
    Promise
      .all(allFeatures)
      .then((args) => {//[{},]
        const result = {};
        args.forEach(item => assign(result, item));
        webpFeatures = result;
        resolve(webpFeatures);
      });
  });
}

/**
 * 将html中所有的img标签的src的值替换webp
 *
 * @param {string} html html字符串
 * @returns {string} webp化后的html
 */
export function webpHtml(html = '') {
  return html.replace(/<img.+?src=(['"])(.+?)\1.*?>/gi, (img, $1, src) => img.replace(src, webp(src)));
}

/**
 * 根据浏览器支持webp的情况, 将七牛的图片地址添加webp格式转换
 *
 * @param {string} imgUrl 七牛图片地址
 * @param {number} width {optional} 指定图片等比缩放的宽度
 * @returns {string} 图片地址
 */
export default function webp(imgUrl, width) { //https://dn-ygbimg.qbox.me/banes/o_1atprc6eeu2o1mfrr7l2pu1pktc.png
  if (!/\.qbox\.me\//.test(imgUrl)) {
    return imgUrl;
  }

  const qs = [];//gogopher.jpg?imageView2/2/w/200/format/webp/q/75/ignore-error/1
  if (width) {
    if (isNaN(width) || width <= 0) {
      throw new Error('width参数, 请传入大于0的数字');
    }
    qs.push(`w/${width}`);//按照宽度, 等比缩放
  }

  const {lossy, /* lossless, alpha,*/animation} = webpFeatures || {};
  if (/\.gif$/.test(imgUrl)) {//gif图片
    if (animation && lossy) {
      qs.push('format/webp');
    }
  } else if (lossy) {//非gif图片 支持webp有损压缩
    qs.push('format/webp');
  } else {//不支持webp
    if (/(\.jpg|\.jpeg)$/.test(imgUrl)) {//若是jpg 使用渐进显示
      qs.push('interlace/1');
    }
    qs.push('q/75');//图片压缩,质量值默认75
  }

  if (qs.length > 0) {
    qs.push('ignore-error/1');//转换出错返回原图
    return `${imgUrl}?imageView2/2/${qs.join('/')}`;
  }
  return imgUrl;
}
