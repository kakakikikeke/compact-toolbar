document.addEventListener("DOMContentLoaded", () => {
  const hideFolderNamesCheckbox = document.getElementById("hideFolderNames");
  const setZerowidthSpaceCheckbox = document.getElementById("setZerowidthSpace");

  // 初期値を読み込む
  browser.storage.local.get(["hideFolderNames", "setZerowidthSpace"]).then((result) => {
    hideFolderNamesCheckbox.checked = result.hideFolderNames || false;
    setZerowidthSpaceCheckbox.checked = result.setZerowidthSpace || false;
  });

  // 値が変更されたら保存
  hideFolderNamesCheckbox.addEventListener("change", () => {
    browser.storage.local.set({
      hideFolderNames: hideFolderNamesCheckbox.checked
    });
  });

  setZerowidthSpaceCheckbox.addEventListener("change", () => {
    browser.storage.local.set({
      setZerowidthSpace: setZerowidthSpaceCheckbox.checked
    });
  });
});
