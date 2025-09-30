import Navbar from "../shared/Navbar.jsx";
import Sidebar from "../shared/Sidebar.jsx";
import Viewer from "../viewer/Viewer.jsx";

function Explorer() {
  return (
    <div className="page-container">
      <Navbar minimal />
      <div className="h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-[1fr_380px]">
        <div className="relative">
          <Viewer />
        </div>
        <Sidebar />
      </div>
    </div>
  );
}

export default Explorer;
