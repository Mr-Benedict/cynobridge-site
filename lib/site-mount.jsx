// Shared mount helper for the marketing site.
// Renders a scaled, live PhoneFrame into every <div class="phone-mount" data-screen="..." data-scale="...">.
(function () {
  const META = {
    dashboard: {},
    skills: {},
    wallet: {},
    assets: {},
    planetary: {},
    roster: { title: "Roster", back: true, hideTabs: true },
  };
  const RENDER = {
    dashboard: () => <RefinedDashboard />,
    skills: () => <RefinedSkills />,
    wallet: () => <RefinedWallet />,
    assets: () => <RefinedAssets />,
    planetary: () => <RefinedPlanetary />,
    roster: () => <RefinedRoster />,
  };
  const BASE_W = 402;
  const BASE_H = 782;

  function mountAll() {
    document.querySelectorAll(".phone-mount").forEach((el) => {
      if (el.dataset.mounted) return;
      el.dataset.mounted = "1";
      const screen = el.dataset.screen;
      const def = META[screen];
      if (!def || !RENDER[screen]) return;
      const scale = parseFloat(el.dataset.scale || "1");
      const android = el.dataset.android !== "false";
      el.style.width = BASE_W * scale + "px";
      el.style.height = BASE_H * scale + "px";
      const inner = document.createElement("div");
      inner.style.transform = "scale(" + scale + ")";
      inner.style.transformOrigin = "top left";
      inner.style.width = BASE_W + "px";
      inner.style.height = BASE_H + "px";
      el.appendChild(inner);
      ReactDOM.createRoot(inner).render(
        <PhoneFrame tab={screen} refined android={android} title={def.title} back={def.back} hideTabs={def.hideTabs}>
          {RENDER[screen]()}
        </PhoneFrame>
      );
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountAll);
  } else {
    mountAll();
  }
  window.__mountPhones = mountAll;
})();
