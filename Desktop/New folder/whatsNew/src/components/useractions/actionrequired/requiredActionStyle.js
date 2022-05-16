import styled from "styled-components";

export default styled.div`
  background: #fff;
  min-height: calc(100vh - 40px);
  max-height: calc(100vh - 40px);
  .required_action__header {
    padding: 5px 15px;
    background: White;
  }
  .required_action__dropdown {
    position: relative;
    width: 165px;
  }
  .required_action__dropdown > button {
    width: 100%;
    background: #e0ded2;
    border: none;
    border-radius: 4px;
    padding: 5px 8px;
    outline: none;
  }
  i {
    width: 20px;
  }
  button:focus + ul {
    display: block;
    position: absolute;
    top: 25px;
  }
  .required_action__dropdown > ul {
    width: 100%;
    display: none;
    background: #e0ded2;
    color: gray;
    list-style: none;
    margin: 3px 0;
    padding: 6px 10px;
  }
  .required_action__dropdown li {
    padding: 5px 0;
    pointer-events: none;
  }
  .required_action__dropdown li.active {
    color: black;
    cursor: pointer;
    pointer-events: auto;
  }
  .required_action__actions {
    min-height: calc(100vh - 80px);
    max-height: calc(100vh - 80px);
    padding: 10px;
    overflow-y: auto;
  }
`;
