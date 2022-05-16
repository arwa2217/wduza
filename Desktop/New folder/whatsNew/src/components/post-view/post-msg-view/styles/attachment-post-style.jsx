import styled from "styled-components";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

export const BoxDivWrapper = styled.div`
  // width: 100%;
  margin: 5px 10px 5px 0 !important;
  position: relative;
  width: 158px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 4px 4px 0 0;
  .text-danger {
    font-size: 12px;
  }
`;
export const DownloadAll = styled.div`
  margin: 5px 10px 5px 0 !important;
  position: relative;
  width: 158px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  cursor: pointer;
`;
export const BoxDivWrapperToolBar = styled.div`
  // width: 100%;
  margin: 5px 10px 5px 0;
  position: relative;

  .text-danger {
    font-size: 12px;
  }
`;

export const BoxDiv = styled.div`
  padding: 9px 10px;
  margin: 0;
  background: #fbfbfb;
  position: relative;
  cursor: pointer;
  height: 50px;
  border-radius: 4px;
  padding-top: 5px;
  padding-left: 6px;
  //z-index: 0;
`;
export const BoxDivToolBar = styled.div`
  width: 160px;
  height: 52px;
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  padding: 9px 10px;
  margin: 0;
  background: #fbfbfb;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
`;

export const BoxDivLarge = styled(BoxDiv)`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 326px;
`;

export const BoxDivInner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover {
    .summary-file-name {
      width: 65%;
    }
  }
  svg.file-extention-icon {
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }
`;
export const BoxDivInnerAttachToolbar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  &:hover {
    .summary-file-name {
      width: 65%;
    }
  }
`;
export const FileExt = styled.span`
  min-width: 70px;
  height: 30px;
  padding: 7px;
  border: 1px solid #111111;
  color: #111111;
  font-size: 12px;
  border-radius: 4px;
  font-weight: 400;
  letter-spacing: 0.2px;
`;
export const FileExtIcon = styled.img`
  margin-right: 5px;
  border-radius: 5px;
`;
export const Image = styled.img`
  max-width: 30px;
  max-height: 30px;
  margin-left: 20px;
  margin-top: 15px;
  float: left;
`;
export const Details = styled.div`
  display: inline-block;
  width: 114px;
`;
export const DetailsAttachToolBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`;
export const FileAction = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0;
`;

export const FileActionHover = styled(FileAction)`
  display: none;
  top: -2px;
  width: 100%;
  left: 0;
  position: absolute;
  background: rgba(251, 251, 251, 0.8);
  backdrop-filter: blur(6px);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  height: 30px;
  border-radius: 4px 4px 0 0;
  z-index: 999;
  justify-content: center;
  ${BoxDiv}:hover & {
    display: flex;
  }
`;

export const FileInfo = styled.div`
  margin: 0 10px 0 0;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
export const FileInfoAttachToolBar = styled.div`
  margin: 0 10px 0 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;
export const FileInfoHover = styled(FileInfo)`
  ${BoxDiv}:hover & {
    max-width: 108px !important;
  }
`;

export const Name = styled.span`
  display: block;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  font-weight: 500;
  cursor: pointer;
  line-height: 1.2;
  color: rgba(0, 0, 0, 0.9);
`;

export const ImageName = styled(Name)`
  display: none;

  ${BoxDiv}:hover & {
    display: block;
  }
`;

export const Size = styled.span``;
export const SizeAttachToolBar = styled.span`
  font-size: 9px;
  color: #00000066;
  font-weight: 500;
  line-height: 1;
  margin-top: 4px;
`;

export const ImageSize = styled(Size)`
  ${BoxDiv}:hover & {
    display: block;
  }
`;

export const Menu = styled.div``;

export const MenuDownload = styled.div`
  // margin-top: 0;
  // margin-left: 10px;
  // margin-right: 0;
  // width: 30px;
  // height: 30px;
  // display: inline-block;
`;

export const Download = styled.span`
  font-size: 10px;
  color: #00a95b;

  &:hover {
    cursor: pointer;
  }
  &.e-signature {
    margin-left: 6px;
  }
`;

export const Options = styled(Nav)`
  // float: right;
  // margin-right: 10px;

  &:hover {
    cursor: pointer;
  }

  // .nav-link:hover,
  // .nav-link:active {
  //   text-decoration: none;
  //   background: #f1f6fc;
  // }

  div.dropdown-menu.show {
    padding: 0 !important;
    height: fit-content;
  }

  .dropdown-item {
    display: block;
    width: 187px;
    // padding-top: 18px;
    // padding-left: 18px;
    // padding-bottom: 17px;
    color: #252534;
    height: 50px;
    margin: 0px !important;
  }

  .dropdown-item:focus,
  .dropdown-item:hover {
    color: #4d4de2;
    text-decoration: none;
    background-color: #f1f6fc;
  }

  .disabled {
    background: rgba(0, 0, 0, 0.03);
    opacity: 0.3;
  }

  .img-icon {
    margin-top: -3px;
  }
  .item-name {
    padding: 0;
    margin-left: 10px;
    font-size: 15px;
    line-height: 100%;
  }
`;

