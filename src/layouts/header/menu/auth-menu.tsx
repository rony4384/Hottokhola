import React from "react";
import { Button } from "components/button/button";
import { FormattedMessage } from "react-intl";
import Popover from "components/popover/popover";
import { AuthorizedMenu } from "./authorized-menu";
// import { customerDistance } from "utils/customerDistance";
import { UserAvatar } from "assets/icons/UserAvatar";
import { AuthContext } from "contexts/auth/auth.context";

interface Props {
  isAuthenticated: boolean;
  onJoin: () => void;
  onLogout: () => void;
  avatar: string;
}

const AuthMenu = ({ isAuthenticated, onJoin, onLogout, avatar }: Props) => {
  const {
    authState: { name, mobile_number },
  } = React.useContext<any>(AuthContext);
  return !isAuthenticated ? (
    <Button variant="primary" onClick={onJoin}>
      <FormattedMessage id="joinButton" defaultMessage="join" />
    </Button>
  ) : (
    <>
      {/* <Popover
        direction="right"
        className="user-pages-dropdown"
        handler={<img src={avatar} alt="user" />}
        content={<AuthorizedMenu onLogout={onLogout} />}
      /> */}
      <Popover
        direction="right"
        className=""
        handler={
          <span>
            {/* <UserAvatar /> */}
            &nbsp;
            {isAuthenticated &&
              mobile_number &&
              (name == "null" || name == null ? "Dear Guest" : name)}
          </span>
        }
        content={<AuthorizedMenu onLogout={onLogout} />}
      />
    </>
  );
};
export default AuthMenu;
