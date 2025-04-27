/* eslint-disable no-undef */
browser.browserAction.onClicked.addListener(toggleCompact);
browser.runtime.onUpdateAvailable.addListener(setup);
browser.runtime.onInstalled.addListener(setup);
browser.runtime.onStartup.addListener(setup);
browser.commands.onCommand.addListener(toggleCompactWithKey);
