const MENU_PARENT = "menuParent";
const MENU_DEFAULT = "menuDefault";
const MENU_MD = "menuMarkdown";
const MENU_HTML = "menuHTML";

const COMMAND_DEFAULT = "copyTitleURLDefault";
const COMMAND_MD = "copyTitleURLMarkdown";
const COMMAND_HTML = "copyTitleURLHTML";

// Create context menus on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_PARENT,
    title: "Sharemaster: Copy Title and URL Fast",
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
  if (command === COMMAND_DEFAULT) {
    copyTitleURL(tab, "default");
  } else if (command === COMMAND_MD) {
    copyTitleURL(tab, "markdown");
  } else if (command === COMMAND_HTML) {
    copyTitleURL(tab, "html");
  }
});

// Function to copy title and URL in different formats
function copyTitleURL(tab, format) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (format, title, url) => {
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
        console.error("Failed to copy text: ", err);
      });
    },
    args: [format, tab.title, tab.url],
  });
}