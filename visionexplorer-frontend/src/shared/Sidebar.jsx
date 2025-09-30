import ChatPanel from "../components/ChatSidebar/ChatPanel.jsx";
import ExportPanel from "../components/ExportTools/ExportPanel.jsx";
import OverlayPanel from "../components/OverlayControls/OverlayPanel.jsx";

function Sidebar() {
  return (
    <aside
      className="p-4 lg:p-5 overflow-y-auto"
      style={{
        borderLeft: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(24,24,27,0.4)",
        backdropFilter: "blur(24px)",
      }}
    >
      <div className="space-y-8">
        <section>
          <OverlayPanel />
        </section>
        <section>
          <ChatPanel />
        </section>
        <section>
          <ExportPanel />
        </section>
      </div>
    </aside>
  );
}

export default Sidebar;
