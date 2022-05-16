import React  from "react";
import JoditEditor from "jodit-react";
import Jodit from "jodit";
import "./jodit.css";
import ToolbarIcons from "./mention/editor_icon";

const buttons = [
  { name: "bold", icon: ToolbarIcons.BOLD },
  { name: "italic", icon: ToolbarIcons.ITALICS },
  { name: "underline", icon: ToolbarIcons.UNDERLINED },
  { name: "strikethrough", icon: ToolbarIcons.STRIKE_THROUGH },
  { name: "brush", icon: ToolbarIcons.COLOR },
  { name: "align", icon: ToolbarIcons.ALIGN },
  { name: "ul", icon: ToolbarIcons.LIST },
  { name: "ol", icon: ToolbarIcons.NUMBER_LIST },
  "|",
  { name: "link", icon: ToolbarIcons.LINK },
  {
    name: "source",
    icon: ToolbarIcons.CODE_BLOCK,
  },
];
const Editor = (props) => {
  const { editor } = props;
  return (
    <JoditEditor
      ref={editor}
      value={props.state}
      config={{
        readonly: false,
        showPlaceholder: false,
        toolbarButtonSize: "middle",
        height: props.isWriteEmail ? "100%" : "200px",
        buttons: buttons,
        buttonsMD: buttons,
        buttonsXS: buttons,
        buttonsSM: buttons,
        controls: {
          source: {
            name: "source",
            tooltip: "Insert Code Block",
            exec: function (editor) {
              editor.execCommand("formatBlock", false, "code");
            },
            isActive: (editor, control) => {
              const current = editor.s.current();
              return Boolean(
                current &&
                  Jodit?.modules?.Dom.closest(current, "code", editor.editor)
              );
            },
          },
        },
        /*events: {
          processPaste: function (event, html) {
            jodit_editor.selection.insertHTML(html);
            jodit_editor.tempContent = jodit_editor.getEditorValue();
          },
          afterPaste: function (event) {
            let el = $("<div></div>");
            el.html(
              jodit_editor.tempContent
                ? jodit_editor.tempContent
                : jodit_editor.getEditorValue()
            );
            jodit_editor.setEditorValue(el.html());
            jodit_editor.tempContent = null;
          },
        },*/
        askBeforePasteFromWord: false,
        askBeforePasteHTML: false,
        cleanHTML: {
           fillEmptyParagraph: false
        }
      }}
      tabIndex={1}
      //onBlur={(newContent) => props.setState(newContent)}
    />
  );
};

export default React.memo(Editor);
