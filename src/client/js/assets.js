const ASSET_NAMES = [
  "ship.svg",
  "bullet.svg",

  // bullet
  "bullet1.png",
  "bullet2.png",
  "bullet3.png",
  "bullet4.png",
  // 
  "map1.png",
  "map2.png",
  "flying.png",
  // player
  "num1.png",
  "num2.png",
  "num3.png",
  "num4.png",
];

const assets = {};

const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset));

function downloadAsset(assetName) {
  return new Promise((resolve) => {
    const asset = new Image();
    asset.onload = () => {
      console.log(`Downloaded ${assetName}`);
      assets[assetName] = asset;
      resolve();
    };
    asset.src = `/assets/${assetName}`;
  });
}

export const downloadAssets = () => downloadPromise;

export const getAsset = (assetName) => assets[assetName];
