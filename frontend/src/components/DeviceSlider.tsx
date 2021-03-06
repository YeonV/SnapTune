import React, { useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeUp from "@material-ui/icons/VolumeUp";
import { WsContext } from "./Websocket";

const useStyles = makeStyles({
  root: {
    width: "100%",
    padding: "0px 20px",
  },
});

interface SliderConfig {
  volume: any;
  id: string;
  groupMuted: boolean;
  deviceMuted: boolean;
  connected: boolean;
  groupId: string;
  snapcastServerHost: string;
}

export default function DeviceSlider(config: SliderConfig) {
  const classes = useStyles();
  const [vol, setVol] = React.useState<number>(config.volume);

  const ws = useContext(WsContext);

  const handleDrag = (event: any, newValue: number | number[]) => {
    if (newValue !== vol) {
      setVol(newValue as number);
      const request = {
        id: 8,
        jsonrpc: "2.0",
        method: "Client.SetVolume",
        params: { id: config.id, volume: { muted: false, percent: newValue } },
      };
      ws.send(JSON.stringify(++(request as any).id && request));
    }
  };

  useEffect(() => {
    document.addEventListener("Client.OnVolumeChanged", (e) => {
      if ((e as any).detail.id === config.id) {
        setVol((e as any).detail.volume.percent);
        // setDeviceMuted((e as any).detail.volume.muted);
      }
    });
  }, [config.id]);

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item>
          <VolumeDown
            color={
              config.groupMuted || config.deviceMuted || !config.connected
                ? "disabled"
                : "action"
            }
          />
        </Grid>
        <Grid item xs>
          <Slider
            disabled={
              config.groupMuted || config.deviceMuted || !config.connected
            }
            value={vol}
            onChange={handleDrag}
            aria-labelledby="continuous-slider"
          />
        </Grid>
        <Grid item>
          <VolumeUp
            color={
              config.groupMuted || config.deviceMuted || !config.connected
                ? "disabled"
                : "action"
            }
          />
        </Grid>
      </Grid>
    </div>
  );
}
