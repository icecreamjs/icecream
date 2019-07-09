/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const ProjectTitle = () => (
      <div className="titleContainer">
        <div className="logoTitle">
          <img
            src={`${baseUrl}img/logo.svg`}
            alt="iceCream logo"
            width={120}
            height={120}
          />
          <h2 className="projectTitle">{siteConfig.title}</h2>
        </div>
        <h2>
          <small>{siteConfig.tagline}</small>
        </h2>
      </div>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href={docUrl("how-it-works")}>How it works</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl } = siteConfig;

    const Block = props => (
      <Container
        padding={["bottom", "top"]}
        id={props.id}
        background={props.background}
      >
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const FeatureCallout = () => (
      <div
        className="productShowcaseSection paddingBottom"
        style={{ textAlign: "center" }}
      >
        <h2>Motivations</h2>
        <MarkdownBlock>
          [*Redux*](https://redux.js.org/) and
          [*redux-saga*](https://redux-saga.js.org/) are commonly used to handle
          global states in modern JavaScript applications. Their integrations
          in projects in the long term can be painful and lead to complex files
          structures that make code edition a headache. IceCream takes up the
          idea of **models** by the framework [*dvaJs*](https://dvajs.com/) to
          centralize all the logic but with a less opiniated behavior. It's why
          iceCream is not considered a framework, but more a tool to simplify
          and organize your code logic.
        </MarkdownBlock>
      </div>
    );

    const Libraries = () => (
      <Block background="light" layout="threeColumn">
        {[
          {
            content: "A predictable state container for JavaScript apps.",
            image: `${baseUrl}img/redux_logo.svg`,
            imageLink: "https://redux.js.org/",
            imageAlt: "Redux logo",
            imageAlign: "top",
            title: "Redux"
          },
          {
            title: "requisite knowledge",
            content:
              "iceCream helps you to use redux and redux-saga but you still have to know how they work and how to use them. Be sure to check their documentations before using iceCream!",
            image: `${baseUrl}img/infoLogo.svg`,
            imageAlt: "knowledge logo",
            imageAlign: "top"
          },
          {
            content: "An alternative side effect model for Redux apps",
            image: `${baseUrl}img/Redux-Saga-Logo-Compact.png`,
            imageLink: "https://redux-saga.js.org/",
            imageAlt: "redux-saga logo",
            imageAlign: "top",
            title: "Redux-saga"
          }
        ]}
      </Block>
    );

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter(user => user.pinned)
        .map(user => (
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : "") + page;

      return (
        <div className="productShowcaseSection paddingBottom">
          <h2>Who is Using This?</h2>
          <p>This project is used by all these people</p>
          <div className="logos">{showcase}</div>
          <div className="more-users">
            <a className="button" href={pageUrl("users.html")}>
              More {siteConfig.title} Users
            </a>
          </div>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <FeatureCallout />
          <Libraries />
        </div>
      </div>
    );
  }
}

module.exports = Index;
