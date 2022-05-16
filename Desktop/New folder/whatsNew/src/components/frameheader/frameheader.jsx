import React from "react";
import styled from "styled-components";
import SearchIcon from "../../assets/icons/search-icon.svg";

const Header = styled.div`
  background: #111111;
  width: 310px;
  height: 28px;
  align-items: center;

  float: right;
  background: #111111;

  border-radius: 4px;
  border: solid 1px #666666;

  margin-right: 10px;
  margin-top: 9px;
  margin-bottom: 9px;
`;

const SearchImg = styled.img`
  background: #111111;
  float: right;
  margin-right: 10px;
  margin-top: 4px;
  margin-bottom: 2px;
`;

function FrameHeader(props) {
  return (
    <Header>
      <SearchImg src={SearchIcon} />
      {/*
      <InputGroup disabled>
        <FormControl id="search" placeholder="Search" className="disabled" disabled />
        <InputGroup.Append>
          <InputGroup.Text>
            <img src={SearchIcon} />
          </InputGroup.Text>
        </InputGroup.Append>
      </InputGroup>
      */}
    </Header>
  );
}

export default FrameHeader;
