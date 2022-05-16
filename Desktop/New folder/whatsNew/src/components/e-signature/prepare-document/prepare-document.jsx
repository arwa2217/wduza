import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import SignAnnotIconRed from "../../../assets/icons/v2/sign-svg/ic_sign_annot_red.svg";
import SignAnnotIconYellow from "../../../assets/icons/v2/sign-svg/ic_sign_annot_yellow.svg";
import SignAnnotIconGreen from "../../../assets/icons/v2/sign-svg/ic_sign_annot_green.svg";
import SignAnnotIconBlue from "../../../assets/icons/v2/sign-svg/ic_sign_annot_blue.svg";
import SignAnnotIconPurple from "../../../assets/icons/v2/sign-svg/ic_sign_annot_purple.svg";

import StampAnnotIconRed from "../../../assets/icons/v2/stamp-svg/ic_stamp_annot_red.svg";
import StampAnnotIconYellow from "../../../assets/icons/v2/stamp-svg/ic_stamp_annot_yellow.svg";
import StampAnnotIconGreen from "../../../assets/icons/v2/stamp-svg/ic_stamp_annot_green.svg";
import StampAnnotIconBlue from "../../../assets/icons/v2/stamp-svg/ic_stamp_annot_blue.svg";
import StampAnnotIconPurple from "../../../assets/icons/v2/stamp-svg/ic_stamp_annot_purple.svg";

import CheckAnnotIconRed from "../../../assets/icons/v2/check-svg/ic_check_annot_red.svg";
import CheckAnnotIconYellow from "../../../assets/icons/v2/check-svg/ic_check_annot_yellow.svg";
import CheckAnnotIconGreen from "../../../assets/icons/v2/check-svg/ic_check_annot_green.svg";
import CheckAnnotIconBlue from "../../../assets/icons/v2/check-svg/ic_check_annot_blue.svg";
import CheckAnnotIconPurple from "../../../assets/icons/v2/check-svg/ic_check_annot_purple.svg";

import AttachAnnotIconRed from "../../../assets/icons/v2/attach-svg/ic_attach_annot_red.svg";
import AttachAnnotIconYellow from "../../../assets/icons/v2/attach-svg/ic_attach_annot_yellow.svg";
import AttachAnnotIconGreen from "../../../assets/icons/v2/attach-svg/ic_attach_annot_green.svg";
import AttachAnnotIconBlue from "../../../assets/icons/v2/attach-svg/ic_attach_annot_blue.svg";
import AttachAnnotIconPurple from "../../../assets/icons/v2/attach-svg/ic_attach_annot_purple.svg";

import "./prepare-document.css";
import PDFEditor from "./pdf-editor";
import PDFEditorActions from "./pdf-editor-actions";
import SignatureFooter from "../signature-footer/signature-footer";
import {
  saveESignaturePrepareFile,
  setESignRecipientList,
} from "../../../store/actions/esignature-actions";

const esignConstant = {
  TEXT: "Text",
  SIGNATURE: "Signature",
  STAMP: "Stamp",
  CHECK: "Checkbox",
  ATTACH: "Attachment",
};

