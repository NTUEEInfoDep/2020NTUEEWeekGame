const ASSET_NAMES = [
  // bullet
  "bullet.svg",
  "bullet1.png",
  "bullet2.png",
  "bullet3.png",
  "bullet4.png",

  // map
  "map1.png",

  // character
  "ship.svg",
  "num1.png",
  "num2.png",
  "num3.png",
  "num4.png",

  // gameover
  "lose.png",
  "win.png",
];

const assets = {};

// eslint-disable-next-line no-use-before-define
const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset));

function downloadAsset(assetName) {
  return new Promise((resolve) => {
    const asset = new Image();
    asset.onload = () => {
      // eslint-disable-next-line no-console
      console.log(`Downloaded ${assetName}`);
      assets[assetName] = asset;
      resolve();
    };
    asset.src = `/assets/${assetName}`;
  });
}

export const downloadAssets = () => downloadPromise;

export const getAsset = (assetName) => assets[assetName];
