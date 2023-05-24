var id = "toolbar_____";

function isEmpty(obj) {
    for(var prop in obj) {
        if(Object.prototype.hasOwnProperty.call(obj, prop))
            return false;
    }
    return JSON.stringify(obj) === JSON.stringify({});
}

function onError(error) {
  browser.browserAction.enable();
  console.log(error)
}

function changeIcon(mode) {
  browser.browserAction.setIcon({
    path: mode ? {
      19: "icons/icon-19.png",
      38: "icons/icon-38.png"
    } : {
      19: "icons/icon-19-gray.png",
      38: "icons/icon-38-gray.png"
    }
  });
}

function saveAndEmpty() {
  browser.bookmarks.getTree(function(results) {
    results[0].children.forEach(function(toolbar) {
      if (toolbar.id == id) {
        var backup = [];
        // Check bookmark title as empty
        toolbar.children.forEach(function(bookmark) {
          if (!bookmark.title) {
            browser.storage.local.get("backup").then(function(data) {
              var b = data.backup.find(item => item.id === bookmark.id);
              if (b !== undefined) {
                // Copy title if found from backup
                bookmark.title = b.title;
              }
            }, onError);
          }
          backup.push(bookmark);
        });
        // Take the difference and push
        browser.storage.local.get("backup").then(function(data) {
          data.backup.concat(backup).forEach(item => {
            if (data.backup.includes(item) && !backup.includes(item)) {
              backup.push(item);
            }
          })
        }, onError);
        browser.storage.local.set({
          backup: backup
        }).then(function() {
          var len = toolbar.children.length;
          var count = 1;
          toolbar.children.forEach(function(bookmark) {
            browser.bookmarks.update(bookmark.id, {
              title: "",
              url: bookmark.url
            }, function() {
              count++;
              if (count >= len) {
                browser.browserAction.enable();
              }
            });
          });
        }, onError)
      }
    });
  });
}

function restore() {
  browser.bookmarks.getTree(function(results) {
    results[0].children.forEach(function(toolbar) {
      if (toolbar.id == id) {
        browser.storage.local.get("backup").then(function(data) {
          var len = toolbar.children.length;
          var count = 1;
          toolbar.children.forEach(function(bookmark) {
            var b = data.backup.find(item => item.id === bookmark.id);
            if (b !== undefined) {
              browser.bookmarks.update(bookmark.id, {
                title: b.title,
                url: bookmark.url
              }, function() {
                count++;
                if (count >= len) {
                  browser.browserAction.enable();
                }
              });
            }
          });
        }, onError)
      }
    });
  });
}

function onGot(data) {
  if (isEmpty(data)) {
    browser.storage.local.set({
      mode: true
    }).then(function() {
      saveAndEmpty();
      changeIcon(true)
    }, onError)
  } else {
    var nmode = !data.mode
    browser.storage.local.set({
      mode: nmode
    }).then(function() {
      if (nmode) {
        saveAndEmpty();
      } else {
        restore();
      }
      changeIcon(nmode)
    }, onError)
  }
}

function toggleCompact() {
  browser.browserAction.disable();
  browser.storage.local.get("mode").then(onGot, onError);
}

function setup() {
  browser.storage.local.get("mode").then(function(data) {
    if (!isEmpty(data)) {
      changeIcon(data.mode);
    }
  }, onError);
}

function toggleCompactWithKey(command) {
  if (command === "toggle-compact") {
    toggleCompact();
  }
}

browser.browserAction.onClicked.addListener(toggleCompact);
browser.runtime.onUpdateAvailable.addListener(setup);
browser.runtime.onInstalled.addListener(setup);
browser.runtime.onStartup.addListener(setup);
browser.commands.onCommand.addListener(toggleCompactWithKey);
