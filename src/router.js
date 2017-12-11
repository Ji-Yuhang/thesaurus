import React from 'react';
import { Router, Route } from 'dva/router';
// import IndexPage from './routes/IndexPage';
// import RepairOrder from './routes/RepairOrder';
import Thesaurus from './routes/Thesaurus';
import SelectStudyWords from './routes/SelectStudyWords';
import Home from './routes/Home';


import { connect } from 'dva';
// import MainLayout from "./components/MainLayout/MainLayout";
//
// import Users from "./routes/Users.js";
// // import ReapirOrderApprove from "./routes/ReapirOrderApprove.js";
// import RepairOrderApproveContainer from './components/RepairOrderApprove/RepairOrderApproveContainer'
// import EngineerContainer from './components/Engineer/EngineerContainer'
//
// import DataModelContainer from './components/DataModel/DataModelContainer'
// import AdvertisementContainer from './components/Advertisement/AdvertisementContainer'
// import OptionTypesContainer from "./components/OptionTypes/OptionTypesContainer";
// import PhoneCategoryContainer from "./components/PhoneCategory/PhoneCategoryContainer";
// import PhoneAccessoriesContainer from "./components/PhoneAccessories/PhoneAccessoriesContainer";
// import PhoneAccessoryGroupContainer from "./components/PhoneAccessories/PhoneAccessoryGroupContainer";
// import PhoneProductsContainer from "./components/PhoneProducts/PhoneProductsContainer";
// import PrivilegesUserRootContainer from "./components/PrivilegesUserRoot/PrivilegesUserRootContainer";
// import ProductOrdersContainer from "./components/ProductOrders/ProductOrdersContainer";
// import Login from "./components/Login";
// import CreateRepairOrderContainer from "./components/CreateRepairOrder/CreateRepairOrderContainer";
// import PaymentContainer from "./components/Payment/PaymentContainer";
// import RepairOrderPaymentContainer from "./components/RepairOrderPayment/RepairOrderPaymentContainer";
// import AlipayPaymentContainer from "./components/AlipayPayment/AlipayPaymentContainer";
// import WxPaymentContainer from "./components/WxPayment/WxPaymentContainer";
// import PhoneRepairPriceContainer from "./components/PhoneRepaiPrice/PhoneRepairPriceContainer";
// import ProductInspectReportContainer from "./components/ProductInspectReport/ProductInspectReportContainer";
// import PhoneMainAndDetailImageContainer from "./components/PhoneMainAndDetailImage/PhoneMainAndDetailImageContainer";
// import CreatePhoneProductContainer from "./components/PhoneProducts/CreatePhoneProductContainer";
// import EditPhoneProductContainer from "./components/EditPhoneProduct/EditPhoneProductContainer";
//
// function Empty({location}){
//   return (
//     <MainLayout location={location}>
//       <h2>请选择左侧子菜单</h2>
//     </MainLayout>
//   )
// }
// var emptyComponent = connect()(Empty)
function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={Home} />
      <Route path="/thesaurus" component={Thesaurus} />

      <Route path="/select" component={SelectStudyWords} />

      
      {/*<Route path="/customer_service" component={emptyComponent} />*/}
      {/*<Route path="/manage" component={emptyComponent} />*/}
      {/*<Route path="/payment" component={emptyComponent} />*/}
      {/*<Route path="/admin" component={emptyComponent} />*/}
      {/*<Route path="/statistic" component={emptyComponent} />*/}
      {/*<Route path="/repair_phonecategory" component={emptyComponent} />*/}

      {/*<Route path="/sign_in" component={Login} />*/}

      {/*<Route path="/repair_orders" component={RepairOrder} />*/}
      {/*<Route path="/engineers" component={EngineerContainer} />*/}
      {/*<Route path="/data_models" component={DataModelContainer} />*/}

      {/*<Route path="/users" component={Users} />*/}
      {/*<Route path="/repair_orders/approve" component={RepairOrderApproveContainer} />*/}
      {/*<Route path="/advertisements" component={AdvertisementContainer} />*/}
      {/*<Route path="/option_types" component={OptionTypesContainer} />*/}
      {/*<Route path="/phone_categories" component={PhoneCategoryContainer} />*/}
      {/*<Route path="/phone_accessories" component={PhoneAccessoriesContainer} />*/}
      {/*<Route path="/phone_accessory_group" component={PhoneAccessoryGroupContainer} />*/}
      {/*<Route path="/phone_products" component={PhoneProductsContainer} />*/}
      {/*<Route path="/privileges_user_root" component={PrivilegesUserRootContainer} />*/}
      {/*<Route path="/product_orders" component={ProductOrdersContainer} />*/}
      {/*<Route path="/product_order_payments" component={PaymentContainer} />*/}
      {/*<Route path="/alipay_payments" component={AlipayPaymentContainer} />*/}
      {/*<Route path="/wx_payments" component={WxPaymentContainer} />*/}
      {/*<Route path="/create_repair_order" component={CreateRepairOrderContainer} />*/}
      {/*<Route path="/payments" component={PaymentContainer} />*/}
      {/*<Route path="/repair_order_payments" component={RepairOrderPaymentContainer} />*/}
      {/*<Route path="/phone_repair_price" component={PhoneRepairPriceContainer} />*/}
      {/*<Route path="/product_inspect_report" component={ProductInspectReportContainer} />*/}
      {/*<Route path="/phone_main_detail_image" component={PhoneMainAndDetailImageContainer} />*/}
      {/*<Route path="/create_phone_product" component={CreatePhoneProductContainer} />*/}
      {/*<Route path="/edit_phone_product" component={EditPhoneProductContainer} />*/}

    </Router>
  );
}

export default RouterConfig;
