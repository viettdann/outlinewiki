import { SunIcon, MoonIcon, BrowserIcon, PaletteIcon } from "outline-icons";
import stores from "~/stores";
import { Theme } from "~/stores/UiStore";
import { createAction } from "~/actions";
import { SettingsSection } from "~/actions/sections";

export const changeToDarkTheme = createAction({
  name: ({ t }) => t("Dark"),
  analyticsName: "Change to dark theme",
  icon: <MoonIcon />,
  iconInContextMenu: false,
  keywords: "theme dark night",
  section: SettingsSection,
  selected: () => stores.ui.theme === "dark",
  perform: () => stores.ui.setTheme(Theme.Dark),
});

export const changeToLightTheme = createAction({
  name: ({ t }) => t("Light"),
  analyticsName: "Change to light theme",
  icon: <SunIcon />,
  iconInContextMenu: false,
  keywords: "theme light day",
  section: SettingsSection,
  selected: () => stores.ui.theme === "light",
  perform: () => stores.ui.setTheme(Theme.Light),
});

export const changeToSystemTheme = createAction({
  name: ({ t }) => t("System"),
  analyticsName: "Change to system theme",
  icon: <BrowserIcon />,
  iconInContextMenu: false,
  keywords: "theme system default",
  section: SettingsSection,
  selected: () => stores.ui.theme === "system",
  perform: () => stores.ui.setTheme(Theme.System),
});

export const changeToRosePineTheme = createAction({
  name: () => "Rosé Pine",
  analyticsName: "Change to rose pine theme",
  icon: <PaletteIcon />,
  iconInContextMenu: false,
  keywords: "theme rose pine rosepine purple",
  section: SettingsSection,
  selected: () => stores.ui.theme === "rosepine",
  perform: () => stores.ui.setTheme(Theme.RosePine),
});

export const changeTheme = createAction({
  name: ({ t, isContextMenu }) =>
    isContextMenu ? t("Appearance") : t("Change theme"),
  analyticsName: "Change theme",
  placeholder: ({ t }) => t("Change theme to"),
  icon: function _Icon() {
    return stores.ui.resolvedTheme === "light" ? <SunIcon /> : <MoonIcon />;
  },
  keywords: "appearance display",
  section: SettingsSection,
  children: [
    changeToLightTheme,
    changeToDarkTheme,
    changeToRosePineTheme,
    changeToSystemTheme,
  ],
});

export const rootSettingsActions = [changeTheme];
