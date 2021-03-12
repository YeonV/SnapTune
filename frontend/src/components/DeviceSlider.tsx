import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeUp from "@material-ui/icons/VolumeUp";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

interface SliderConfig {
  volume: any;
  id: string;
  groupMuted: boolean;
  deviceMuted: boolean;
  groupId: string;
  snapcastServerHost: string;
}

export default function DeviceSlider(config: SliderConfig) {
  const classes = useStyles();
  const [value, setValue] = React.useState<number>(config.volume);
  const [groupMuted, setGroupMuted] = React.useState<boolean>(
    config.groupMuted
  );
  const [deviceMuted, setDeviceMuted] = React.useState<boolean>(
    config.deviceMuted
  );

  const handleDrag = (event: any, newValue: number | number[]) => {
    setValue(newValue as number);
  };
  const handleRelease = async (event: any, newValue: number | number[]) => {
    setValue(newValue as number);
    const request = {
      id: "8",
      jsonrpc: "2.0",
      method: "Client.SetVolume",
      params: { id: config.id, volume: { muted: false, percent: newValue } },
    };

    const ws = new WebSocket(`ws://${config.snapcastServerHost}/jsonrpc`);
    ws.addEventListener("open", () =>
      ws.send(JSON.stringify(++(request as any).id && request))
    );
  };

  useEffect(() => {
    const onVolumeChanged = () => {
      const ws = new WebSocket(`ws://${config.snapcastServerHost}/jsonrpc`);
      ws.addEventListener("message", (message) => {
        const { method, params } = JSON.parse(message.data);
        if (method === "Client.OnVolumeChanged" && params.id === config.id) {
          setValue(params.volume.percent);
          setDeviceMuted(params.volume.muted);
        }
        if (method === "Group.OnMute" && params.id === config.groupId) {
          setGroupMuted(params.mute);
        }
      });
    };

    onVolumeChanged();
  }, [
    groupMuted,
    deviceMuted,
    config.groupId,
    config.id,
    config.snapcastServerHost,
  ]);

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item>
          <VolumeDown />
        </Grid>
        <Grid item xs>
          <Slider
            disabled={groupMuted || deviceMuted}
            value={value}
            onChange={handleDrag}
            onChangeCommitted={handleRelease}
            aria-labelledby="continuous-slider"
          />
        </Grid>
        <Grid item>
          <VolumeUp />
        </Grid>
      </Grid>
    </div>
  );
}
