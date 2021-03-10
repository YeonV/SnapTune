const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/get",
    createProxyMiddleware({
      target: `http://localhost:3001/`,
      changeOrigin: true,
    })
  );
  app.use(
    "/stat",
    createProxyMiddleware({
      target: `http://localhost:3001/`,
      changeOrigin: true,
    })
  );
  app.use(
    "/vol",
    createProxyMiddleware({
      target: `http://localhost:3001/`,
      changeOrigin: true,
    })
  );
};
