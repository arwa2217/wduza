function insertData(element, data, dataAttributes,channelId) {
    const mention = element;
    Object.keys(data).forEach(key => {
      if (dataAttributes.indexOf(key) > -1) {
        if(key === "screenName"){
          mention.dataset['value'] = data[key];
        }else{
        mention.dataset[key] = data[key];
        }
      } else {
        delete mention.dataset[key];
      }
    });
    mention.dataset["channelId"] = `${channelId}`;
    return mention;
  }
  
  function getCommandCharIndex(text, mentionCommandChars) {
    return mentionCommandChars.reduce(
      (prev, mentionChar) => {
        const mentionCharIndex = text.lastIndexOf(mentionChar);
  
        if (mentionCharIndex > prev.mentionCharIndex) {
          return {
            mentionChar,
            mentionCharIndex
          };
        }
        return {
          mentionChar: prev.mentionChar,
          mentionCharIndex: prev.mentionCharIndex
        };
      },
      { mentionChar: null, mentionCharIndex: -1 }
    );
  }
  
  function isCharsValid(text, allowedChars) {
    return allowedChars.test(text);
  }
  
  function checkCommandCharIndexValidity(mentionCharIndex, text, isolateChar) {
    if (mentionCharIndex > -1) {
      if (
        isolateChar &&
        !(mentionCharIndex === 0 || !!text[mentionCharIndex - 1].match(/\s/g))
      ) {
        return false;
      }
      return true;
    }
    return false;
  }
  
  export {
    insertData,
    getCommandCharIndex,
    isCharsValid,
    checkCommandCharIndexValidity
  };