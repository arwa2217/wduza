import React from "react";
import { Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";


function PdftronSideView() {
  const { t } = useTranslation();
  return (
    <Container>
      <Col className="pl-0">{t('page.view')}</Col>
    </Container>
  );
}

export default PdftronSideView;
