const MENU_PARENT = "menuParent";
const MENU_DEFAULT = "menuDefault";
const MENU_MD = "menuMarkdown";
const MENU_HTML = "menuHTML";

const COMMAND_DEFAULT = "copyTitleURLDefault";
const COMMAND_MD = "copyTitleURLMarkdown";
const COMMAND_HTML = "copyTitleURLHTML";

// Create context menus when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_PARENT,
    title: "Sharemaster: Copy Title & URL",
    contexts: ["all"]
  });
  chrome.contextMenus.create({
    id: MENU_DEFAULT,
    title: "Copy Title and URL",
    contexts: ["all"],
    parentId: MENU_PARENT
  });
  chrome.contextMenus.create({
    id: MENU_MD,
    title: "Copy as Markdown",
    contexts: ["all"],
    parentId: MENU_PARENT
  });
  chrome.contextMenus.create({
    id: MENU_HTML,
    title: "Copy as HTML",
    contexts: ["all"],
    parentId: MENU_PARENT
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === MENU_DEFAULT) {
    copyTitleURL(tab, "default");
  } else if (info.menuItemId === MENU_MD) {
    copyTitleURL(tab, "markdown");
  } else if (info.menuItemId === MENU_HTML) {
    copyTitleURL(tab, "html");
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command, tab) => {
  if (!tab) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        runCommand(tabs[0], command);
      }
    });
  } else {
    runCommand(tab, command);
  }
});

function runCommand(tab, command) {
  if (command === COMMAND_DEFAULT) {
    copyTitleURL(tab, "default");
  } else if (command === COMMAND_MD) {
    copyTitleURL(tab, "markdown");
  } else if (command === COMMAND_HTML) {
    copyTitleURL(tab, "html");
  }
}

// Function to copy title and URL using the scripting API
function copyTitleURL(tab, format) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (format) => {
      const title = document.title;
      const url = window.location.href;
      let textToCopy = "";
      switch (format) {
        case "markdown":
          textToCopy = `[${title}](${url})`;
          break;
        case "html":
          textToCopy = `<a href="${url}">${title}</a>`;
          break;
        default:
          textToCopy = `${title}\n${url}`;
      }
      navigator.clipboard.writeText(textToCopy).catch(err => {
        console.error("Failed to copy text:", err);
      });
    },
    args: [format]
  });
}