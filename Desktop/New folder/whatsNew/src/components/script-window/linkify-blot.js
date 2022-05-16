import Quill from "quill";

var Link = Quill.import("formats/link");

class MyLink extends Link {
  static sanitize(url) {
    let value = super.sanitize(url);
    if (value) {
      for (let i = 0; i < MyLink.PROTOCOL_WHITELIST.length; i++)
        if (value.startsWith(MyLink.PROTOCOL_WHITELIST[i])) return value;
      return `https://${value}`;
    }
    return value;
  }
}

MyLink.blotName = "link";
MyLink.tagName = "a";
MyLink.className = "linkify";

Quill.register(MyLink);
