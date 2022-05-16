import React, { Fragment } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
export const LinkContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  width: 100%;
  max-width: 450px;
  background: #fff;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
  margin: 5px 0 !important;
  position: relative;
  height: 97px;
  overflow: hidden;
`;

export const LinkBody = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

export const LinkAnchorWrapper = styled.a`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

//  Image
export const LinkObjectWrapper = styled.div`
  display: flex;
  width: 97px;
  border-right: 1px solid #e9e9e9;
`;
export const LinkObject = styled.img`
  width: 100%;
  object-fit: scale-down;
  // height: 100%;
`;

// Description
export const LinkMeta = styled.div`
  display: flex;
  width: calc(100% - 97px);
  padding: 9px 10px 4px;
  flex-direction: column;
`;
export const LinkAnchor = styled.div`
  font-size: 12px !important;
  color: #2d76ce !important;
  line-height: 1.2;
  font-weight: 400;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 1.12;
`;
export const LinkTitle = styled.div`
  font-size: 15px;
  color: #19191a;
  line-height: 1.2;
  margin: 8px 0 6px;
  font-weight: 400;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 1.4;
`;
export const LinkDesc = styled.div`
  font-size: 12px;
  color: #999999;
  line-height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
  line-height: 18px;
`;

function LinkPreview({ embeddedLinkData }) {
  const { t } = useTranslation();
  return (
    <div className="d-flex flex-column link__preview_list">
      {embeddedLinkData === undefined ? (
        <LinkContainer
          className="d-flex align-items-center"
          style={{ padding: 0, margin: 0 }}
        >
          <LinkBody>
            <LinkMeta
              style={{ padding: 0, margin: 0, width: "100%" }}
              className="d-flex align-items-center"
            >
              <LinkDesc style={{ fontSize: "15px", color: "#19191a" }}>
                {t("loading")}
              </LinkDesc>
            </LinkMeta>
          </LinkBody>
        </LinkContainer>
      ) : (
        embeddedLinkData &&
        embeddedLinkData.length > 0 &&
        embeddedLinkData.map((embedded) => {
          return (
            <Fragment key={`${embedded.imageId}-fragment`}>
              {embedded.title ? (
                <LinkContainer key={embedded.imageId}>
                  <LinkBody>
                    {embedded.image && (
                      <LinkObjectWrapper>
                        <LinkObject src={embedded.image} />
                      </LinkObjectWrapper>
                    )}
                    <LinkMeta>
                      {embedded.link && (
                        <LinkAnchor>{embedded.link}</LinkAnchor>
                      )}
                      {embedded.title && (
                        <LinkTitle>{embedded.title}</LinkTitle>
                      )}

                      <LinkDesc>
                        {embedded.description
                          ? `${
                              embedded.description.length > 60
                                ? embedded.description.substring(0, 60) + "..."
                                : embedded.description
                            }`
                          : t("link.preview:no.description")}
                      </LinkDesc>
                    </LinkMeta>
                  </LinkBody>
                  <LinkAnchorWrapper
                    href={embedded.link}
                    target="_blank"
                  ></LinkAnchorWrapper>
                </LinkContainer>
              ) : (
                <span />
              )}{" "}
              {/*(
                <LinkContainer
                  key={embedded.imageId}
                  style={{
                    maxWidth: "245px",
                    height: "auto",
                  }}
                >
                  <LinkBody>
                    <LinkMeta
                      style={{
                        width: "100%",
                        padding: "16px 10px",
                      }}
                    >
                      <LinkDesc>{t("link.preview:no.preview")}</LinkDesc>
                    </LinkMeta>
                  </LinkBody>
                </LinkContainer>
              )*/}
            </Fragment>
          );
        })
      )}
    </div>
  );
}
export default LinkPreview;
