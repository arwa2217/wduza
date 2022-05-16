import styled from "styled-components";

export const GlobalSearchMenuDiv = styled.div`
  // padding: 0px 10px;
`;

export const GlobalSearchMenuHomeDiv = styled.div`
  width: 100%;
  color: rgba(181, 181, 181, 1);
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 8px 0 8px 20px;
  cursor: pointer;
  border-radius: 8px;
  line-height: 1;

  overflow: hidden;
  &:hover {
    background: var(--black);
    color: var(--white);
  }
  &.active,
  &.active:hover {
    background: var(--primary) !important;
    color: var(--white);
  }
`;

// Global search UI

export const GlobalSearchWrapper = styled.div`
  width: 100%;

  .search-container {
    width: 100%;
    position: relative;
    background: #fff;
    border-radius: 8px;
    .search-input {
      .react-autosuggest__container {
        position: relative;
        padding-left: 30px;
      }

      .react-autosuggest__container > input {
        height: 40px;
        border: none;
        font-size: 14px;
      }
      .react-autosuggest__container > input.form-control::placeholder { 
        color: #999999 !important;
        opacity: 1 !important;
      }

      .react-autosuggest__container--open
        .react-autosuggest__suggestions-container {
        display: block;
        position: absolute;
        top: 36px;
        width: 100%;
        /* border: 1px solid #aaa; */
        background-color: #fff;
        font-size: 14px;
        background: #ffffff;
        box-shadow: 0px 0px 4px rgba(76, 99, 128, 0.3);
        border-radius: 2px;
        z-index: 101;
        overflow-y: auto;
        max-height: 300px;
        word-break: keep-all;
      }
    }
    .icon-search {
      position: absolute;
      z-index: 99;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
    }

    .form-group {
      margin-bottom: 10px;
    }
    .input-group {
      border: 1px solid #666666;
      border-radius: 8px;

      > .form-control {
        height: 40px;
        padding: 7px 35px !important;
        border: none;
        border-radius: 8px;
      }
      .input-group-append {
        border: none;

        .dropdown-toggle {
          // height: 38px;

          &:focus {
            outline: none;
            box-shadow: none;
            // border: none;
          }
        }
      }
    }

    .dropdown {
      position: static;
      top: 0;
      right: 0;
      z-index: 99;

      .dropdown-toggle: {
        background: transparent;
      }
      .dropdown-toggle::after {
        border-top: 8px solid #03bd5d;
        border-right: 7px solid transparent;
        border-left: 7px solid transparent;
        vertical-align: middle;
        border-radius: 3px;
      }
      &.show .dropdown-toggle::after {
        border-bottom: 8px solid #03bd5d;
        border-top: 0;
      }

      .dropdown-divider {
        margin: 20px 0;
      }
    }
    .local-search-dropdown-menu{
      box-shadow: none;
      border-bottom:1px solid #03BD5D !important
    }
    .global-search-dropdown-menu{
      box-shadow: 1px 2px 6px 2px rgba(0, 0, 0, 0.1);
    }
    .dropdown-menu {
      width: 100%;
      border-bottom-color: rgb(3, 189, 93);
      // border: none;
      border-radius: 2px;
      margin-top: 5px;
      padding:0px;
      max-height: 400px;
      overflow: auto;
      inset: 0px auto auto 3px !important;
      .search-content-1 {
        padding:20px 20px 30px 20px;
        .target-content {
          display: flex;
          margin-bottom: 20px;
        }
        .target-radio-btn-container {
          display: flex;
          margin-left: 37px;
        }
        .author-mention-content{
          display: flex;
          height: 100%;
          align-items: center;
        }
        .author-content {
          display: flex;
          height: 100%;
          align-items: center;
          width:100%
          
        }
        .react-datepicker-wrapper{
          width:100%
        }
        .mention-assignee-content {
          display: flex;
          height: 100%;
          align-items: center;
          width:100%
        }
        
        .mention-content {
          display: flex;
          height: 100%;
          align-items: center;
          width:100%
        }
        .assignee-content {
          display: flex;
          height: 100%;
          align-items: center;
          width:100%
        }
        .assignee-suggestions-content {
          width: 100%;
        }
        .mention-suggestions-content {
          margin-left: 15px;
          width: 100%;
        }
        .local-content{
          width:100%
        }
        .global-content{
          width:100%;
        }
      }
      .search-content-2 {
        padding: 20px;
      }
     
      .post-filter {
        display: flex;
    height: 100%;
    align-items: center;
    .col-form-label{
      margin-bottom: 15px;
    }
   
      }
      .btn-outline-secondary{
        margin: 0px 5px 15px 0px;
      }
      .btn-outline-secondary.focus,  .btn-outline-secondary:focus{
        box-shadow: none
      }
      .global-search-scope{
        font-size:12px;
        margin-bottom:10px;
        color:rgba(25, 25, 26, 1);
      }

      .search-btn {
        text-align: right;
        padding: 0px 20px 20px 0px;
      }
      .search-scope {
        font-size: 12px;
        color: #19191a;
      }

      .col-form-label {
        color: #999999;
        font-size: 12px;
        padding-top: 0;
        padding-bottom: 0;
        line-height: 1.5;
        vertical-align: middle;
        height: 20px;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: calc(100% - 15px);
        height: 100%;
        display: flex;  
        align-items: center;
      }
      .target-radio-btn-label{
       margin:0px 20px 0px 0px;
       color:#19191A
      }
      .btn-group-toggle {
        flex-flow: row wrap;
      }
      .btn-group-toggle > label {
        min-width: 68px;
        max-width: 120px;
        max-height: 24px;
        padding: 2px 5px;
        font-size: 12px;
        border-color: #dedede;
        border-radius: 2px;
        color: #666666;
      }
      .btn-group-toggle > label:hover {
        color: #03bd5d;
        border-color: #03bd5d;
        background: transparent;
      }
      .btn-group-toggle > label.active {
        background: #03bd5d;
        border-color: #03bd5d;
        color: #fff;
      }
      .btn-group-toggle > label:focus {
        box-shadow: none;
      }

      .task-state: hover {
        border-color: #2d76ce !important;
        color: #2d76ce !important;
      }
      .active-task-state {
        background-color: #daebff !important;
        color: #2d76ce !important;
        border-color: #2d76ce !important;
      }

      .done-state: hover {
        border-color: #308f65 !important;
        color: #308f65 !important;
      }
      .active-done-state {
        background-color: #e9faf1 !important;
        color: #308f65 !important;
        border-color: #308f65 !important;
      }

      .pending-canceled-state: hover {
        border-color: #ec801c !important;
        color: #ec801c !important;
      }
      .active-pending-canceled-state {
        background-color: #fbf0c9 !important;
        color: #ec801c !important;
        border-color: #ec801c !important;
      }
      input[type="radio"] + label:before {
        content: "";
        display: inline-block;
        width: 20px;
        height: 20px;
        padding: 5px;
        margin-right: 10px;
        /* background-color only for content */
        background-clip: content-box;
        border: 1px solid #dedede;
        background-color: #ffffff;
        border-radius: 50%;
      }

      /* appearance for checked radio button */
      input[type="radio"]:checked + label:before {
        background-color: #18B263;
      }

      .target-radio-btn {
        width: 20px;
        height: 20px;
        position: relative;
      }
      .btn-group-toggle img {
        width: 13px;
        margin-right: 3px;
      }
      .btn-search {
        width: 80px;
        font-size: 12px;
        font-size: 12px;
        height: 30px;
        background: #03bd5d;
        border: 1px solid #03bd5d;
        border-radius: 2px;
        color: white;
        padding: 5px;
}
      }
    }
    .label-text-center {
      text-align: center;
    }
  }
`;

export const GlobalSearchResultWrapper = styled.div`
  margin: 20px 0px 10px 0px;
  max-height: calc(100% - 110px);
  overflow-y: overlay;

  @-moz-document url-prefix() {
    & {
      overflow-y: auto !important;
    }
  }

  .global-search-user {
    display: flex;
    justify-content: center;
    line-height: 22px;
    p {
      font-size: 15px;
      font-weight: 400;
    }
  }

  .global-search-container {
    margin-bottom: 5px;
  }

  .search-container-content {
    padding: 10px 10px;
    background-color: #ffffff;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: transparent;
  }

  &:hover,
  &:active,
  &:focus,
  &:focus-within {
    /* Track */
    ::-webkit-scrollbar-track {
      background: transparent;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: rgba(136, 136, 136, 0.5);
    }
  }
`;
