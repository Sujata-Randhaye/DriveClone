import { Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Dashboard from "./components/Dashboard";
import CreateFolder from "./components/CreateFolder";
import Folders from "./components/Folders";
import UploadImage from "./components/UploadImage";
function App() {
  return (
   
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/create-folder" element={<CreateFolder/>}/>
          <Route path="/view-folders" element={<Folders/>}/>
          <Route path="/upload-image" element={<UploadImage/>}/>
        </Routes>

  );
}

export default App;
