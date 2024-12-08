import * as React from "react";
import {
  Badge,
  Box,
  ButtonBase,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";

type VerticalDividerProps = {
  height: string | null;
};

type MenuProps = {
  anchorEl: HTMLButtonElement | null;
  onClose: () => any;
  children: {
    primaryText: string;
    toolTipTitle?: string;
    icon?: React.ReactNode;
    onClick: () => any;
  }[];
};

export type ChildrenProps = {
  primaryText: string;
  primaryTextHoverColor?: string;
  toolTipTitle?: string;
  icon?: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
  menu?: MenuProps;
};

type DesktopTopbarActionsProps = {
  children: ChildrenProps[];
};

const DesktopTopbarActions: React.FC<DesktopTopbarActionsProps> = ({
  children,
}) => {
  const VerticalDivider = ({ height = "100%" }: VerticalDividerProps) => (
    <Box
      sx={{
        width: "1px",
        minWidth: "1px",
        backgroundColor: "#b1cdc6",
        height: height,
        margin: "0 15px",
      }}
    />
  );

  return (
    <Box sx={{ display: "flex", alignItems: "center", textWrap: "nowrap" }}>
      {children.map((child, index) => (
        <React.Fragment key={index}>
          <Tooltip title={child.toolTipTitle} placement="bottom-start" arrow>
            <ButtonBase onClick={child.onClick} tabIndex={index}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  transition: "0.5s",
                  "&:hover": { color: child.primaryTextHoverColor },
                }}
              >
                <Typography
                  id="language"
                  variant="h4"
                  sx={{ fontWeight: "bold" }}
                >
                  {child.primaryText} {child.icon}
                </Typography>
              </Box>
            </ButtonBase>
          </Tooltip>
          {child.menu && (
            <Menu
              anchorEl={child.menu.anchorEl}
              open={Boolean(child.menu.anchorEl)}
              onClose={child.menu.onClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              sx={{
                "& li": {
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                },
              }}
            >
              {child.menu.children.map((menuChild, index) => (
                <Tooltip key={index} title={menuChild.toolTipTitle} placement="right" arrow>
                  <MenuItem
                    onClick={(event) => {
                      child.menu?.onClose();
                      menuChild.onClick();
                    }}
                  >
                    {menuChild.primaryText}
                    {menuChild.icon}
                  </MenuItem>
                </Tooltip>
              ))}
            </Menu>
          )}

          {index < children.length - 1 && <VerticalDivider height="50%" />}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default DesktopTopbarActions;
