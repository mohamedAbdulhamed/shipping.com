import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  ButtonBase,
  IconButton,
  AppBar,
  Toolbar,
  useMediaQuery,
  Badge,
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.ts";
import useLogout from "../../hooks/useLogout.ts";
import useLoading from "../../hooks/useLoading.ts";
import { useTranslation } from "react-i18next";

import { tokens } from "../../theme.ts";
import {
  LANGUAGES,
  HEADER_HEIGHT,
  APPBAR_HEIGHT,
  TRANSLAITIONS,
  ROLES,
} from "../../config/constants.ts";

import { toast } from "react-toastify";

import MobileTopbarActionsMenu, {
  ChildrenProps as MobileChildrenProps,
} from "./MobileTopbarActionsMenu.tsx";
import DesktopTopbarActions, {
  ChildrenProps as DesktopChildrenProps,
} from "./DesktopTopbarActions.tsx";

import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InventoryIcon from "@mui/icons-material/Inventory";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LogoutIcon from "@mui/icons-material/Logout";
import { Menu as MenuIcon } from "@mui/icons-material";
import TranslateIcon from "@mui/icons-material/Translate";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import InfoIcon from "@mui/icons-material/Info";

import { truncateString } from "../../utils/utils.ts";
import { fetchNumber } from "../../api/notification/index.ts";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.ts";

