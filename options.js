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

document.getElementById("export-bookmarks").addEventListener("click", () => {
  browser.bookmarks.getTree().then((bookmarks) => {
    const html = generateBookmarkHTML(bookmarks[0]);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const filename = `bookmarks-backup-${new Date().toISOString().slice(0, 10)}.html`;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  });
});

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;")
             .replace(/"/g, "&quot;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;");
}

function generateBookmarkHTML(node) {
  let html = '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n';
  html += '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n';
  html += '<TITLE>Bookmarks</TITLE>\n';
  html += '<H1>Bookmarks</H1>\n';
  html += '<DL><p>\n';
  html += buildHTMLFromNode(node);
  html += '</DL><p>\n';
  return html;
}

function buildHTMLFromNode(node, indent = "    ") {
  let html = "";
  if (node.children) {
    html += `${indent}<DT><H3>${escapeHtml(node.title)}</H3>\n`;
    html += `${indent}<DL><p>\n`;
    for (const child of node.children) {
      html += buildHTMLFromNode(child, indent + "    ");
    }
    html += `${indent}</DL><p>\n`;
  } else if (node.url) {
    html += `${indent}<DT><A HREF="${escapeHtml(node.url)}">${escapeHtml(node.title)}</A>\n`;
  }
  return html;
}
