import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

function PostContentView(props) {
  const { t } = useTranslation();
  const [overflowActive, setOverflowActive] = useState(false);
  const [removeOverflow, setRemoveOverflow] = useState(false);
  const [ShowLess, setShowLess] = useState(false);
  const nodeRef = useRef();

  useEffect(() => {
    let isEllipsis = isEllipsisActive(nodeRef.current);
    setOverflowActive(isEllipsis);
  }, [nodeRef]);

  useEffect(() => {
    let isEllipsis = isEllipsisActive(nodeRef.current);
    setOverflowActive(isEllipsis);
  }, [props.index]);

  const isEllipsisActive = (e) => {
    return e.offsetHeight < e.scrollHeight || e.offsetWidth < e.scrollWidth;
  };

  const showMore = (e) => {
    e.stopPropagation();
    setRemoveOverflow(true);
    setOverflowActive(false);
    setShowLess(true);
  };

  const showLess = (e) => {
    e.stopPropagation();
    setRemoveOverflow(false);
    setOverflowActive(true);
    setShowLess(false);
  };

  return (
    <div className="post-overflow-wrapper">
      <div
        id={`PostContent${props.index}`}
        ref={nodeRef}
        style={{display: 'inline', wordBreak: 'break-all'}}
        className={`${
          removeOverflow ? "post-overflow-hidden" : "post-overflow"
        }`}
        dangerouslySetInnerHTML={{
          __html: props?.content?.length > 152 ? `${props?.content?.substring(1, 152)}...` : props?.content,
        }}
      />
      {props?.content?.length > 144 && (
        <span onClick={showMore} style={{ cursor: "pointer" }}>
        {t(" More")}
      </span>
      )}
      {/* {overflowActive && (
        <p id={`PostContent-more${props.index}`} className="show-more-post">
          ...
          <span onClick={showMore} style={{ cursor: "pointer" }}>
            {t(" More")}
          </span>
        </p>
      )} */}
      {ShowLess && (
        <p id={`PostContent-less${props.index}`} className="show-more-post">
          ...
          <span onClick={showLess} style={{ cursor: "pointer" }}>
            {t(" less")}
          </span>
        </p>
      )}
    </div>
  );
}

export default PostContentView;
