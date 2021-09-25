import React from "react";
import { Box, SelectedItem, MenuItem } from "./store-switcher.style";
import Popover from "components/popover/popover";
import { useStore } from "contexts/store/store.provider";

const STORES = [
  { id: 0, label: "Dhaka", storeName: "dhaka" },
  { id: 1, label: "Khulna", storeName: "khulna" },
  { id: 2, label: "Jashore", storeName: "jashore" },
];

const StoreMenu = ({ onClick }) => {
  return (
    <>
      {STORES.map((item) => (
        <MenuItem onClick={onClick} key={item.id} value={item.id}>
          {/* <FormattedMessage id={item.storeName} defaultMessage={item.label} /> */}
          {item.label}
        </MenuItem>
      ))}
    </>
  );
};

const StoreSwitcher: React.FC<{}> = () => {
  const { store, changeStore } = useStore();
  const selectedStore = STORES.find((x) => x.id === store);
  const storeChangeHandler = (e) => {
    changeStore(e.target.value);
  };
  return (
    <Box>
      <Popover
        className="right"
        handler={
          <SelectedItem>
            <span>
              {/* <FormattedMessage
                id={selectedStore?.storeName}
                defaultMessage={selectedStore?.label}
              /> */}
              {selectedStore?.label}
            </span>
          </SelectedItem>
        }
        content={<StoreMenu onClick={storeChangeHandler} />}
      />
    </Box>
  );
};

export default StoreSwitcher;
