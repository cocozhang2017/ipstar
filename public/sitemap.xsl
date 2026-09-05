<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="s xhtml">

<xsl:output method="html" encoding="UTF-8" indent="yes"/>

<xsl:template match="/">
  <html>
    <head>
      <title>IPStar Sitemap</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 1000px;
          margin: 40px auto;
          padding: 0 20px;
          color: #1e293b;
          background: #f8fafc;
        }
        h1 { color: #4f46e5; font-size: 24px; margin-bottom: 8px; }
        .subtitle { color: #64748b; margin-bottom: 24px; }
        table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        th {
          background: #4f46e5;
          color: #fff;
          text-align: left;
          padding: 12px 16px;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        td {
          padding: 12px 16px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 14px;
        }
        tr:last-child td { border-bottom: none; }
        tr:hover { background: #f8fafc; }
        a { color: #4f46e5; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .priority {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }
        .p-high { background: #dcfce7; color: #166534; }
        .p-mid { background: #fef9c3; color: #854d0e; }
        .p-low { background: #e2e8f0; color: #475569; }
      </style>
    </head>
    <body>
      <h1>IPStar Sitemap</h1>
      <p class="subtitle">共 <xsl:value-of select="count(s:urlset/s:url)"/> 个页面</p>
      <table>
        <thead>
          <tr>
            <th>URL</th>
            <th>Last Modified</th>
            <th>Change Freq</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          <xsl:for-each select="s:urlset/s:url">
            <tr>
              <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
              <td><xsl:value-of select="s:lastmod"/></td>
              <td><xsl:value-of select="s:changefreq"/></td>
              <td>
                <xsl:variable name="p" select="s:priority"/>
                <xsl:choose>
                  <xsl:when test="$p >= 0.9">
                    <span class="priority p-high"><xsl:value-of select="$p"/></span>
                  </xsl:when>
                  <xsl:when test="$p >= 0.5">
                    <span class="priority p-mid"><xsl:value-of select="$p"/></span>
                  </xsl:when>
                  <xsl:otherwise>
                    <span class="priority p-low"><xsl:value-of select="$p"/></span>
                  </xsl:otherwise>
                </xsl:choose>
              </td>
            </tr>
          </xsl:for-each>
        </tbody>
      </table>
    </body>
  </html>
</xsl:template>

</xsl:stylesheet>
