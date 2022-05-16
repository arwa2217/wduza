import styled from "styled-components";

const Main = styled.div`
  position: absolute;
  background-color: #fff;
  min-width: 288px;
  z-index: 1003;
  padding: 16px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  top: 100%;
  left: 0;
  .box-scroll {
    width: 100%;
    display: block;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    max-height: calc(100vh - 253px);
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: transparent;
    }
  }

  .box-scroll:hover::-webkit-scrollbar-thumb,
  .box-scroll:active::-webkit-scrollbar-thumb,
  .box-scroll:focus::-webkit-scrollbar-thumb,
  .box-scroll:focus-within::-webkit-scrollbar-thumb {
    background: rgba(136, 136, 136, 0.5);
  }

  .box-scroll:hover::-webkit-scrollbar-track,
  .box-scroll:active::-webkit-scrollbar-track,
  .box-scroll:focus::-webkit-scrollbar-track,
  .box-scroll:focus-within::-webkit-scrollbar-track {
    background: transparent;
  }
  & .item-list {
    display: flex;
    align-items: center;
    padding: 8px 0 7px;
    position: relative;
    .name-item {
      font-size: 11px;
      margin-bottom: 0;
      color: rgba(0, 0, 0, 0.9);
      display: flex;
      width: 100%;
      justify-content: space-between;
      text-transform: capitalize;
      .member-name {
        padding-right: 4px;
      }
      .company-name {
        color: rgba(0, 0, 0, 0.4);
        font-size: 11px;
        text-transform: capitalize;
      }
      &:after {
        content: "";
        display: block;
        width: 85%;
        height: 1px;
        background-color: rgba(0, 0, 0, 0.08);
        position: absolute;
        bottom: 0;
      }
    }
    &:last-child {
      .name-item::after {
        display: none;
      }
    }
    .avatar-item {
      min-width: 32px;
      width: 32px;
      height: 32px;
      //overflow: hidden;
      border-radius: 100%;
      margin-right: 12px;
      img {
        width: 100%;
      }
      img:hover {
        cursor: pointer;
      }
    }
  }
  .item-list .remove-member {
    display: none;
  }
  .item-list:hover .remove-member {
    display: block;
  }
  .user-img {
    overflow: hidden;
    border-radius: 50%;
  }
  .user-type-badge {
    width: auto !important;
  }
  .companies {
    .name-item {
      text-transform: capitalize;
    }
  }
  & .box-fixed {
    display: flex;
    justify-content: center;
    padding-top: 17px;
    color: #03bd5d;
    border-top: 1px solid;
    border-color: rgba(0, 0, 0, 0.08);
    font-size: 12px;
    cursor: pointer;
    img {
      display: inline-block;
      margin-top: -2px;
    }
    .add-user-button {
      border: none;
      padding: 0 !important;
      margin: 0;
      &:hover {
        background: none;
      }
      > span {
        font-size: 12px;
        color: #03bd5d;
      }
      &.disabled-add {
        cursor: not-allowed;
      }
    }
  }
  & .count-list {
    margin: 0;
    color: #03bd5d;
    font-size: 12px;
    padding-bottom: 11px;
    border-bottom: 1px solid;
    border-color: rgba(0, 0, 0, 0.08);
    & .toggle-company-icon {
      display: none;
    }
    &:hover .toggle-company-icon {
      display: block;
    }
  }
  & .users-list {
    .count-list {
      padding: 11px 0;
      border-top: 1px solid;
      border-bottom: 1px solid;
      border-color: rgba(0, 0, 0, 0.08);
      margin: 0;
    }
  }
`;
export { Main };
