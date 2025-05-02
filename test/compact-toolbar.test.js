const {
  isEmpty,
  onError,
  changeIcon,
  toggleCompact,
  setup,
  onGot,
  saveAndEmpty,
  restore,
} = require("../src/compact-toolbar");

global.browser = {
  browserAction: {
    enable: jest.fn(),
    disable: jest.fn(),
    setIcon: jest.fn(),
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
    },
  },
  bookmarks: {
    getTree: jest.fn(),
    update: jest.fn(),
  },
};

describe("compact-toolbar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    browser.storage.local.get.mockResolvedValue({ mode: true });
    browser.storage.local.set.mockResolvedValue();
  });

  test("isEmpty returns true for empty object", () => {
    expect(isEmpty({})).toBe(true);
  });

  test("isEmpty returns false for non-empty object", () => {
    expect(isEmpty({ key: "value" })).toBe(false);
  });

  test("onError enables browserAction and logs error", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    onError("error occurred");
    expect(browser.browserAction.enable).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("error occurred");
    consoleSpy.mockRestore();
  });

  test("changeIcon sets icon with correct path when mode is true", () => {
    const originalChangeIcon = jest.requireActual(
      "../src/compact-toolbar",
    ).changeIcon;
    originalChangeIcon(true);
    expect(browser.browserAction.setIcon).toHaveBeenCalledWith({
      path: {
        19: "../icons/icon-19.png",
        38: "../icons/icon-38.png",
      },
    });
  });

  test("changeIcon sets icon with correct path when mode is false", () => {
    const originalChangeIcon = jest.requireActual(
      "../src/compact-toolbar",
    ).changeIcon;
    originalChangeIcon(false);
    expect(browser.browserAction.setIcon).toHaveBeenCalledWith({
      path: {
        19: "../icons/icon-19-gray.png",
        38: "../icons/icon-38-gray.png",
      },
    });
  });

  test("setup sets icon if mode is in local storage", async () => {
    await setup();
    expect(browser.browserAction.setIcon).toHaveBeenCalled();
  });

  test("toggleCompact disables browserAction and gets mode", () => {
    toggleCompact();
    expect(browser.browserAction.disable).toHaveBeenCalled();
    expect(browser.storage.local.get).toHaveBeenCalledWith("mode");
  });
});
