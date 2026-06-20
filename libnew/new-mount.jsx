// Renders ONE new-screen phone, scaled, by ?screen= URL param. Transparent background
// so the phone blends into the host page's section.
(function () {
  const params = new URLSearchParams(location.search);
  const screen = params.get("screen") || "activity";
  const scale = parseFloat(params.get("scale") || "0.62");

  const RENDER = {
    activity: () => <ActivityPhone title="Activity"><ActivityScreen filter="all" /></ActivityPhone>,
    comms: () => <CommsPhone title="Comms"><CommsScreen segment="notifications" /></CommsPhone>,
    killmails: () => <KillmailsPhone />,
  };

  const PHONE_W = 380;
  const PHONE_H = 782; // 760 inner + 22 padding

  function mount() {
    const root = document.getElementById("root");
    const make = RENDER[screen];
    if (!make) return;
    root.style.width = PHONE_W * scale + "px";
    root.style.height = PHONE_H * scale + "px";
    const inner = document.createElement("div");
    inner.style.transform = "scale(" + scale + ")";
    inner.style.transformOrigin = "top left";
    inner.style.width = PHONE_W + "px";
    root.appendChild(inner);
    ReactDOM.createRoot(inner).render(make());
    // report height to parent so the iframe can size itself
    requestAnimationFrame(() => {
      const h = PHONE_H * scale;
      parent.postMessage({ type: "cyno-phone-size", screen, height: h, width: PHONE_W * scale }, "*");
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