export default function PrepareDocument(props) {
  const [instance, setInstance] = useState(null);
  const [dropPoint, setDropPoint] = useState(null);
  const dispatch = useDispatch();

  const esignRecipientList = useSelector(
    (state) => state.esignatureReducer.recipientList
  );
  const esignFileInfo = useSelector(
    (state) => state.esignatureReducer.fileInfo
  );
  const viewer = useRef(null);

  const applyFields = async () => {
    const { Annotations, docViewer, openElements, setCustomModal } = instance;
    const annotManager = docViewer.getAnnotationManager();
    const fieldManager = annotManager.getFieldManager();
    const annotationsList = annotManager.getAnnotationsList();
    const annotsToDelete = [];
    const annotsToDraw = [];
    let data = [...esignRecipientList];

    await Promise.all(
      annotationsList.map(async (annot, index) => {
        let inputAnnot;
        let field;
        if (typeof annot.custom !== "undefined") {
          data = data.map((i) => {
            let obj = { ...i };
            if (i.email === annot.custom.email) {
              obj = {
                ...i,
                signatureType: i?.signatureType
                  ? `${i.signatureType},${esignConstant[annot.custom.type]}`
                  : `${esignConstant[annot.custom.type]}`,
              };
            } else obj = i;
            return obj;
          });
          // create a form field based on the type of annotation
          if (annot.custom.type === "TEXT") {
            field = new Annotations.Forms.Field(
              annot.getContents() + Date.now() + index,
              {
                type: "Tx",
                value: annot.custom.value,
              }
            );
            inputAnnot = new Annotations.TextWidgetAnnotation(field);
          } else if (annot.custom.type === "SIGNATURE") {
            field = new Annotations.Forms.Field(
              annot.getContents() + Date.now() + index,
              {
                type: "Sig",
                value: annot.custom.type,
              }
            );
            inputAnnot = new Annotations.SignatureWidgetAnnotation(field, {
              appearance: "_DEFAULT",
              appearances: {
                _DEFAULT: {
                  Normal: {
                    data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuMWMqnEsAAAANSURBVBhXY/j//z8DAAj8Av6IXwbgAAAAAElFTkSuQmCC",
                    offset: {
                      x: annot.getX(),
                      y: annot.getY(),
                    },
                  },
                },
              },
            });
            const createSignHereElement =
              Annotations.SignatureWidgetAnnotation.prototype
                .createSignHereElement;

            Annotations.SignatureWidgetAnnotation.prototype.createSignHereElement =
              function () {
                const signHereElement = createSignHereElement.apply(
                  this,
                  arguments
                );

                signHereElement.style.background = "none";
                signHereElement.innerHTML = "";
                return signHereElement;
              };
          } else if (annot.custom.type === "STAMP") {
            // document.getElementById('myBtn').addEventListener('click', () => {
            field = new Annotations.Forms.Field(
              annot.getContents() + Date.now() + index,
              {
                type: "Btn",
                value: annot.custom.type,
              }
            );
            inputAnnot = new Annotations.PushButtonWidgetAnnotation(field, {
              appearance: "_DEFAULT",
              appearances: {
                _DEFAULT: {
                  Normal: {
                    data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuMWMqnEsAAAANSURBVBhXY/j//z8DAAj8Av6IXwbgAAAAAElFTkSuQmCC",
                    offset: {
                      x: annot.getX(),
                      y: annot.getY(),
                    },
                  },
                },
              },
            });
          } else if (annot.custom.type === "CHECK") {
            field = new Annotations.Forms.Field(
              annot.getContents() + Date.now() + index,
              {
                type: "Btn",
                value: annot.custom.type,
              }
            );
            inputAnnot = new Annotations.CheckButtonWidgetAnnotation(field, {
              appearance: "_DEFAULT",
              appearances: {
                _DEFAULT: {
                  Normal: {
                    data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuMWMqnEsAAAANSURBVBhXY/j//z8DAAj8Av6IXwbgAAAAAElFTkSuQmCC",
                    offset: {
                      x: annot.getX(),
                      y: annot.getY(),
                    },
                  },
                },
              },
            });
          } else if (annot.custom.type === "ATTACH") {
            field = new Annotations.Forms.Field(
              annot.getContents() + Date.now() + index,
              {
                type: "Btn",
                value: annot.custom.type,
              }
            );
            inputAnnot = new Annotations.PushButtonWidgetAnnotation(field, {
              appearance: "_DEFAULT",
              appearances: {
                _DEFAULT: {
                  Normal: {
                    data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuMWMqnEsAAAANSURBVBhXY/j//z8DAAj8Av6IXwbgAAAAAElFTkSuQmCC",
                    offset: {
                      x: annot.getX(),
                      y: annot.getY(),
                    },
                  },
                },
              },
            });
          } else {
            // exit early for other annotations
            annotManager.deleteAnnotation(annot, false, true); // prevent duplicates when importing xfdf
            return;
          }
        } else {
          // exit early for other annotations
          return;
        }

        // set position
        inputAnnot.PageNumber = annot.getPageNumber();
        inputAnnot.X = annot.getX();
        inputAnnot.Y = annot.getY();
        inputAnnot.rotation = annot.Rotation;
        if (annot.Rotation === 0 || annot.Rotation === 180) {
          inputAnnot.Width = annot.getWidth();
          inputAnnot.Height = annot.getHeight();
        } else {
          inputAnnot.Width = annot.getHeight();
          inputAnnot.Height = annot.getWidth();
        }

        // delete original annotation
        annotsToDelete.push(annot);

        // customize styles of the form field
        Annotations.WidgetAnnotation.getCustomStyles = function (widget) {
          if (
            (widget instanceof Annotations.WidgetAnnotation &&
              widget.getField().type === "Sig") ||
            (widget instanceof Annotations.WidgetAnnotation &&
              widget.getField().type === "Btn") ||
            (widget instanceof Annotations.WidgetAnnotation &&
              widget.getField().type === "Ch")
          ) {
            return {
              border: "1px solid #a5c7ff",
              background: `none`,
              backgroundImage: `url("${getImageFromType(
                widget.getField().value
              )}")`,
              backgroundSize: "contain",
            };
          }
          if (widget instanceof Annotations.TextWidgetAnnotation) {
            return {
              border: "2px solid #FA7E1E",
              background: "#FA7E1E",
              color: "#FFFFFF",
            };
          }
        };
        Annotations.WidgetAnnotation.getCustomStyles(inputAnnot);

        // draw the annotation the viewer
        inputAnnot.setCustomData("annotType", annot.custom.type);
        annotManager.addAnnotation(inputAnnot);
        fieldManager.addField(field);
        annotsToDraw.push(inputAnnot);
      })
    );

    // delete old annotations
    annotManager.deleteAnnotations(annotsToDelete, null, true);

    // refresh viewer
    await annotManager.drawAnnotationsFromList(annotsToDraw);

    await uploadForSigning();
    dispatch(setESignRecipientList(data));
    // instance.downloadPdf(true);
  };

  const colorPalette = (color = "#F16354") => {
    switch (color) {
      case "#F16354":
        return "red";
      case "#FFC700":
        return "yellow";
      case "#03BD5D":
        return "green";
      case "#0796FF":
        return "blue";
      case "#CB46EC":
        return "purple";
      default:
        return "red";
    }
  };
  const getImageFromType = (type, color = "#F16354") => {
    let selectedColor = colorPalette(color);
    if (type === "SIGNATURE") {
      switch (selectedColor) {
        case "red":
          return SignAnnotIconRed;
        case "yellow":
          return SignAnnotIconYellow;
        case "green":
          return SignAnnotIconGreen;
        case "blue":
          return SignAnnotIconBlue;
        case "purple":
          return SignAnnotIconPurple;
        default:
          return SignAnnotIconRed;
      }
    } else if (type === "STAMP") {
      switch (selectedColor) {
        case "red":
          return StampAnnotIconRed;
        case "yellow":
          return StampAnnotIconYellow;
        case "green":
          return StampAnnotIconGreen;
        case "blue":
          return StampAnnotIconBlue;
        case "purple":
          return StampAnnotIconPurple;
        default:
          return StampAnnotIconRed;
      }
    } else if (type === "CHECK") {
      switch (selectedColor) {
        case "red":
          return CheckAnnotIconRed;
        case "yellow":
          return CheckAnnotIconYellow;
        case "green":
          return CheckAnnotIconGreen;
        case "blue":
          return CheckAnnotIconBlue;
        case "purple":
          return CheckAnnotIconPurple;
        default:
          return CheckAnnotIconRed;
      }
    } else if (type === "ATTACH") {
      switch (selectedColor) {
        case "red":
          return AttachAnnotIconRed;
        case "yellow":
          return AttachAnnotIconYellow;
        case "green":
          return AttachAnnotIconGreen;
        case "blue":
          return AttachAnnotIconBlue;
        case "purple":
          return AttachAnnotIconPurple;
        default:
          return AttachAnnotIconRed;
      }
    } else {
      return SignAnnotIconRed;
    }
  };

  const addField = (
    type,
    point = {},
    signee
    // signee = { label: "das", value: "abc@gmail.com" }
  ) => {
    const { docViewer, Annotations } = instance;
    const annotManager = docViewer.getAnnotationManager();
    const doc = docViewer.getDocument();
    const displayMode = docViewer.getDisplayModeManager().getDisplayMode();
    const page = displayMode.getSelectedPages(point, point);
    if (!!point.x && page.first == null) {
      return; //don't add field to an invalid page location
    }
    const page_idx =
      page.first !== null ? page.first : docViewer.getCurrentPage();
    const page_info = doc.getPageInfo(page_idx);
    const page_point = displayMode.windowToPage(point, page_idx);
    const zoom = docViewer.getZoom();

    const stampAnnot = new Annotations.StampAnnotation();
    const rotation = docViewer.getCompleteRotation(page_idx) * 90;
    stampAnnot.Rotation = rotation;
    stampAnnot.PageNumber = page_idx;
    stampAnnot.X = (page_point.x || page_info.width / 2) - stampAnnot.Width / 2;
    stampAnnot.Y =
      (page_point.y || page_info.height / 2) - stampAnnot.Height / 2;
    if (rotation === 270 || rotation === 90) {
      stampAnnot.Width = 35.0 / zoom;
      stampAnnot.Height = 35.0 / zoom;
    } else {
      stampAnnot.Width = 35.0 / zoom;
      stampAnnot.Height = 35.0 / zoom;
    }
    stampAnnot.setImageData(getImageFromType(type, signee?.color));
    instance.setAnnotationContentOverlayHandler((annotation) => {
      const div = document.createElement("div");
      div.appendChild(document.createTextNode(`${annotation.custom.name}`));
      div.appendChild(document.createElement("br"));
      div.appendChild(document.createTextNode(`${annotation.custom.email}`));
      return div;
    });
    stampAnnot.custom = {
      type,
      name: `${signee.label}`,
      email: `${signee.value}`,
    };

    // set the type of annot
    stampAnnot.setContents(stampAnnot.custom.email);
    stampAnnot.setCustomData("annotType", type);
    // stampAnnot.setRect(new Annotations.Rect(0, 0, 0, 0));
    // stampAnnot.FillColor = new Annotations.Color(241, 99, 84, 1);
    // stampAnnot.TextAlign = "center";
    stampAnnot.Author = annotManager.getCurrentUser();
    annotManager.addAnnotation(stampAnnot);
    annotManager.redrawAnnotation(stampAnnot);
  };

  const addTextField = (type, point = {}, signee) => {
    const { docViewer, Annotations } = instance;
    const annotManager = docViewer.getAnnotationManager();
    const doc = docViewer.getDocument();
    const displayMode = docViewer.getDisplayModeManager().getDisplayMode();
    const page = displayMode.getSelectedPages(point, point);
    if (!!point.x && page.first == null) {
      return; //don't add field to an invalid page location
    }
    const page_idx =
      page.first !== null ? page.first : docViewer.getCurrentPage();
    const page_info = doc.getPageInfo(page_idx);
    const page_point = displayMode.windowToPage(point, page_idx);
    const zoom = docViewer.getZoom();

    var textAnnot = new Annotations.FreeTextAnnotation();
    textAnnot.PageNumber = page_idx;
    const rotation = docViewer.getCompleteRotation(page_idx) * 90;
    textAnnot.Rotation = rotation;
    if (rotation === 270 || rotation === 90) {
      textAnnot.Width = 50.0 / zoom;
      textAnnot.Height = 250.0 / zoom;
    } else {
      textAnnot.Width = 250.0 / zoom;
      textAnnot.Height = 50.0 / zoom;
    }
    textAnnot.X = (page_point.x || page_info.width / 2) - textAnnot.Width / 2;
    textAnnot.Y = (page_point.y || page_info.height / 2) - textAnnot.Height / 2;

    textAnnot.setPadding(new Annotations.Rect(0, 0, 0, 0));
    textAnnot.custom = {
      type,
      email: `${signee.value}`,
      name: `${signee.label}`,
    };

    // set the type of annot
    textAnnot.setContents(textAnnot.custom.email);
    textAnnot.setCustomData("annotType", type);
    textAnnot.FontSize = "" + 20.0 / zoom + "px";
    textAnnot.FillColor = new Annotations.Color(250,126,30);
    textAnnot.TextColor = new Annotations.Color(255,255,255);
    textAnnot.StrokeThickness = 1;
    textAnnot.StrokeColor = new Annotations.Color(0, 165, 228);
    textAnnot.TextAlign = "center";

    textAnnot.Author = annotManager.getCurrentUser();

    annotManager.deselectAllAnnotations();
    annotManager.addAnnotation(textAnnot, true);
    annotManager.redrawAnnotation(textAnnot);
    annotManager.selectAnnotation(textAnnot);
  };

  const dragOver = (e) => {
    e.preventDefault();
    return false;
  };

  const drop = (e, instance) => {
    const { docViewer } = instance;
    const scrollElement = docViewer.getScrollViewElement();
    const scrollLeft = scrollElement.scrollLeft || 0;
    const scrollTop = scrollElement.scrollTop || 0;
    setDropPoint({ x: e.pageX + scrollLeft, y: e.pageY + scrollTop });
    e.preventDefault();
    return false;
  };

  const uploadForSigning = async () => {
    const { docViewer, annotManager } = instance;
    const doc = docViewer.getDocument();
    const xfdfString = await annotManager.exportAnnotations({
      widgets: true,
      fields: true,
    });
    const data = await doc.getFileData({ xfdfString });
    const arr = new Uint8Array(data);
    const blob = new Blob([arr], { type: "application/pdf" });
    dispatch(saveESignaturePrepareFile(blob));
    props.nextHandler();
  };
  const nextHandler = () => {
    applyFields();
  };
  const backHandler = () => {
    props.backHandler();
  };
  const leaveHandler = () => {
    props.leaveHandler();
  };
  return (
    <>
      <div className="pdftron-container">
        <PDFEditor
          instance={instance}
          setInstance={setInstance}
          viewer={viewer}
          dragOver={dragOver}
          drop={drop}
          fileInfo={esignFileInfo}
        />
        <PDFEditorActions
          addField={addField}
          applyFields={applyFields}
          addTextField={addTextField}
        />
      </div>
      <SignatureFooter
        next={nextHandler}
        back={backHandler}
        leave={leaveHandler}
        currentStep={props.currentStep}
        isOnlySigner={props.isOnlySigner}
      />
    </>
  );
}
