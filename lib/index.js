/* eslint-disable comma-dangle */
/* eslint-disable space-before-function-paren */
/* eslint-disable quotes */

const Express = require("express");
const path = require("path");
const translate = require("translate-google-api");
const router = Express.Router();

const buildUrl = (req, subpath) =>
  req.protocol + "://" + path.join(req.get("host"), req.baseUrl, subpath);

/* cors */
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

router.get("/", (req, res) => {
  res.json({
    translate: buildUrl(req, "translate"),
  });
});

router.get("/translate/", async function (req, res, next) {
  if (!req.query.locale) {
    return next();
  }

  try {
    const locale = JSON.parse(req.query.locale);
    const values = Object.values(locale);
    const keys = Object.keys(locale);
    const to = !req.query.to
      ? [
          "hi",
          "es",
          "ru",
          "de",
          "ja",
          "nl",
          "ta",
          "ko",
          "ml",
          "id",
          "zh-CN",
          "bn",
          "mr",
          "vi",
          "tr",
          "pt",
          "fr",
          "it",
          "ro",
          "th",
        ]
      : req.query.to;
    const result = {};
    for (let i = 0; i < to?.length; i++) {
      const temp = await translate(values, {
        from: "en",
        tld: "cn",
        to: to[i],
      });
      const tempRes = {};
      keys.map((f, j) => Object.assign(tempRes, { [f]: temp[j] }));
      Object.assign(result, { [to[i]]: tempRes });
    }

    res.json({ result });
  } catch (e) {
    res.json({ result: e });
  }
});

function errorHandler(err, req, res, next) {
  res.status(400).json({ message: err.message });
  next();
}

router.use(errorHandler);

module.exports = router;
