import * as React from "react";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import Button from "@mui/material/Button";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export type ChildrenProps = {
  primaryText: string;
  primaryTextColor?: string;
  secondaryText?: string;
  secondaryTextColor?: string;
  icon?: React.ReactNode;
  onClick: (...args: any[]) => any;
  closeAfterClick?: boolean;
}

type MobileTopbarActionsMenuProps = {
  open: boolean;
  onClose: () => void;
  children: ChildrenProps[];
  headerTitle?: string | null;
};

const MobileTopbarActionsMenu: React.FC<MobileTopbarActionsMenuProps> = ({
  open,
  onClose,
  children,
  headerTitle,
}) => {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      {/* Header */}
      <AppBar sx={{ position: "relative" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>

          {headerTitle && (
            <Button
              autoFocus
              color="inherit"
              onClick={onClose}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              {headerTitle}
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Content */}
      <List
        sx={{
          direction: "ltr",
        }}
      >
        {children.map((child, index) => {
          const { closeAfterClick = true, primaryTextColor, secondaryTextColor } = child;
          return (
            <React.Fragment key={index}>
              <ListItemButton
                onClick={() => {
                  child.onClick();
                  closeAfterClick && onClose();
                }}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <ListItemText
                  primaryTypographyProps={{
                    sx: { color: primaryTextColor || "inherit" },
                  }}
                  secondaryTypographyProps={{
                    sx: { color: secondaryTextColor || "inherit" },
                  }}
                  primary={child.primaryText}
                  secondary={child.secondaryText}
                />
                {child.icon}
              </ListItemButton>

              {index < children.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </List>
    </Dialog>
  );
};

export default MobileTopbarActionsMenu;
