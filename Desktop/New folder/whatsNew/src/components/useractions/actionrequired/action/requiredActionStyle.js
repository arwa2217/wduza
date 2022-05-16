import React from "react";
import styled from "styled-components";
import device from "../../../../utilities/device";

export default styled.div`
  border-radius: 10px;
  padding: 10px 10px;
  background: white;
  margin: 20px 5px 0 5px;
  box-shadow: 0px 1px 5px lightgrey;
  .action_headline {
    margin: 0;
  }
  .card_details {
    display: flex;
    flex-direction: column;
    :first-child {
      margin-top: 0px;
    }
    .action_schema {
      width: 40px;
      > span {
        width: 30px;
        text-align: center;
        display: inline-block;
        background: yellow;
        font-size: 0.7rem;
        margin-right: 10px;
      }
    }
    .action_content {
      width: calc(100% - 40px);
      .action_question {
        background: #f7f3f3;
        padding: 2px;
      }
    }
    > div {
      width: 300px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      align-self: flex-end;
      flex-grow: 100;
    }
    .actions > button {
      margin-right: 5px;
      border: none;
      padding: 3px 10px;
      border-radius: 5px;
      font-size: 0.8rem;
      height: fit-content;
      font-weight: 400;
    }
    @media ${device.laptop} {
      flex-direction: row;
    }
    .gray-button {
      background: lightgray;
      &.inactive {
        pointer-events: none;
      }
    }
  }

  .grid-container {
    display: grid;
    grid-gap: 10px;
    background-color: #2196f3;
    padding: 10px;
  }

  .action_files_list {
    margin: 0;
    list-style: none;
    padding: 0;
    width: 100px;
    li {
      display: grid;
      .files_list_icon {
        grid-column: 1;
        grid-row: 1 / span 2;
        align-self: center;
      }
      .files_list_name {
        grid-column: 2;
        grid-row: 1;
      }
      .files_list_detail {
        grid-column: 2;
        grid-row: 2;
      }
    }
  }
`;
