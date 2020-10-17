const ASSET_NAMES = [
  // map
  "map1.png",

  // character
  "ship.svg",
  "num1.png",
  "num2.png",
  "num3.png",
  "num4.png",

  // bullet
  "bullet.svg",
  "bullet1.png",
  "bullet2.png",
  "bullet3.png",
  "bullet4.png",

  // gameover
  "lose.png",
  "win.png",
];

const assets = {};

function downloadAsset(assetName) {
  return new Promise((resolve) => {
    const asset = new Image();

    asset.onload = () => {
      assets[assetName] = asset;
      resolve();
    };
    asset.src = `/assets/${assetName}`;
  });
}

const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset));

export const downloadAssets = () => downloadPromise;

export const getAsset = (assetName) => assets[assetName];
