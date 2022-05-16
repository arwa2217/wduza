import React, { PureComponent } from "react";
import "./datapanel.css";
import styled from "styled-components";
import logo from "../../assets/icons/logo.svg";

const DataPanelStyle = styled.div`
  width: 100%;

  .datapanel-heading {
    display: flex;
    align-items: center;

    .notification-icon {
      width: 24px;
      height: 24px;
      margin: 17px 10px 0px 0px !important;
      > .badge {
        width: 8px;
        height: 8px;
        border-radius: 100%;
        position: absolute;
        top: 4px;
        right: 0;
      }
    }

    .show > .notification-icon {
      background: ${(props) => props.theme.colors.primary};
      > .badge {
        opacity: 0;
      }
    }
    > span {
      width: calc(100% - 30px);
      display: inline-block;
    }
    i {
      width: 30px;
      margin: 0;
      text-align: right;
    }
    */ .dropdown-menu {
      width: 100%;
      max-width: 400px;
      position: fixed !important;
      transform: translate(216px, 60px) !important;
      padding: 0;
      border: 0;
      box-shadow: 0px 6px 5px rgba(0, 0, 0, 0.24),
        0px 9px 18px rgba(0, 0, 0, 0.18);
    }
  }
`;

class DataPanel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ownerCompany: "Samsung Co.",
      subCompanies: [
        {
          name: "Monoly",
          id: "123",
        },
        {
          name: "Hyundai",
          id: "456",
        },
      ],
    };
  }

  allCompanyNames() {
    /*Parse list of companies here*/
    const companyList = this.state.subCompanies.map((company, index) => ({
      key: company.id,
      text: company.name,
      disabled: true,
    }));

    return companyList;
  }
  state = {
    isActive: false,
    isUnread: false,
  };

  notificationShow = () => {
    this.setState({
      isActive: !this.state.isActive,
    });
  };

  render() {
    return (
      <div className="datapanel-container">
        <DataPanelStyle>
          <div className="datapanel-heading">
            <span>
              <img className="brand" src={logo} alt="" />
            </span>
            {/* <Notifications/> */}
          </div>
        </DataPanelStyle>
      </div>
    );
  }
}

export default DataPanel;
