import { Outlet } from "react-router-dom";
import { Layout } from "../../Components/Layout/LayoutSideBar.jsx";

 const Administrador = () => {
  return (
    <div className="flex">
      <Layout>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </Layout>
    </div>
  );
};
export default Administrador