type VerticalDividerProps = {
  height: string | null;
};

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)"); // 600 or more = computer, labtop and tablet (not mobile L - M - S)
  const { auth } = useAuth();
  const logout = useLogout();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const { setMainLoading } = useLoading();

  const [notificationsAllowed, setNotificationsAllowed] = useState(false);
  const [notificationsNumber, setNotificationsNumber] = useState<number | null>(null); // number of unread notifications

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [dialogMenuOpen, setDialogMenuOpen] = useState(false);

  const [selectedAction, setSelectedAction] = useState<number | null>(null);

  const handleOpenMobileMenu = () => {
    setDialogMenuOpen(true);
  };

  const handleCloseMobileMenu = () => {
    setDialogMenuOpen(false);
  };

  const [actionsUrls] = useState({
    0: "/user/orders",
    1: "/user/offers",
    2: "/user/orders/new",
  });

  const companyActions = [
    {
      id: 1,
      title: t(TRANSLAITIONS.orders),
      urlIndex: 0,
      link: actionsUrls[0],
    },
    {
      id: 2,
      title: t(TRANSLAITIONS.offersMade),
      urlIndex: 1,
      link: actionsUrls[1],
    },
  ];

  const clientActions = [
    {
      id: 1,
      title: t(TRANSLAITIONS.orders),
      urlIndex: 0,
      link: actionsUrls[0],
    },
    {
      id: 2,
      title: t(TRANSLAITIONS.newOrder),
      urlIndex: 2,
      link: actionsUrls[2],
    },
  ];

  useEffect(() => {
    // Notification
    if (Notification.permission === "granted") {
      setNotificationsAllowed(true);
    }

    // fetch notifications number
    const fetchNotificationsNumber = async () => {
      try {
        const response = await fetchNumber(
          axiosPrivate,
        );

        setNotificationsNumber(response.data);
      } catch (error) {
        setNotificationsNumber(null);
      }
    };

    fetchNotificationsNumber()
  }, []);

  useEffect(() => {
    const currentUrl = window.location.pathname;

    const matchedAction = Object.entries(actionsUrls).find(
      ([, url]) => url === currentUrl
    );

    if (matchedAction) {
      setSelectedAction(Number(matchedAction[0]));
    }
  }, [window.location.pathname, actionsUrls]);

  const handleNotificationClick = () => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setNotificationsAllowed(true);
        }
      });
    } else if (Notification.permission === "granted") {
      setNotificationsAllowed(true);
    }
  };

  const handleLanguageClick = async () => {
    const newLanguage = i18n.language === "en" ? "ar" : "en";
    await i18n.changeLanguage(newLanguage);
    localStorage.setItem("language", i18n.language);
  };

  const handleSignOut = async () => {
    setMainLoading(true);
    const result = await logout();
    setMainLoading(false);

    if (result.success) {
      navigate("/login");
    } else {
      toast.error(result.message);
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget); // Open the menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the menu
  };

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

  const MobileTopbarActionsMenuChildren: MobileChildrenProps[] = [
    {
      primaryText: "Language",
      secondaryText: LANGUAGES[i18n.language],
      secondaryTextColor: colors.grey[400],
      onClick: handleLanguageClick,
      icon: <TranslateIcon />,
    },
    ...(auth?.user
      ? [
          {
            primaryText: t(TRANSLAITIONS.orders),
            onClick: () => navigate("/user/orders"),
            icon: <InventoryIcon />,
          },
          {
            primaryText: t(TRANSLAITIONS.notifications),
            secondaryText: "1 New Notification",
            secondaryTextColor: colors.grey[400],
            onClick: () => navigate("/user/notifications"),
            icon: (
              <React.Fragment>
                <Badge badgeContent={notificationsNumber} color="error">
                  <CircleNotificationsIcon />
                </Badge>
              </React.Fragment>
            ),
          },
          {
            primaryText: t(TRANSLAITIONS.profile),
            onClick: () => navigate("/user/profile"),
            icon: <AssignmentIndIcon />,
          },
          {
            primaryText: t(TRANSLAITIONS.signOut),
            primaryTextColor: colors.redAccent[500],
            onClick: () => handleSignOut(),
            icon: <LogoutIcon sx={{ color: colors.redAccent[500] }} />,
          },
        ]
      : [
          {
            primaryText: t(TRANSLAITIONS.login),
            onClick: () => navigate("/login"),
            icon: <ExitToAppIcon />,
          },
        ]),
    {
      primaryText: t(TRANSLAITIONS.notifications),
      secondaryText: notificationsAllowed
        ? t(TRANSLAITIONS.topbar_notifications_tooltipTitleAllowed)
        : t(TRANSLAITIONS.topbar_notifications_tooltipTitleNotAllowed),
      secondaryTextColor: colors.grey[400],
      icon: notificationsAllowed ? (
        <NotificationsActiveIcon />
      ) : (
        <NotificationsOutlinedIcon />
      ),
      onClick: handleNotificationClick,
    },
  ];

  const DesktopTopbarActionsChildren: DesktopChildrenProps[] = [
    {
      primaryText: LANGUAGES[i18n.language],
      toolTipTitle: t(TRANSLAITIONS.topbar_changeLanguage_tooltipTitle),
      primaryTextHoverColor: colors.secondry,
      onClick: handleLanguageClick,
      icon: <TranslateIcon />,
    },
    ...(auth?.user
      ? [
          {
            primaryText: t(TRANSLAITIONS.topbar_greeting, {
              name: truncateString(auth.user.fullName, 20),
            }),
            primaryTextHoverColor: colors.secondry,
            onClick: (event) => handleMenuClick(event),
            icon: <ArrowDropDownIcon />,
            menu: {
              anchorEl: anchorEl,
              onClose: handleMenuClose,
              children: [
                {
                  primaryText: t(TRANSLAITIONS.orders),
                  toolTipTitle: t(TRANSLAITIONS.topbar_orders_tooltipTitle),
                  icon: <InventoryIcon />,
                  onClick: () => navigate("/user/orders"),
                },
                {
                  primaryText: t(TRANSLAITIONS.notifications),
                  icon: (
                    <React.Fragment>
                      <Badge badgeContent={notificationsNumber} color="error">
                        <CircleNotificationsIcon />
                      </Badge>
                    </React.Fragment>
                  ),
                  onClick: () => navigate("/user/notifications"),
                },
                {
                  primaryText: t(TRANSLAITIONS.profile),
                  toolTipTitle: t(TRANSLAITIONS.topbar_profile_tooltipTitle),
                  icon: <AssignmentIndIcon />,
                  onClick: () => navigate("/user/profile"),
                },
                {
                  primaryText: t(TRANSLAITIONS.signOut),
                  icon: <LogoutIcon />,
                  onClick: () => handleSignOut(),
                },
              ],
            },
          },
        ]
      : [
          {
            primaryText: t(TRANSLAITIONS.login),
            primaryTextHoverColor: colors.secondry,
            onClick: () => navigate("/login"),
            icon: <PersonOutlinedIcon />,
          },
        ]),
    {
      primaryText: "",
      toolTipTitle: notificationsAllowed
        ? t(TRANSLAITIONS.topbar_notifications_tooltipTitleAllowed)
        : t(TRANSLAITIONS.topbar_notifications_tooltipTitleNotAllowed),
      primaryTextHoverColor: colors.secondry,
      onClick: () => handleNotificationClick(),
      icon: notificationsAllowed ? (
        <NotificationsActiveIcon />
      ) : (
        <NotificationsOutlinedIcon />
      ),
    },
  ];

  return (
    <React.Fragment>
      {/* Upper Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          color: colors.black,
          backgroundColor: colors.main,
          backdropFilter: "blur(10px) saturate(180%)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          position: "relative",
          height: `${HEADER_HEIGHT}px`,
          gap: "10px",
          p: 2,
          overflowX: "scroll",
          overflowY: "hidden",
          zIndex: "991",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "50px",
            position: "relative",
          }}
        >
          <ButtonBase
            component={Link}
            to="/"
            onClick={() => setSelectedAction(null)}
            sx={{
              display: "flex",
              borderRadius: "3px",
              p: "10px",
              gap: "5px",
              textDecoration: "none",
              overflow: "hidden",
              "&:hover .logo": {
                backgroundPosition: "0%",
              },
            }}
            tabIndex={0}
          >
            <Typography
              variant="h2"
              fontWeight="800"
              className="logo"
              sx={{
                background: `linear-gradient(to right, ${colors.secondry} 50%, ${colors.black} 50%)`,
                backgroundClip: "text",
                color: "transparent",
                transition: "background-position 0.5s ease",
                backgroundSize: "200%",
                backgroundPosition: "100%",
              }}
            >
              SHIPPING.COM
            </Typography>
          </ButtonBase>

          {/* if user is authenticated and is a company */}
          {auth.user?.role === ROLES.company && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <AccountBalanceWalletIcon />
              {/* if balane is below a certain amount, color: red */}
              <Typography variant="h3" sx={{ color: colors.redAccent[500] }}>
                0.00 EGP
              </Typography>

              {/* show if balance is below certain amount */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <InfoIcon />
                {/* suggest better message */}
                <Typography variant="subtitle1">
                  Your balance is too low to perform transactions. Please add
                  funds to continue using our services.{" "}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Action Buttons */}
        {isNonMobile ? (
          // Desktop Version
          <DesktopTopbarActions children={DesktopTopbarActionsChildren} />
        ) : (
          // Mobile Version
          <React.Fragment>
            <IconButton onClick={handleOpenMobileMenu}>
              <MenuIcon />
            </IconButton>
            <MobileTopbarActionsMenu
              open={dialogMenuOpen}
              onClose={handleCloseMobileMenu}
              children={MobileTopbarActionsMenuChildren}
              headerTitle={
                auth?.user
                  ? t(TRANSLAITIONS.topbar_greeting, {
                      name: auth.user.fullName,
                    })
                  : undefined
              }
            />
          </React.Fragment>
        )}
      </Box>

      {/* Lower Header */}
      <AppBar
        position="static"
        sx={{
          bgcolor: colors.grey[800],
          height: `${APPBAR_HEIGHT}px`,
          display: "flex",
          justifyContent: "center",
          textWrap: "nowrap",
        }}
      >
        <Toolbar
          sx={{
            overflowX: "scroll",
            overflowY: "hidden",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <Typography variant="h5" fontWeight="900">
            {t(TRANSLAITIONS.actions)}
          </Typography>

          <VerticalDivider height="2vh" />

          {auth.user?.role === ROLES.company ? (
            companyActions.map((action, index) => (
              <ButtonBase
                key={index}
                onClick={() => {
                  setSelectedAction(action.urlIndex);
                  navigate(action.link);
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    textTransform: "capitalize",
                    color:
                      action.urlIndex === selectedAction
                        ? colors.secondry
                        : colors.grey[300],
                  }}
                >
                  {action.title}
                </Typography>
                {index !== clientActions.length - 1 && (
                  <VerticalDivider height="2vh" />
                )}
              </ButtonBase>
            ))
          ) : auth.user?.role === ROLES.client ? (
            clientActions.map((action, index) => (
              <ButtonBase
                key={index}
                onClick={() => {
                  setSelectedAction(action.urlIndex);
                  navigate(action.link);
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    textTransform: "capitalize",
                    color:
                      action.urlIndex === selectedAction
                        ? colors.secondry
                        : colors.grey[300],
                  }}
                >
                  {action.title}
                </Typography>
                {index !== clientActions.length - 1 && (
                  <VerticalDivider height="2vh" />
                )}
              </ButtonBase>
            ))
          ) : (
            <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
              Login to see your available actions
            </Typography>
          )}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default Topbar;
