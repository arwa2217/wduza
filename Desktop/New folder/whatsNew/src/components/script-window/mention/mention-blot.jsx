import Quill from "quill";

const Embed = Quill.import("blots/embed");

class Mention extends Embed {
  static create(data) {
    const node = super.create();
    const commandChar = document.createElement("span");
    commandChar.className = "ql-mention-command-char";
    commandChar.innerHTML = data.commandChar;
    node.appendChild(commandChar);
    node.innerHTML += data.value;
    return Mention.updateData(node, data);
  }

  static updateData(element, data) {
    const domNode = element;
    Object.keys(data).forEach((key) => {
      domNode.dataset[key] = data[key];
    });
    return domNode;
  }

  static value(domNode) {
    return domNode.dataset;
  }
}

Mention.blotName = "mention";
Mention.tagName = "span";
Mention.className = "mention";

Quill.register(Mention);
