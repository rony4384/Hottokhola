import React from "react";
import Head from "next/head";

type SeoProps = {
  title: string;
  description: string;
  canonical?: string;
  css?: string;
  js?: string;
  image?: string;
};

export const SEO: React.FC<SeoProps> = ({
  title,
  description,
  canonical,
  css,
  js,
  image,
}) => (
  <Head>
    <title>{title}</title>

    {/* Open Graph */}
    <meta property="og:url" content="hottokhola.com" key="ogurl" />
    <meta
      property="og:image"
      content="admin.hottokhola.com/assets/images/og.jpg"
      key="ogimage"
    />
    <meta property="og:site_name" content="hottokhola" key="ogsitename" />
    <meta property="og:title" content="hottokhola" key="ogtitle" />
    <meta property="og:description" content="hottokhola" key="ogdesc" />
    <meta property="og:type" content="website" key="ogtype" />

    {/* <meta
      name="viewport"
      content="width=device-width,minimum-scale=1,initial-scale=1"
    />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta
      name="og:description"
      property="og:description"
      content={description}
    />
    <meta property="og:site_name" content="Buy & Bazar" />
    <meta property="og:url" content={`${canonical}`} />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:site" content="@propernounco" />
    <meta name="twitter:creator" content="@propernounco" /> */}
    {css && <link rel="stylesheet" href={`${css}`} />}
    {/* {image ? (
      // <meta property="og:image" content={`${image}`} />
      <meta
        property="og:image"
        content="https://admin.hottokhola.com/assets/images/og.jpg"
      />
    ) : (
      <meta
        property="og:image"
        content="https://admin.hottokhola.com/assets/images/og.jpg"
      />
    )}
    {image && (
      <meta
        name="twitter:image"
        content="https://admin.hottokhola.com/assets/images/og.jpg"
      />
    )} */}
    {canonical && <link rel="canonical" href={`${canonical}`} />}
    {js && <script type="text/javascript" src={`${js}`}></script>}
  </Head>
);
