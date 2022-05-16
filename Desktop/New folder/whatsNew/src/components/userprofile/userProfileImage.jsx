import React from "react";
import ReactDom from "react-dom";
import AvatarEditor from "react-avatar-editor";
import Avatar from "material-ui/Avatar";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Slider from "material-ui/Slider";
import Button from "react-bootstrap/Button";
import Camera from "../../assets/icons/camera.svg";
import UserType from "../../constants/user/user-type";

class Userprofileimage extends React.Component {
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
    return (
      <MuiThemeProvider>
        <div className="profile-image-preview">
          <Avatar
            className="square-profile"
            src={this.state.croppedImg}
            size={140}
          />
          <Button
            variant="primary"
            onClick={
              this.props.currentUser.userType === UserType.GUEST
                ? null
                : this._handleImageSelect
            }
          >
            <input
              ref="in"
              id="hiddenFileInput"
              type="file"
              accept="image/*"
              onChange={this._handleFileChange}
              style={{ display: "none" }}
            />
            <img src={Camera} alt="Upload" />
          </Button>
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
              }}
            >
              <AvatarEditor
                ref={this._setEditorRef}
                image={this.state.img}
                width={120}
                height={120}
                border={50}
                color={[255, 255, 255, 0.6]} // RGBA
                scale={this.state.zoom}
                rotate={0}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <label
                  style={{
                    fontSize: 12,
                    marginRight: 10,
                    paddingBottom: 22,
                    fontWeight: 500,
                  }}
                >
                  Zoom
                </label>
                <Slider
                  min={1}
                  max={10}
                  step={0.1}
                  value={this.state.zoom}
                  onChange={this._handleZoomSlider}
                  style={{ width: 200 }}
                />
              </div>
              <div>
                <RaisedButton
                  label="CANCEL"
                  labelPosition="before"
                  containerElement="label"
                  onClick={this._handleCancel}
                />
                <RaisedButton
                  label="SAVE"
                  labelPosition="before"
                  containerElement="label"
                  onClick={this._handleSave}
                />
              </div>
            </div>
          )}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Userprofileimage;
