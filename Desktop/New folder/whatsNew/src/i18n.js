import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import moment from "moment";
import { getContentLanguage } from "./utilities/app-preference";
import features from "features";
i18n
  .use(Backend)
  .use(initReactI18next)
  //.use(LanguageDetector)
  .init({
    lng: getContentLanguage(),
    backend: {
      /* translation file path */
      loadPath: "/assets/i18n/languages/{{lng}}/{{ns}}.json",
      requestOptions: {
        cache: "no-store",
        credentials: "same-origin",
        mode: "cors",
      },
    },
    fallbackLng: "en",
    debug: !features.disable_i18njs_logs,
    /* add other language namespace as required*/
    ns: ["lng"],
    defaultNS: "lng",
    keySeparator: ":",
    interpolation: {
      escapeValue: false,
      formatSeparator: ",",
      format: function (value, format, lng) {
        if (format === "intlTime-12") {
          let options = {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          };
          //console.log("format intlTime-12");
          return new Intl.DateTimeFormat("en-US", options).format(value);
        } else if (format === "intlTime") {
          let options = {
            hour: "numeric",
            minute: "numeric",
            timeZone: lng,
            hour12: false,
            timeZoneName: "short",
          };
          return new Intl.DateTimeFormat(lng, options).format(value);
        } else if (format === "intlDate") {
          return new Intl.DateTimeFormat().format(value); // -> "12/20/2012" if run in en-US locale with time zone America/Los_Angeles
        } else if (format === "timelineDateFormat") {
          return moment(value).format("ddd, MMM D, YYYY"); // -> "SUN, Dec 5,2020"
        } else if (format === "guestFileShareDateFormat") {
          return moment(value).format("MMM D, YYYY"); // -> "MAY 05, 2021"
        } else if (format === "fileDateFormat") {
          return moment(value).format("ddd, MMM D"); // -> "SUN, Dec 5"
        } else if (format === "messageDateFormat") {
          return moment(value).format("MMM DD, hh:mm A"); // -> "Dec 5, 11:45 AM/PM"
          //return moment(value).format("ddd, MMM D, hh:mmA"); // -> "SUN, Dec 5, 11:45AM/PM"
        } else if (format === "taskDateFormat") {
          return moment(value).format("MM/DD [at] hh:mm a"); // -> "SUN, Dec 5, 11:45 am/pm"
        } else if (format === "messageTimeFormat") {
          return moment(value).format("hh:mm a"); // -> "11:45 pm"
        } else if (format === "DiscussionNotifDateFormat") {
          return moment(value).format("MMM DD, hh:mm A"); // -> "Dec 5, 11:45 AM/PM"
        } else if (format === "DiscussionTimeDateFormat") {
          return moment(value).format("MMM DD, YYYY"); // -> "December 5, 2022"
        } else if (format === "esignTimeFormat") {
          return moment(value).format("hh:mm A"); // -> "11:45 PM"
        } else {
          return value;
        }
      },
    },
    react: {
      bindI18n: "languageChanged",
      bindI18nStore: "",
      transEmptyNodeValue: "",
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ["br", "strong", "i", "span", "p"],
      useSuspense: true,
    },
  });

export default i18n;
