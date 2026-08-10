function getCookieValue(name) {
  let result = document.cookie.match("(^|[^;]+)s*" + name + "s*=s*([^;]+)");
  return result ? result.pop() : "";
}

var userID = getCookieValue("CustomerNumber");
var userName = getCookieValue("CustomerName");
var pageName = window.location.pathname.split("/").pop().split(".")[0];
var pageUrl = window.location.href;

var digitalData = {
  account: {
    userId: userID,
    userName: userName,
    Age: "age",
    Email: "email",
  },
  page: {
    pageName: pageName,
    pageType: "page",
    pageUrl: pageUrl,
  },
};
