const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: `http://localhost:8000/`,
      changeOrigin: true,
    })
  );
  app.use(
    "/get",
    createProxyMiddleware({
      target: `http://localhost:8000/`,
      changeOrigin: true,
    })
  );
  app.use(
    "/stat",
    createProxyMiddleware({
      target: `http://localhost:8000/`,
      changeOrigin: true,
    })
  );
  app.use(
    "/vol",
    createProxyMiddleware({
      target: `http://localhost:8000/`,
      changeOrigin: true,
    })
  );
};
