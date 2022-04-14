const Jimp = require('jimp');

let opencvInitializedResolver;
const opencvInitialized = new Promise((resolve) => {
  opencvInitializedResolver = resolve;
});

Module = {
  async onRuntimeInitialized() {
    opencvInitializedResolver();
  },
};

global.cv = require('./opencv.js');

// 截图
async function run() {
  await opencvInitialized;
  const { cv } = global;
  try {
    const img = await Jimp.read('./bg.png');
    const originalImage = cv.matFromImageData(img.bitmap);

    const rect = new cv.Rect(0, 0, 1399, 619); // 原图片是1400 x 619 
    const dst = originalImage.roi(rect);
    await new Jimp({
      width: dst.cols, height: dst.rows, data: Buffer.from(dst.data),
    }).writeAsync('./result.png');
    console.log('done');
  } catch (err) {
    console.log('error：', cv.exceptionFromPtr(err).msg);
  }
}

run();
