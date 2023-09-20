const { JSDOM } = require("jsdom");

function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

function getURLsFromHTML(htmlbody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlbody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      //relative url
      try {
        const urlObjt = new URL(`${baseURL}${linkElement.href}`);
        urls.push(urlObjt.href);
      } catch (err) {
        console.log(`relative error : ${err.message}`);
      }
    } else {
      //absolute url
      try {
        const urlObjt = new URL(`${linkElement.href}`);
        urls.push(urlObjt.href);
      } catch (err) {
        console.log(`absolute error : ${err.message}`);
      }
    }
  }
  return urls;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
};
