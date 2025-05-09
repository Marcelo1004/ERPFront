import { Outlet } from "react-router-dom";
import { Layout } from "../../Components/Layout/LayoutSideBarCliente.jsx"

 const Cliente = () => {
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

export default Cliente