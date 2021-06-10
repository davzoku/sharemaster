const MENU_PARENT = "menuParent";
const MENU_DEFAULT = "menuDefault";
const MENU_MD = "menuMarkdown";
const MENU_HTML = "menuHTML";

const COMMAND_DEFAULT = "copyTitleURLDefault";
const COMMAND_MD = "copyTitleURLMarkdown";
const COMMAND_HTML = "copyTitleURLHTML";

// context menu
chrome.contextMenus.create({
  id: MENU_PARENT,
  title: "Sharemaster : Copy Title and URL Fast",
  contexts: ["all"],
});

chrome.contextMenus.create({
  id: MENU_DEFAULT,
  title: "Copy Title and URL",
  contexts: ["all"],
  parentId: MENU_PARENT,
});

chrome.contextMenus.create({
  id: MENU_MD,
  title: "Copy Title and URL in Markdown",
  contexts: ["all"],
  parentId: MENU_PARENT,
});

chrome.contextMenus.create({
  id: MENU_HTML,
  title: "Copy Title and URL in HTML",
  contexts: ["all"],
  parentId: MENU_PARENT,
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId == MENU_DEFAULT) {
    copyTitleURLDefault();
  } else if (info.menuItemId == MENU_MD) {
    copyTitleURLMarkdown();
  } else if (info.menuItemId == MENU_HTML) {
    copyTitleURLHTML();
  }
});

// shortcut commands
chrome.commands.onCommand.addListener(function (command) {
  if (command === COMMAND_DEFAULT) {
    copyTitleURLDefault();
  } else if (command === COMMAND_MD) {
    copyTitleURLMarkdown();
  } else if (command === COMMAND_HTML) {
    copyTitleURLHTML();
  }
});

function copyTitleURLDefault() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    let title = tabs[0].title;
    let url = tabs[0].url;
    copyToClipboard(title + "\n" + url);
  });
}

function copyTitleURLMarkdown() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    let title = tabs[0].title;
    let url = tabs[0].url;
    copyToClipboard("[" + url + "](" + title + ")");
  });
}

function copyTitleURLHTML() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    let title = tabs[0].title;
    let url = tabs[0].url;
    copyToClipboard('<a href="' + url + '">' + title + "</a>");
  });
}

function copyToClipboard(text) {
  var tempField = document.createElement("textarea");
  tempField.textContent = text;
  document.body.appendChild(tempField);
  tempField.select();
  document.execCommand("copy");
  document.body.removeChild(tempField);
}
