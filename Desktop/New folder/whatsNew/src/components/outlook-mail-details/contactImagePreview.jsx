import React from "react";
import ReactDom from "react-dom";
import AvatarEditor from "react-avatar-editor";
import Avatar from "material-ui/Avatar";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Slider from "material-ui/Slider";
import Button from "react-bootstrap/Button";
import UploadImageButton from "../../assets/icons/Upload image.png";
import { withTranslation } from "react-i18next";

class ContactImagePreview extends React.Component {
  constructor(props) {
    super(props);
    this._handleSave = this._handleSave.bind(this);
    this._handleCancel = this._handleCancel.bind(this);
    this._handleFileChange = this._handleFileChange.bind(this);
    this._setEditorRef = this._setEditorRef.bind(this);
    this._handleZoomSlider = this._handleZoomSlider.bind(this);
    this.state = {
      cropperOpen: false,
      img: null,
      zoom: 2,
      croppedImg: props.src,
    };
  }
  _handleZoomSlider(event, value) {
    let state = this.state;
    state.zoom = value;
    this.setState(state);
  }
  _handleImageSelect(e) {
    document.getElementById("hiddenFileInput").click();
  }
  _handleFileChange(e) {
    window.URL = window.URL || window.webkitURL;
    let url = window.URL.createObjectURL(e.target.files[0]);
    ReactDom.findDOMNode(this.refs.in).value = "";
    let state = this.state;
    state.img = url;
    state.cropperOpen = true;
    this.setState(state);
  }
  _handleSave(e) {
    let croppedImg;
    if (this.editor) {
      const canvasScaled = this.editor.getImageScaledToCanvas();
      croppedImg = canvasScaled.toDataURL();
      let state = this.state;
      state.img = null;
      state.cropperOpen = false;
      state.croppedImg = croppedImg;
      this.setState(state);
    }
    this.props.handleChange(croppedImg);
  }
  _handleCancel() {
    let state = this.state;
    state.cropperOpen = false;
    this.setState(state);
  }
  _setEditorRef(editor) {
    this.editor = editor;
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.src !== this.props.src) {
      let state = this.state;
      state.img = null;
      state.cropperOpen = false;
      state.zoom = 2;
      state.croppedImg = this.props.src;
      this.setState(state);
    }
  }

  render() {
    const { t } = this.props;
    return (
      <MuiThemeProvider>
        <div className="profile-image-preview">
          <Avatar
            className="square-profile"
            src={this.state.croppedImg}
            size={140}
            style={{
              borderRadius: "15px!important",
              backgroundColor: "transparent",
            }}
          />
          <input
            ref="in"
            id="hiddenFileInput"
            type="file"
            accept="image/*"
            onChange={this._handleFileChange}
            style={{ display: "none" }}
          />
          <img
            onClick={this._handleImageSelect}
            src={UploadImageButton}
            alt="upload image"
            style={{
              position: "absolute",
              bottom: "15px",
              width: "84px",
              height: "54px",
              cursor: "pointer",
              left: "29px",
            }}
          />
          {this.state.cropperOpen && (
            <div
              className="cropper-wrapper"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(255,255,255,.8)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <div className="edit-image-component">
                <div className="avatar-editor">
                  <AvatarEditor
                    ref={this._setEditorRef}
                    image={this.state.img}
                    width={200}
                    height={200}
                    color={[255, 255, 255, 0.6]} // RGBA
                    scale={this.state.zoom}
                    rotate={0}
                    style={{
                      borderRadius: "15px",
                    }}
                  />
                </div>
                <div className="avatar-control">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Slider
                      min={1}
                      max={10}
                      step={0.1}
                      value={this.state.zoom}
                      onChange={this._handleZoomSlider}
                      style={{ width: 220 }}
                      className="slider-editor"
                    />
                  </div>

                  <div className="button-actions-edit">
                    <Button
                      className="ml-2 btn-sm preview-cancel"
                      onClick={this._handleCancel}
                    >
                      {t("email-contact:cancel")}
                    </Button>
                    <Button className="ml-2 btn-sm" onClick={this._handleSave}>
                      {t("email-contact:save")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </MuiThemeProvider>
    );
  }
}
export default withTranslation()(ContactImagePreview);
