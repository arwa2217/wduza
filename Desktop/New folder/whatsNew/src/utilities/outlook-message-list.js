import { getColorByEmail, getDomainNameByEmail } from "./outlook";

export const getPhotoBatchRequests = (emailPhotos) => {
  const requests = [];
  emailPhotos.map((item, index) => {
    if (!item.isDefault) {
      requests.push({
        id: index,
        method: "GET",
        url: `/users/${item.email}/photo/$value`,
      });
    }
  });
  return {
    requests,
  };
};
export const updatePhotoEmails = (responses, newUniqueEmailPhotos) => {
  responses.map((item) => {
    const { body, id, status } = item;
    const toInt = parseInt(id);
    if (newUniqueEmailPhotos[toInt]) {
      if (status === 200) {
        newUniqueEmailPhotos[toInt].value = body;
      } else {
        newUniqueEmailPhotos[toInt].value = getDefaultImage();
      }
    }
  });
  return newUniqueEmailPhotos;
};
export const getNewEmailsColor = (newUniqueEmailPhotos) => {
  let emailColorInLocalParse =
    JSON.parse(localStorage.getItem("EMAIL_COLOR")) || [];

  const emailColorInLocalParseIsDefault = emailColorInLocalParse
    .filter((item) => item.isDefault)
    .filter((item) => !item?.isNotFound);
  const emailColorInLocalParseIsDefaultMap =
    emailColorInLocalParseIsDefault.map((item) => item.email);
  let newUniqueEmailPhotosNotIsDefault = newUniqueEmailPhotos.filter(
    (item) => !item.isDefault
  );
  const newUniqueEmailPhotosIsDefault = newUniqueEmailPhotos.filter(
    (item) =>
      item.isDefault && !emailColorInLocalParseIsDefaultMap.includes(item.email)
  );
  newUniqueEmailPhotosNotIsDefault = newUniqueEmailPhotosNotIsDefault.map(
    (item) => {
      return {
        ...item,
        value: item.value !== "" ? item.value : getDefaultImage(),
        isDefault: !(item.value !== ""),
        isNotFound: !(item.value !== ""),
      };
    }
  );

  const mergeEmailColor = emailColorInLocalParseIsDefault
    .concat(newUniqueEmailPhotosNotIsDefault)
    .concat(newUniqueEmailPhotosIsDefault);
  return mergeEmailColor.map((item) => {
    const emailItem = getColorByEmail(newUniqueEmailPhotos, item.email);
    return {
      ...item,
      value: item.isDefault ? item.value : emailItem?.value,
    };
  });
};
export const getDefaultImage = () => {
  return "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";
};
const getUniqueEmail = (item, userDomainName, newUniqueEmail) => {
  const uniqueEmailPhotosUpdate = [];
  const uniqueEmailUpdate = [];
  if (
    item &&
    item.emailAddress &&
    item.emailAddress.address &&
    !newUniqueEmail.includes(item.emailAddress.address)
  ) {
    const senderDomain = getDomainNameByEmail(item.emailAddress.address);
    const isDefault = userDomainName !== senderDomain;
    const itemEmailPhoto = {
      email: item.emailAddress.address,
      isDefault,
      value: isDefault ? getDefaultImage() : "",
    };
    uniqueEmailPhotosUpdate.push(itemEmailPhoto);
    uniqueEmailUpdate.push(item?.emailAddress?.address);
    newUniqueEmail.push(item?.emailAddress?.address);
  }
  return { uniqueEmailPhotosUpdate, uniqueEmailUpdate };
};
export const getNewUniqueEmailPhotos = (
  uniqueEmailPhotos,
  uniqueEmail,
  emails,
  userDomainName
) => {
  let newUniqueEmailPhotos = [...uniqueEmailPhotos];
  let newUniqueEmail = [...uniqueEmail];
  emails.map((item) => {
    const { sender, toRecipients } = item;
    const [firstToRecipients = {}] = toRecipients;
    // sender
    const uniqueEmailSender = getUniqueEmail(
      sender,
      userDomainName,
      newUniqueEmail
    );
    newUniqueEmail = newUniqueEmail.concat(uniqueEmailSender.uniqueEmailUpdate);
    newUniqueEmailPhotos = newUniqueEmailPhotos.concat(
      uniqueEmailSender.uniqueEmailPhotosUpdate
    );
    // firstToRecipients
    const uniqueEmailToRecipients = getUniqueEmail(
      firstToRecipients,
      userDomainName,
      newUniqueEmail
    );
    newUniqueEmail = newUniqueEmail.concat(
      uniqueEmailToRecipients.uniqueEmailUpdate
    );
    newUniqueEmailPhotos = newUniqueEmailPhotos.concat(
      uniqueEmailToRecipients.uniqueEmailPhotosUpdate
    );
  });
  return { newUniqueEmailPhotos, newUniqueEmail };
};

export const getNewEmailsByType = (emails, data, type) => {
  let updateItem = {};
  if (type === "flag") {
    updateItem = {
      flag: {
        flagStatus: "flagged",
      },
    };
  } else if (type === "unFlag") {
    updateItem = {
      flag: {
        flagStatus: "notFlagged",
      },
    };
  } else if (type === "read" || type === "unread") {
    updateItem = {
      isRead: type === "read",
    };
  }
  return [...emails].map((item) => {
    return data.includes(item.id)
      ? {
          ...item,
          ...updateItem,
        }
      : item;
  });
};

export const getEmailFlaggedIds = (emails) => {
  return emails
    .filter((email) => email?.flag?.flagStatus === "flagged")
    .map((email) => email.id);
};
