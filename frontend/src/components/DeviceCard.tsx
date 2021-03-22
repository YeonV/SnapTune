import React, { useContext, useEffect } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import VolumeOff from "@material-ui/icons/VolumeOff";
import VolumeUp from "@material-ui/icons/VolumeUp";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeviceSlider from "./DeviceSlider";
import { WsContext } from "./Websocket";
import SignalCellularConnectedNoInternet0BarIcon from "@material-ui/icons/SignalCellularConnectedNoInternet0Bar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
      width: "320px",
      margin: 0,
      "&&": {
        marginLeft: 0,
      },
      "&> div:first-child": {
        padding: "0.5rem",
      },
    },
    avatar: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    subline: {
      color: theme.palette.text.secondary,
      fontSize: "0.875rem",
    },
    title: {
      fontSize: "0.875rem",
    },
    form: {
      flexDirection: "column",
      display: "flex",
      "& .MuiTextField-root": {
        marginBottom: theme.spacing(1),
      },
    },
  })
);

interface Device {
  name: string;
  volume: number;
  ip: string;
  connected: boolean;
  groupMuted: boolean;
  deviceMuted: boolean;
  id: string;
  groupId: string;
  snapcastServerHost: string;
  latency: number;
}

export default function DeviceCard(config: Device) {
  const classes = useStyles();
  const [deviceMuted, setDeviceMuted] = React.useState<boolean>(
    config.deviceMuted
  );
  const [connected, setConnected] = React.useState<boolean>(config.connected);
  const [deviceName, setDeviceName] = React.useState<string>(config.name);
  const [latency, setLatency] = React.useState<number>(config.latency);
  const [open, setSettingsOpen] = React.useState(false);

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };
  const ws = useContext(WsContext);

  const handleMute = () => {
    const request = {
      id: "8",
      jsonrpc: "2.0",
      method: "Client.SetVolume",
      params: { id: config.id, volume: { muted: !deviceMuted } },
    };
    ws.send(JSON.stringify(++(request as any).id && request));
    setDeviceMuted(!deviceMuted);
  };
  const onSave = () => {
    if (config.latency !== latency) {
      const request = {
        id: "7",
        jsonrpc: "2.0",
        method: "Client.SetLatency",
        params: { id: config.id, latency: latency },
      };
      ws.send(JSON.stringify(request));
    }
    if (config.name !== deviceName) {
      const request = {
        id: "6",
        jsonrpc: "2.0",
        method: "Client.SetName",
        params: { id: config.id, name: deviceName },
      };
      ws.send(JSON.stringify(request));
    }
    handleSettingsClose();
  };

  useEffect(() => {
    const onVolumeChanged = () => {
      document.addEventListener("Client.OnVolumeChanged", (e) => {
        if ((e as any).detail.id === config.id) {
          setDeviceMuted((e as any).detail.volume.muted);
        }
      });
    };
    const onNameChanged = () => {
      document.addEventListener("Client.OnNameChanged", (e) => {
        if ((e as any).detail.id === config.id) {
          setDeviceName((e as any).detail.name);
        }
      });
    };
    const onConnectedChanged = () => {
      document.addEventListener("Client.OnConnectChange", (e) => {
        if ((e as any).detail.id === config.id) {
          setConnected((e as any).detail.client.connected);
        }
      });
    };
    const onLatencyChanged = () => {
      document.addEventListener("Client.OnLatencyChanged", (e) => {
        if ((e as any).detail.id === config.id) {
          setLatency((e as any).detail.latency);
        }
      });
    };
    onLatencyChanged();
    onConnectedChanged();
    onVolumeChanged();
    onNameChanged();
  }, [config.id]);
  return (
    <Card className={classes.root}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <IconButton
          disabled={config.groupMuted || !connected}
          onClick={() => handleMute()}
        >
          <Avatar aria-label="recipe" className={classes.avatar}>
            {connected ? (
              deviceMuted ? (
                <VolumeOff />
              ) : (
                <VolumeUp />
              )
            ) : (
              <SignalCellularConnectedNoInternet0BarIcon />
            )}
          </Avatar>
        </IconButton>
        <div>
          <Typography className={classes.title}>{deviceName}</Typography>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography className={classes.subline}>
              {`${config.ip} - ${latency}ms`}
            </Typography>
          </div>
        </div>
        <IconButton aria-label="settings" onClick={handleSettingsOpen}>
          <MoreVertIcon />
        </IconButton>
      </div>

      <CardActions disableSpacing>
        <DeviceSlider
          groupId={config.groupId}
          connected={connected}
          groupMuted={config.groupMuted}
          deviceMuted={deviceMuted}
          volume={config.volume}
          id={config.id}
          snapcastServerHost={config.snapcastServerHost}
        />
      </CardActions>
      <Dialog open={open} onClose={handleSettingsClose}>
        <DialogTitle id="alert-dialog-title">Configuration</DialogTitle>
        <DialogContent className={classes.form}>
          <TextField
            size="small"
            label="Name"
            id="name"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            variant="outlined"
          />
          <TextField
            size="small"
            label="Latency"
            id="latency"
            type="number"
            value={latency}
            onChange={(e) => setLatency(parseInt(e.target.value))}
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end">ms</InputAdornment>,
            }}
          />
          <TextField
            size="small"
            disabled
            label="IP"
            id="ip"
            value={config.ip}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions style={{ padding: "8px 20px" }}>
          <Button
            onClick={onSave}
            style={{ marginRight: "1rem", marginBottom: "0.5rem" }}
            variant="outlined"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
