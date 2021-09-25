import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import { Scrollbars } from "react-custom-scrollbars";
import { useQuery } from "@apollo/react-hooks";
import {
  DesktopView,
  MobileView,
  OrderBox,
  OrderListWrapper,
  OrderList,
  OrderDetailsWrapper,
  Title,
  ImageWrapper,
  ItemWrapper,
  ItemDetails,
  ItemName,
  ItemSize,
  ItemPrice,
  NoOrderFound,
} from "./order.style";

import OrderDetails from "./order-details/order-details";
import OrderCard from "./order-card/order-card";
import OrderCardMobile from "./order-card/order-card-mobile";
import useComponentSize from "utils/useComponentSize";
import { FormattedMessage } from "react-intl";

const progressData = [
  "RECEIVED",
  "CONFIRMED",
  "PROCESSING",
  "DELIVERED",
  "CANCELED",
];

const GET_ORDERS = gql`
  query getAllOrders($customer: ID) {
    orders(customer: $customer) {
      id
      customer_id
      coupon_id
      sub_total
      discount_amount
      shipping_charge
      total
      address
      schedule
      details {
        product {
          id
          name
          price
          thumbnail
          unit
        }
        quantity
      }
      payment_method
      payment_status
      transaction_id
      status
      created_at
    }
  }
`;

const orderTableColumns = [
  {
    title: <FormattedMessage id="cartItems" defaultMessage="Items" />,
    dataIndex: "",
    key: "items",
    width: 250,
    ellipsis: true,
    render: (text, record) => {
      return (
        <ItemWrapper>
          <ImageWrapper>
            <img src={record.product.thumbnail} alt={record.title} />
          </ImageWrapper>

          <ItemDetails>
            <ItemName>{record.product.name}</ItemName>
            <ItemPrice>৳{record.product.price}</ItemPrice>
            <ItemPrice>
              {record.quantity} {record.product.unit}
            </ItemPrice>
          </ItemDetails>
        </ItemWrapper>
      );
    },
  },
  {
    title: (
      <FormattedMessage id="intlTableColTitle2" defaultMessage="Quantity" />
    ),
    dataIndex: "quantity",
    key: "quantity",
    align: "center",
    width: 100,
  },
  {
    title: <FormattedMessage id="intlTableColTitle3" defaultMessage="Price" />,
    dataIndex: "",
    key: "product.price",
    align: "right",
    width: 100,
    render: (text, record) => {
      return <p>৳{record.product.price * record.quantity}</p>;
    },
  },
];

type OrderTableProps = {
  deviceType?: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};

const OrdersContent: React.FC<OrderTableProps> = ({
  deviceType: { mobile, tablet, desktop },
}) => {
  const [order, setOrder] = useState(null);
  const [active, setActive] = useState("");

  const [targetRef, size] = useComponentSize();
  const orderListHeight = size.height - 79;
  const { data, error, loading } = useQuery(GET_ORDERS, {
    variables: {
      limit: 7,
      user: 1,
    },
  });

  useEffect(() => {
    if (data && data.orders && data.orders.length !== 0) {
      setOrder(data.orders[0]);
      setActive(data.orders[0].id);
    }
  }, [data && data.orders]);

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) return <div>{error.message}</div>;

  const handleClick = (order) => {
    setOrder(order);
    setActive(order.id);
  };

  return (
    <OrderBox>
      <DesktopView>
        <OrderListWrapper style={{ height: size.height }}>
          <Title style={{ padding: "0 20px" }}>
            <FormattedMessage
              id="intlOrderPageTitle"
              defaultMessage="My Order"
            />
          </Title>

          <Scrollbars
            universal
            autoHide
            autoHeight
            autoHeightMin={420}
            autoHeightMax={isNaN(orderListHeight) ? 500 : orderListHeight}
          >
            <OrderList>
              {data.orders.length !== 0 ? (
                data.orders.map((order: any) => (
                  <OrderCard
                    key={order.id}
                    orderId={order.id}
                    className={order && order.id === active ? "active" : ""}
                    status={order.status}
                    date={order.created_at}
                    // deliveryTime={order.deliveryTime}
                    amount={order.total}
                    onClick={() => {
                      handleClick(order);
                    }}
                  />
                ))
              ) : (
                <NoOrderFound>
                  <FormattedMessage
                    id="intlNoOrderFound"
                    defaultMessage="No order found"
                  />
                </NoOrderFound>
              )}
            </OrderList>
          </Scrollbars>
        </OrderListWrapper>

        <OrderDetailsWrapper ref={targetRef}>
          <Title style={{ padding: "0 20px" }}>
            <FormattedMessage
              id="orderDetailsText"
              defaultMessage="Order Details"
            />
          </Title>
          {order && order.id && (
            <OrderDetails
              progressStatus={order.status}
              progressData={progressData}
              address={order.address}
              schedule={order.schedule}
              subtotal={order.sub_total}
              discount={order.discount_amount}
              deliveryFee={order.shipping_charge}
              grandTotal={order.total}
              tableData={order.details}
              columns={orderTableColumns}
            />
          )}
        </OrderDetailsWrapper>
      </DesktopView>

      <MobileView>
        <OrderList>
          <OrderCardMobile
            orders={data.orders}
            className={order && order.id === active ? "active" : ""}
            progressData={progressData}
            columns={orderTableColumns}
            onClick={() => {
              handleClick(order);
            }}
          />
        </OrderList>
      </MobileView>
    </OrderBox>
  );
};

export default OrdersContent;
