const { normalizeURL, getURLsFromHTML } = require("./crawl.js");
const { test, expect } = require("@jest/globals");
// test("normalizeURL strip protocol", () => {
//   const input = "https://blog.boot.dev/path";
//   const actual = normalizeURL(input);
//   const expected = "blog.boot.dev/path";
//   expect(actual).toEqual(expected);
// });

// test("normalizeURL strip trailling slash", () => {
//   const input = "https://blog.boot.dev/path/";
//   const actual = normalizeURL(input);
//   const expected = "blog.boot.dev/path";
//   expect(actual).toEqual(expected);
// });

// test("normalizeURL strip capitals", () => {
//   const input = "https://BLOG.boot.dev/path";
//   const actual = normalizeURL(input);
//   const expected = "blog.boot.dev/path";
//   expect(actual).toEqual(expected);
// });
// test("normalizeURL strip http", () => {
//   const input = "http://BLOG.boot.dev/path";
//   const actual = normalizeURL(input);
//   const expected = "blog.boot.dev/path";
//   expect(actual).toEqual(expected);
// });
test("working with absolute url", () => {
  const inputHTMLBody = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <a href="https://blog.boot.dev"> blog boot dev</a>
  </body>
</html>

  `;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://blog.boot.dev/"];
  expect(actual).toEqual(expected);
});

test("testing relative urls ", () => {
  const inputHTMLBody = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <a href="/path/"> blog boot dev</a>
  </body>
</html>

  `;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://blog.boot.dev/path/"];
  expect(actual).toEqual(expected);
});

test("both", () => {
  const inputHTMLBody = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
  <a href="https://blog.boot.dev/path1/"> blog boot dev</a>
    <a href="/path2/"> blog boot dev</a>
  </body>
</html>

  `;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [
    "https://blog.boot.dev/path1/",
    "https://blog.boot.dev/path2/",
  ];
  expect(actual).toEqual(expected);
});

test("invalid path", () => {
  const inputHTMLBody = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <a href="invalid"> blog boot dev</a>
  </body>
</html>

  `;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  console.log(actual);
  const expected = [];
  expect(actual).toEqual(expected);
});
