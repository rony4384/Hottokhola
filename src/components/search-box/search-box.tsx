import React from "react";
import {
  Item,
  Dropdown,
  StyledForm,
  StyledInput,
  StyledCategoryName,
  StyledSearchButton,
} from "./search-box.style";
import { SearchIcon } from "assets/icons/SearchIcon";

interface Props {
  onEnter: (e: React.SyntheticEvent) => void;
  onSelect: React.ChangeEventHandler<HTMLInputElement>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string;
  name: string;
  minimal?: boolean;
  className?: string;
  showButtonText?: boolean;
  shadow?: string;
  [key: string]: unknown;
  items?: any;
}

export const SearchBox: React.FC<Props> = ({
  onEnter,
  onSelect,
  onChange,
  value,
  name,
  minimal,
  categoryType,
  buttonText,
  className,
  showButtonText = true,
  shadow,
  items,
  ...rest
}) => {
  const suggestions = (items) => {
    return (
      <ul>
        {items.slice(0, 10).map((item) => (
          <Item key={item.id} onClick={() => onSelect(item.name)}>
            {item.name}
          </Item>
        ))}
      </ul>
    );
  };

  return (
    <StyledForm
      onSubmit={onEnter}
      className={className}
      boxShadow={shadow}
      minimal={minimal}
    >
      {minimal ? (
        <>
          <SearchIcon style={{ marginLeft: 16, marginRight: 16 }} />
          <StyledInput
            type="search"
            onChange={onChange}
            value={value}
            name={name}
            autoComplete="off"
            {...rest}
          />
          <Dropdown style={{ top: "60px" }}>
            {items && suggestions(items)}
          </Dropdown>
        </>
      ) : (
        <>
          <StyledCategoryName>{categoryType}</StyledCategoryName>
          <>
            <StyledInput
              type="search"
              onChange={onChange}
              value={value}
              name={name}
              autoComplete="off"
              {...rest}
            />
            <Dropdown style={{ marginLeft: "100px" }}>
              {items && suggestions(items)}
            </Dropdown>
          </>
          <StyledSearchButton>
            <SearchIcon style={{ marginRight: 10, marginLeft: 10 }} />
            {showButtonText && buttonText}
          </StyledSearchButton>
        </>
      )}
    </StyledForm>
  );
};