export const OptionsDropdown = styled(NavDropdown)`
  .nav-link {
    display: inline-block;
    padding: 0;
  }
  a#nav-dropdown.dropdown-toggle.nav-link::after {
    display: none;
  }
`;

export const ViewDiv = styled.div`
  border-radius: 4px;
  width: 100%;
  height: 140px;
  margin: 10px 0 0 !important;
  position: relative;
  overflow: hidden;

  .overlay {
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.5);
    color: #f1f1f1;
    width: 100%;
    height: 100%;
    transition: 0.5s ease;
    opacity: 0;
    color: white;
    font-size: 14px;
    text-align: center;
    text-decoration-line: underline;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover .overlay {
    opacity: 1;
    cursor: pointer;
  }
`;

export const ViewImage = styled.img`
  width: 100%;
`;

export const DeleteBox = styled.div`
  display: flex;
  background: #f2f2f2;
  border: 1px solid #e9e9e9;
  box-sizing: border-box;
  border-radius: 4px;
  font-size: 12px;

  .break {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 80px;
  }
`;

export const DeleteImageDiv = styled.div`
  width: 40px;
  height: 60px;
  float: left;
  clear: both;
  img {
    margin-left: 5px;
    margin-top: 12px;
    width: 30px;
    height: 30px;
  }
`;

export const DeleteMsgDiv = styled.div`
  width: 245px;
  padding: 8px 15px;

  & p {
    vertical-align: middle;
    line-height: 1;
    display: inline-block;
    color: #19191a;
    font-size: 12px;

    & span:not(.small) {
      line-height: 1.2;
    }
    & span.delete-time {
      margin-top: 4px;
      color: #666666;
    }
  }

  .break {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 90px;
    display: inline-block;
    vertical-align: middle;
    font-weight: 400;
    line-height: 1.12;
  }
  .break:focus,
  .break:hover {
    color: transparent;
  }
  .break:focus:after,
  .break:hover:after {
    content: attr(data-text);
    overflow: visible;
    text-overflow: inherit;
    background: #fff;
    position: absolute;
    left: auto;
    top: auto;
    width: auto;
    max-width: 320px;
    border: 1px solid #eaebec;
    padding: 0 0.5rem;
    box-shadow: 0 2px 0.25rem 0 rgba(0, 0, 0, 0.28);
    white-space: normal;
    word-wrap: break-word;
    display: block;
    color: black;
    margin-top: -20px;
  }

  .static {
    display: inline-block;
    vertical-align: middle;
  }
`;
export const DownloadInfo = styled.div`
  font-size: 9px;
  color: #308f65;
  font-weight: 400;
  line-height: 1;
  margin: 10px 0 0;
  color: rgba(0, 0, 0, 0.5);
  position: absolute;
  bottom: 0;
  height: 22px;
  left: 0;
  right: 0;
  background: rgba(251, 251, 251, 0.8);
  backdrop-filter: blur(6px);
  border-radius: 0px 0px 3px 3px;
  padding: 0 8px;
  z-index: 1;
  &:after {
    content: "";
    height: 1px;
    background: rgba(0, 0, 0, 0.08);
    position: absolute;
    top: 0;
    width: 90%;
  }
  &.download-progress::after{
    display: none;
  }
  > div:first-child {
    margin-right: 10px;
  }

  > .divide {
    padding-right: 10px;
    margin-right: 10px;
    border-right: 1px solid #c8c8c8;
  }
  ${BoxDiv}:hover & {
    color: rgba(0, 0, 0, 0.2);
    span {
      color: rgba(0, 0, 0, 0.2) !important;
    }
    svg path {
      fill-opacity: 0.2;
    }
  }
  .file-info {
    justify-content: space-between;
    height: 100%;
  }
`;
export const FileDownloadInfo = styled.div`
  font-size: 9px;
  color: #308f65;
  font-weight: 400;
  line-height: 1;
  margin: 10px 0 0;

  /* // > div:first-child {
  //   padding-right: 0;
  //   margin-right: 7px;
  //   border-right: 1px solid #c8c8c8;
  } */

  > .divide {
    padding-right: 0;
    margin-right: 7px;
    border-right: 1px solid;
    border-image: linear-gradient(to bottom, transparent 0%, transparent 14%, #c8c8c8 15%, #c8c8c8 85%, transparent 86%, transparent 100%);
    border-image-slice: 1;
  }
`;

export const Count = styled.span`
  ${({ hasDoneByCurrentUser }) => {
    if (hasDoneByCurrentUser) return `color: #19191A;`;
    else return `color: #666666;`;
  }}
  ${({ data }) => {
    let count = data?.toString().split("").length;
    return `margin : ${
      count > 2
        ? " 0 5px"
        : count === 2
        ? "0 9px 0 8px"
        : count === 1
        ? "0 12px"
        : ""
    } !important;`;
  }}
`;

export const Remove = styled.span`
  &:hover {
    cursor: pointer;
  }
`;

export const ThumbnailPreview = styled.div`
  height: 150px;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const NoPreview = styled.span`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 15px;
  font-weight: normal;
  line-height: 100%;
  color: #999999;
`;
export const InfoCount = styled.div`
  display: flex;
  .position-relative {
    margin-left: 8px;
  }
`;
