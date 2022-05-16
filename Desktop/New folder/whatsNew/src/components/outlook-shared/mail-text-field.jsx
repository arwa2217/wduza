import React from "react";
import Form from "react-bootstrap/Form";
import './mail-text-field.css'
function MailTextField(props) {
  const {
    value,
    name,
    onBlur,
    onChange,
    error,
    title,
    placeholder,
    isRequired,
  } = props;
  return (
    <Form.Group className="mb-3">
      <Form.Label>
        {title}
        {isRequired ? <strong style={{ color: "#03BD5D" }}>*</strong> : null}
      </Form.Label>
      <Form.Control
        type="text"
        placeholder={placeholder}
        autoComplete="off"
        name={name}
        value={value || ""}
        onBlur={onBlur}
        onChange={onChange}
      />
      <Form.Text className="text-muted">{error}</Form.Text>
    </Form.Group>
  );
}
export default MailTextField;
