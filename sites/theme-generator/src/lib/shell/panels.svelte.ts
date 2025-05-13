type CurrentPanelObj = {
  mobile: "preview" | "editor" | "generated";
  desktop: "preview" | "generated";
};

/** determines the current active shell panel for both mobile and desktop */
export const panel = $state<CurrentPanelObj>({
  mobile: "editor",
  desktop: "preview",
});
