const { isEmpty } = require("../src/compact-toolbar.js");
const { changeIcon } = require("../src/compact-toolbar.js");
const sinon = require("sinon");

describe("isEmpty", () => {
  it("should return true for an empty object", () => {
    expect(isEmpty({})).toBe(true);
  });

  it("should return false for an object with properties", () => {
    expect(isEmpty({ a: 1 })).toBe(false);
  });
});

describe("changeIcon", () => {
  beforeEach(() => {
    global.browser = {
      browserAction: {
        setIcon: sinon.stub(),
      },
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should set colored icon when mode is true", () => {
    changeIcon(true);
    sinon.assert.calledWith(browser.browserAction.setIcon, {
      path: {
        19: "../icons/icon-19.png",
        38: "../icons/icon-38.png",
      },
    });
  });

  it("should set gray icon when mode is false", () => {
    changeIcon(false);
    sinon.assert.calledWith(browser.browserAction.setIcon, {
      path: {
        19: "../icons/icon-19-gray.png",
        38: "../icons/icon-38-gray.png",
      },
    });
  });
});
