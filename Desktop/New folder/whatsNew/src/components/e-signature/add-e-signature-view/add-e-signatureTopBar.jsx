import React from "react";
import "../e-signatureTopBar.css";
import { useTranslation } from "react-i18next";

function AddESignatureTopBar() {
   const { t } = useTranslation();
  return (
    <div className="topBar-class m-0">
      <div className="d-flex align-items-center justify-content-between pr-0">
        <div className="add-esign-topbar">
          <div className="header">{t('prepare.documents')}</div>
        </div>
      </div>
    </div>
  );
}

export default AddESignatureTopBar;
