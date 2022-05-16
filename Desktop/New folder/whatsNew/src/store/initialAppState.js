import { MENU_ITEMS } from "../constants/menu-items";
import { SETTINGS_MENU_ITEMS } from "../constants/settings-menu-items";

export default {
  config: {
    activeActionPanel: "home",
    summaryPanelActive: true,
    summaryPanelActiveIndex: 0,
    buildVersion: null,
    isUserTyping: false,
    activeMenuItem: MENU_ITEMS.COLLECTIONS,
    activeSelectedFile: {},
    activeSelectedFileId: null,
    filePanelActive: false,
    activeSettingMenuItem: { settingKey: SETTINGS_MENU_ITEMS.ACCOUNT },
    adminSelectedRow: null,
    adminSidebarPanelState: false,
    adminSidebarActiveIndex: 1,
  },
  ModalReducer: { modalType: null, modalProps: {} },
};
