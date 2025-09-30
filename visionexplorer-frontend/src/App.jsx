import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { ViewerProvider } from "./context/ViewerContext.jsx";
import Explorer from "./pages/Explorer.jsx";
import Landing from "./pages/Landing.jsx";

function App() {
  return (
    <ViewerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<Explorer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ViewerProvider>
  );
}

export default App;
