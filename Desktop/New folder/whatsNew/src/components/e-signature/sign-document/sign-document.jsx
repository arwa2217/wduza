import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CheckAnnotIcon from "../../../assets/icons/v2/ic_check_annot.svg";
import StampAnnotIcon from "../../../assets/icons/v2/ic_stamp_annot.svg";
import AttachAnnotIcon from "../../../assets/icons/v2/ic_attach_annot.svg";
import SignAnnotIcon from "../../../assets/icons/v2/ic_sign_annot.svg";
import PDFEditor from "../prepare-document/pdf-editor";
import ESignatureServices from "../../../services/esignature-services";
import { setActiveFileMenuItem } from "../../../store/actions/config-actions";
import { showToast } from "../../../store/actions/toast-modal-actions";
import { ESIGNATURE_MENU_ITEMS } from "../../../constants/esignature-menu-items";
import "../prepare-document/prepare-document.css";
import { Redirect, useHistory } from "react-router-dom";
import EmployeementESignatureModal from "../../modal/e-signature-modal/employeement-esignature-modal";
import { MENU_ITEMS } from "../../../constants/menu-items";
import { setAnnotations } from "../../../store/actions/esignature-actions";
let isValidationTrue = true;
export default function SignDocument(props) {
  const history = useHistory();
  const [instance, setInstance] = useState(null);
  const dispatch = useDispatch();
  const [isAttachment, setIsAttachment] = useState(false);
  const [annotManager, setAnnotatManager] = useState(null);
  const [annotPosition, setAnnotPosition] = useState(0);
  const [selectedFileAnnot, setSelectedFileAnnot] = useState(null);
  const [selectedStampAnnot, setSelectedStampAnnot] = useState(null);
  const selectedFileAnnotRef = useRef(selectedFileAnnot);
  selectedFileAnnotRef.current = selectedFileAnnot;

  const selectedStampAnnotRef = useRef(selectedStampAnnot);
  selectedStampAnnotRef.current = selectedStampAnnot;

  let currentUser = useSelector((state) => state.AuthReducer.user);
  const [dropPoint, setDropPoint] = useState(null);
  let recipientFileInfo = useSelector(
    (state) => state.esignatureReducer.recipientFileInfo
  );

  const esignRecipientList = useSelector(
    (state) => state.esignatureReducer.recipientList
  );

  const esignFileInfo = useSelector(
    (state) => state.esignatureReducer.fileInfo
  );
  const viewer = useRef(null);

  useEffect(() => {}, []);
  const openAttachment = () => {
    setIsAttachment(true);
  };
  const closeAttachment = () => {
    setIsAttachment(false);
  };
  useEffect(() => {
    if (instance) {
      const { docViewer, annotManager, Annotations, openElements } = instance;
      setAnnotatManager(annotManager);
      const annotationsList = annotManager.getAnnotationsList();
      const normalStyles = (widget) => {
        dispatch(setAnnotations(widget.Hh.annotType));
        if (widget instanceof Annotations.TextWidgetAnnotation) {
          return {
            border: "1px solid #a5c7ff",
            background: "#cacaca",
            fontSize: "16px",
          };
        } else if (widget instanceof Annotations.WidgetAnnotation) {
          return {
            border: "1px solid #a5c7ff",
            background: "none",
            backgroundImage:
              ( widget.Hh.annotType != "SIGNATURE" && widget.Hh.annotType != "CHECK") &&
              `url("${getImageFromType(widget.Hh.annotType)}")`,
            backgroundSize: "contain",
          };
        }
      };
      annotManager.addEventListener(
        "annotationChanged",
        (annotations, action, { imported }) => {
          if (imported && action === "add") {
            annotations.forEach(function (annot) {
              if (annot instanceof Annotations.WidgetAnnotation) {
                Annotations.WidgetAnnotation.getCustomStyles = normalStyles;
                if (
                  !annot.fieldName
                    .toString()
                    .toLowerCase()
                    .startsWith(
                      currentUser.email
                        ? currentUser.email.toString().toLowerCase()
                        : esignFileInfo?.email?.toString().toLowerCase()
                    )
                ) {
                  annot.Hidden = true;
                  annot.Listable = false;
                }
              }
            });

            setTimeout(() => {
              annotations.forEach((annotation) => {
                if (
                  annotation instanceof Annotations.WidgetAnnotation &&
                  annotation.getField().value === "STAMP" &&
                  annotation.innerElement !== null
                ) {
                  annotation.innerElement.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedStampAnnot(annotation);
                    openElements(["customStampModal"]);
                  });
                }
                if (
                  annotation instanceof Annotations.WidgetAnnotation &&
                  annotation.getField().value === "ATTACH" &&
                  annotation.innerElement !== null
                ) {
                  annotation.innerElement.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedFileAnnot(annotation);
                    openAttachment();
                  });
                }
              });
            }, 5000);
          } else if (action === "delete" && imported === undefined) {
            annotations.forEach((annotation) => {
              if (
                selectedStampAnnotRef.current != null &&
                annotation instanceof Annotations.StampAnnotation
              ) {
                selectedStampAnnotRef.current.readOnly = false;
                const annotList = annotManager.getAnnotationsList();
                annotList.push(selectedStampAnnotRef.current);
                selectedStampAnnotRef.current = null;
                setSelectedStampAnnot(null);
                annotManager.drawAnnotationsFromList(annotList);
              }
              else if (
                selectedFileAnnotRef.current != null &&
                annotation instanceof Annotations.FileAttachmentAnnotation
              ) {
                selectedFileAnnotRef.current.readOnly = false;
                const annotList = annotManager.getAnnotationsList();
                annotList.push(selectedFileAnnotRef.current);
                selectedFileAnnotRef.current = null;
                setSelectedFileAnnot(null);
                annotManager.drawAnnotationsFromList(annotList);
              }
            });
          } else if (action === "add") {
            
            //Stop the dragging of signature/stop outiside the placeholder
            annotManager.getAnnotationsList().forEach((annot) => {
              isValidationTrue = false;
              if (
                annot instanceof Annotations.WidgetAnnotation &&
                annot.annot
              ) {
                annot.annot.NoMove = true;
              }

              if (
                selectedStampAnnotRef.current != null &&
                annot instanceof Annotations.StampAnnotation && annot.NoMove === false
              ) {
                annot.X = selectedStampAnnotRef.current.X;
                annot.Y = selectedStampAnnotRef.current.Y;
                annot.Width = selectedStampAnnotRef.current.Width;
                annot.Height = selectedStampAnnotRef.current.Height;
                annot.NoMove = true;
                annot.readOnly = true;
                annot.PageNumber = selectedStampAnnotRef.current.PageNumber;
                annot.Author = annotManager.getCurrentUser();
                selectedStampAnnotRef.current.deletingAnnot = true;
                annotManager.redrawAnnotation(annot);
                annotManager.deleteAnnotations(
                  [selectedStampAnnotRef.current],
                  null,
                  true
                );
              }
            });
          }
          annotManager.addEventListener("fieldChanged", (field, value) => {
            const fieldAnnot = field.widgets[0];
            if (value) {
              isValidationTrue = false;
            } else {
              //remove text/date field from completed array
            }
          });
        }
      );
      props.signRef.current = (finishLater) => completeSigning(finishLater);
    }
  }, [instance, props]);

  const getImageFromType = (type) => {
    if (type === "SIGNATURE") {
      return SignAnnotIcon;
    } else if (type === "STAMP") {
      return StampAnnotIcon;
    } else if (type === "CHECK") {
      return CheckAnnotIcon;
    } else if (type === "ATTACH") {
      return AttachAnnotIcon;
    } else {
      return SignAnnotIcon;
    }
  };
  useEffect(() => {
    if (instance) {
      const el = document.getElementsByTagName("iframe")[0];
      if (el) {
        if (props.isReadOnly) {
          el.style.pointerEvents = "none";
          el.addEventListener("mouseover", function () {
            el.style.pointerEvents = "none";
          });
        } else {
          el.addEventListener("mouseover", function () {
            el.style.pointerEvents = "auto";
          });
          el.style.pointerEvents = "auto";
        }
      }
    }
  }, [instance, props.isReadOnly]);

  const dragOver = (e) => {
    e.preventDefault();
    return false;
  };
  const onFileUploadClick = async (fileData) => {
    const { Annotations, docViewer, documentViewer } = instance;
    const annotManager = docViewer.getAnnotationManager();
    const fileAttachmentAnnot = new Annotations.FileAttachmentAnnotation();
    fileAttachmentAnnot.PageNumber = selectedFileAnnot.getPageNumber();
    fileAttachmentAnnot.X = selectedFileAnnot.getX();
    fileAttachmentAnnot.Y = selectedFileAnnot.getY();
    fileAttachmentAnnot.readOnly = true;
    fileAttachmentAnnot.NoMove = true;
    selectedFileAnnotRef.current.deletingAnnot = true;
    fileAttachmentAnnot.Author = annotManager.getCurrentUser();
    const { data, mimeType, filename } = await getFileData(fileData);
    await fileAttachmentAnnot.setFileData(data, mimeType, filename);
    annotManager.addAnnotation(fileAttachmentAnnot);
    annotManager.deleteAnnotations([selectedFileAnnot], null, true);
    annotManager.redrawAnnotation(fileAttachmentAnnot);
  };
  const getFileData = async (fileData) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", (e) => {
        const data = e.target.result;
        resolve({
          data,
          mimeType: fileData.type,
          filename: fileData.name,
        });
      });
      reader.readAsArrayBuffer(fileData);
    });
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

  const markReadOnlyAnnotation = async () => {
    const { annotManager, Annotations } = instance;
    annotManager.getAnnotationsList().forEach((annot) => {
      if (
        annot.annot &&
        annot.fieldName.startsWith(
          currentUser.email ? currentUser.email : esignFileInfo?.email
        )
      ) {
        annot.annot.NoMove = true;
        annot.annot.readOnly = true;
      }
    });
  };
  const jumpToMissingField = () => {
    instance.UI.showErrorMessage(
      "You must fill all required fields before submitting."
    );
    setTimeout(() => {
      instance.closeElements(["errorModal"]);
    }, 2000);
  };

  const completeSigning = async (finishLater) => {
    let isFinishLater = typeof finishLater === "boolean" ? finishLater : false;
    if (isValidationTrue && !isFinishLater) {
      jumpToMissingField();
    } else {
      await markReadOnlyAnnotation();
      const { annotManager } = instance;
      const xfdf = await annotManager?.exportAnnotations({
        widgets: false,
        links: false,
      });

      let postObj = {
        signed: true,
        xfdf: `${xfdf}`,
        signTimezone: "Asia/Kolkata",
      };
      if (isFinishLater) {
        postObj.isFinishLater = true;
      } else {
        postObj.isFinished = false;
      }
      let res = await ESignatureServices.updateRecipients(
        esignFileInfo.fileId,
        postObj
      );
      if (res.code != 2001) {
        dispatch(
          showToast(
            "Something went wrong, please contact admin",
            3000,
            "failure"
          )
        );
        history.goBack();
      } else props.handleFinish(true);
      dispatch(
        setActiveFileMenuItem({
          folderName: "Inbox",
          fileKey: ESIGNATURE_MENU_ITEMS.ESIGNATURE_INBOX,
        })
      );
    }
  };

  return (
    <>
      {esignFileInfo ? (
        <div className="pdftron-container">
          <PDFEditor
            instance={instance}
            setInstance={setInstance}
            viewer={viewer}
            dragOver={dragOver}
            drop={drop}
            fileInfo={esignFileInfo}
          />
          {isAttachment && (
            <EmployeementESignatureModal
              onModalHide={closeAttachment}
              onFileUploadClick={onFileUploadClick}
            />
          )}
        </div>
      ) : (
        <Redirect to={MENU_ITEMS.E_SIGNATURE} />
      )}
    </>
  );
}
