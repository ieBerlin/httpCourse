const { JSDOM } = require("jsdom");

function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}
async function crawlPage(baseURL, currentURL, pages) {
  const baseUrlObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);
  if (currentURLObj.hostname !== baseUrlObj.hostname) {
    return pages;
  }
  const normalizedCurrentURL = normalizeURL(currentURL);
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }
  pages[normalizedCurrentURL] = 1;
  console.log(`actively crawling ${currentURL}`);

  try {
    const reponse = await fetch(currentURL);

    if (reponse.status > 399) {
      console.log(
        `error in fetch status code : ${reponse.status}, on page : ${currentURL}`
      );
      return pages;
    }

    const contentType = reponse.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(
        `non html reponse, content type ${contentType}, on page : ${currentURL}`
      );
      return pages;
    }
    const htmlBody = await reponse.text();
    const nextURLs = getURLsFromHTML(htmlBody, baseURL);
    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
  } catch (err) {
    console.log(`error in fetch : ${err.message}, on page : ${currentURL}`);
  }
  return pages;
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
  crawlPage,
};
