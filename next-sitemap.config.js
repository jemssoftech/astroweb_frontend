/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://www.astroweb.in",
  generateRobotsTxt: true,
  sitemapSize: 7000,
};
