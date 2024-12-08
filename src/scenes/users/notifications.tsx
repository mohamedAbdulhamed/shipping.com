import React, { useState } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import DeleteIcon from "@mui/icons-material/Delete";
import MarkAsUnreadIcon from "@mui/icons-material/MarkAsUnread";

import WarningIcon from "@mui/icons-material/Warning"; // warning
import MessageIcon from "@mui/icons-material/Message"; // message
import LocalOfferIcon from "@mui/icons-material/LocalOffer"; // promotion

import useAxiosPrivate from "../../hooks/useAxiosPrivate.ts";

import { tokens } from "../../theme.ts";
import Notification from "../../entities/Notification.ts";
import { APPBAR_HEIGHT, HEADER_HEIGHT } from "../../config/constants.ts";
import { truncateString } from "../../utils/utils.ts";
import { useTranslation } from "react-i18next";

const Notifications = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const { i18n } = useTranslation();
  const axiosPrivate = useAxiosPrivate();

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "Alert",
      title: "Your order has been shipped.",
      description: "whatever desc",
      date: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      type: "Message",
      title: "You have a new message from support.",
      description: "whatever desc",
      date: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      type: "Promotion",
      title: "Get 20% off on your next purchase!",
      description:
        "whatever descwwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever deschatever descwhatever descwwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever deschatever descwhatever descwwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever deschatever descwhatever descwwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever deschatever descwhatever descwwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever deschatever descwhatever descwwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever deschatever descwhatever descwwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever deschatever descwhatever descwwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever descwhatever deschatever desc",
      date: "2 days ago",
      unread: true,
    },
    {
      id: 4,
      type: "Promotion",
      title: "رسالة بالعربي",
      description: "دي رسالة بالعربي",
      date: "2 days ago",
      unread: false,
    },
  ]);

  const [activeNotification, setActiveNotification] =
    useState<Notification | null>(null); // notification details
  const [detailsOpened, setDetailsOpened] = useState(false); // details dialog
  const openDetails = () => setDetailsOpened(true);
  const closeDetails = () => setDetailsOpened(false);

  const [confirmDeleteOpened, setConfirmDeleteOpened] = useState(false); // confirm delete notification dialog
  const openConfirm = () => setConfirmDeleteOpened(true);
  const closeConfirm = () => setConfirmDeleteOpened(false);

  const getIconByType = (type: Notification["type"]) => {
    switch (type) {
      case "Alert":
        return <WarningIcon color="warning" />;
      case "Message":
        return <MessageIcon color="primary" />;
      case "Promotion":
        return <LocalOfferIcon color="success" />;
      default:
        return <NotificationsIcon color="primary" />;
    }
  };

  const handleOpenNotification = (notification: Notification) => {
    setActiveNotification(notification);

    // mark as read function (notification)

    openDetails();
  };

  const handleDeleteNotification = (notification: Notification) => {
    setActiveNotification(notification);

    openConfirm();
  };

  // fetch notifications

  // mark as unread

  // mark ALL as unread

  // delete notification

  // delete ALL notifications

  // details ??

  return (
    <Box
      sx={{
        padding: "20px",
        minHeight: `calc(100vh - (${HEADER_HEIGHT}px + ${APPBAR_HEIGHT}px))`,
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight="bold">
          Notifications
        </Typography>
        <Box>
          {/* Select  (All, Unread, Read) */}
          <Button variant="outlined" size="small" sx={{ mx: "10px" }}>
            Mark All as Read
          </Button>
          <Button variant="outlined" size="small" color="error">
            Clear All
          </Button>
        </Box>
      </Box>

      {/* Notifications List */}
      <List>
        {notifications.map((notification) => (
          <React.Fragment key={notification.id}>
            <ListItem
              sx={{
                flexDirection: isNonMobile ? "row" : "column",
                backgroundColor: notification.unread ? "#e3f2fd" : "white",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            >
              <ListItemIcon>{getIconByType(notification.type)}</ListItemIcon>
              <ListItemText
                primary={truncateString(notification.title, 200)}
                secondary={notification.date} // convert from date to string
                primaryTypographyProps={{
                  fontWeight: notification.unread ? "bold" : "normal",
                  textAlign: i18n.dir() === "rtl" ? "right" : "left",
                }}
                secondaryTypographyProps={{
                  color: colors.grey[500],
                  dir: "ltr",
                  textAlign: i18n.dir() === "rtl" ? "right" : "left",
                }}
              />

              {/* Actions */}
              <Box
                sx={{
                  display: isNonMobile ? "block" : "flex",
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  color="info"
                  onClick={() => handleOpenNotification(notification)}
                  sx={{ mx: "10px" }}
                >
                  Details
                </Button>
                <Tooltip title={notification.unread ? "" : "Mark as Unread"} arrow>
                  <span>
                    <IconButton
                      sx={{
                        cursor: notification.unread ? "not-allowed" : "pointer",
                      }}
                      disabled={notification.unread}
                    >
                      <MarkAsUnreadIcon
                        sx={{
                          color: notification.unread
                            ? colors.grey[200]
                            : colors.black,
                        }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteNotification(notification)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      {/* Notification Details */}
      <Dialog
        open={detailsOpened && activeNotification !== null}
        onClose={closeDetails}
      >
        <DialogTitle>{activeNotification?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {activeNotification?.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={closeDetails}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Notification */}
      <Dialog
        open={confirmDeleteOpened && activeNotification !== null}
        onClose={closeConfirm}
      >
        <DialogTitle>Are you sure to delete this notification?</DialogTitle>
        <DialogActions>
          <Button color="primary" onClick={closeConfirm}>
            Cancel
          </Button>
          <Button color="error" onClick={closeConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notifications;
