import CategoryForm from "./components/CategoryForm";
import ColorForm from "./components/ColorForm";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import SizeForm from "./components/SizeForm";
import SupplierForm from "./components/SupplierForm";
import UpdateProductForm from "./components/UpdateProductForm";
import OrderForm from "./components/OrderForm";
import ProductSelector from "./components/ProductSelector";
import OrderList from "./components/OrderList";
import OrderUpdateForm from "./components/OrderUpdateForm";

function App() {
  return (
    // <>
    //   <CategoryForm />
    //   <SupplierForm />
    //   {/* <ColorForm />
    //   <SizeForm /> */}
    //   <ProductForm />
    //   <div className="h-[400px]"></div>
    //   <ProductList />
    //   {/* <UpdateProductForm /> */}
    // </>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<ProductForm />}></Route>
        <Route path="/update-product/:productId" element={<UpdateProductForm />} ></Route>
        <Route path="/products" element={<ProductList />} ></Route>
        <Route path="/suppliers" element={<SupplierForm />} ></Route>
        <Route path="/order" element={<OrderForm />} ></Route>
        <Route path="/order-list" element={<OrderList />} ></Route>
        <Route path="/orders/:orderId" element={<OrderUpdateForm /> } ></Route>
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
