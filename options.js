document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("hideFolderNames");

  // 初期値を読み込む
  browser.storage.local.get("hideFolderNames").then((data) => {
    checkbox.checked = data.hideFolderNames || false;
  });

  // 値が変更されたら保存
  checkbox.addEventListener("change", () => {
    browser.storage.local.set({
      hideFolderNames: checkbox.checked
    });
  });
});
