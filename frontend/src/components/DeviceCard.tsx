import React, { useContext, useEffect } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import VolumeOff from "@material-ui/icons/VolumeOff";
import VolumeUp from "@material-ui/icons/VolumeUp";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeviceSlider from "./DeviceSlider";
import { WsContext } from './Websocket';

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
}

export default function DeviceCard(config: Device) {
  const classes = useStyles();
  const [deviceMuted, setDeviceMuted] = React.useState<boolean>(
    config.deviceMuted
  );
  const ws = useContext(WsContext);

  const handleMute = () => {
    // const ws = new WebSocket(`ws://${config.snapcastServerHost}/jsonrpc`);
    const request = {
      id: "8",
      jsonrpc: "2.0",
      method: "Client.SetVolume",
      params: { id: config.id, volume: { muted: !deviceMuted } },
    };
    
      ws.send(JSON.stringify(++(request as any).id && request))
    
  };

  useEffect(() => {
    const onVolumeChanged = () => {
      // const ws = new WebSocket(`ws://${config.snapcastServerHost}/jsonrpc`);
      ws.addEventListener("message", (message) => {
        console.log("CARD", JSON.parse(message.data))
        const { method, params } = JSON.parse(message.data);
        if (method === "Client.OnVolumeChanged" && params.id === config.id) {
          setDeviceMuted(params.volume.muted);
        }
      });
    };
    onVolumeChanged();
  }, [deviceMuted, config.id, config.groupMuted, ws]);

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <IconButton disabled={config.groupMuted} onClick={() => handleMute()}>
            <Avatar aria-label="recipe" className={classes.avatar}>
              {deviceMuted ? <VolumeOff /> : <VolumeUp />}
            </Avatar>
          </IconButton>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={config.name}
        subheader={config.ip}
      />
      <CardActions disableSpacing>
        <DeviceSlider
          groupId={config.groupId}
          groupMuted={config.groupMuted}
          deviceMuted={config.deviceMuted}
          volume={config.volume}
          id={config.id}
          snapcastServerHost={config.snapcastServerHost}
        />
      </CardActions>
    </Card>
  );
}
