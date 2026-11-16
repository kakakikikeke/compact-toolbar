const { beforeEach, describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  changeIcon,
  isEmpty,
  onError,
  setup,
  toggleCompact,
} = require("../src/compact-toolbar");

function mockFn(implementation = () => {}) {
  const calls = [];
  const fn = (...args) => {
    calls.push(args);
    return implementation(...args);
  };
  fn.calls = calls;
  return fn;
}

describe("compact-toolbar", () => {
  beforeEach(() => {
    global.browser = {
      browserAction: {
        enable: mockFn(),
        disable: mockFn(),
        setIcon: mockFn(),
      },
      storage: {
        local: {
          get: mockFn(async () => ({ mode: true })),
          set: mockFn(async () => {}),
        },
      },
      bookmarks: {
        getTree: mockFn(),
        update: mockFn(),
      },
    };
  });

  it("isEmpty returns true for empty object", () => {
    assert.equal(isEmpty({}), true);
  });

  it("isEmpty returns false for non-empty object", () => {
    assert.equal(isEmpty({ key: "value" }), false);
  });

  it("onError enables browserAction and logs error", () => {
    const originalLog = console.log;
    const consoleSpy = mockFn();
    console.log = consoleSpy;
    try {
      onError("error occurred");
    } finally {
      console.log = originalLog;
    }

    assert.equal(browser.browserAction.enable.calls.length, 1);
    assert.deepEqual(consoleSpy.calls, [["error occurred"]]);
  });

  it("changeIcon sets icon with correct path when mode is true", () => {
    changeIcon(true);
    assert.deepEqual(browser.browserAction.setIcon.calls, [
      [
        {
          path: {
            19: "../icons/icon-19.png",
            38: "../icons/icon-38.png",
          },
        },
      ],
    ]);
  });

  it("changeIcon sets icon with correct path when mode is false", () => {
    changeIcon(false);
    assert.deepEqual(browser.browserAction.setIcon.calls, [
      [
        {
          path: {
            19: "../icons/icon-19-gray.png",
            38: "../icons/icon-38-gray.png",
          },
        },
      ],
    ]);
  });

  it("setup sets icon if mode is in local storage", async () => {
    await setup();
    assert.equal(browser.browserAction.setIcon.calls.length, 1);
  });

  it("toggleCompact disables browserAction and gets mode", () => {
    toggleCompact();
    assert.equal(browser.browserAction.disable.calls.length, 1);
    assert.deepEqual(browser.storage.local.get.calls, [["mode"]]);
  });
});
