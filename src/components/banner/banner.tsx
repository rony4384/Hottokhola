import React, { useCallback } from "react";
import { FormattedMessage } from "react-intl";
import {
  Box,
  Image,
  Content,
  Title,
  Description,
  SearchWrapper,
} from "./banner.style";

import { Waypoint } from "react-waypoint";
import { useAppDispatch } from "contexts/app/app.provider";
import Search from "features/search/search";

interface Props {
  imageUrl: string;
  title: string;
  subtitle: string;
}

export const Banner: React.FC<Props> = ({ imageUrl, title, subtitle }) => {
  const dispatch = useAppDispatch();
  const setSticky = useCallback(() => dispatch({ type: "SET_STICKY" }), [
    dispatch,
  ]);
  const removeSticky = useCallback(() => dispatch({ type: "REMOVE_STICKY" }), [
    dispatch,
  ]);
  const onWaypointPositionChange = ({ currentPosition }) => {
    if (!currentPosition || currentPosition === "above") {
      setSticky();
    }
  };
  return (
    <Box>
      <Image backgroundImage={`url(${imageUrl})`} />
      <Content>
        <Title>{title}</Title>
        <Description>{subtitle}</Description>
        <SearchWrapper>
          <Search
            className="banner-search"
            shadow="0 21px 36px rgba(0,0,0,0.05)"
          />
        </SearchWrapper>
        <Waypoint
          onEnter={removeSticky}
          onLeave={setSticky}
          onPositionChange={onWaypointPositionChange}
        />
      </Content>
    </Box>
  );
};
