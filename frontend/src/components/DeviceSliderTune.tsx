import React from "react";
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

interface DeviceSliderConfig {
  volume: number;
  id: string;
  getTunebladeDevices: any;
}

export default function DeviceSlider(config: DeviceSliderConfig) {
  const classes = useStyles();
  const [value, setValue] = React.useState(config.volume);

  const setVolume = async (val: number, id: string) => {
    const res = await fetch(`/vol/${id}/${val}`);
    if (res.status === 200) {
      const resp = await res.text();
      if (typeof resp !== "string") {
        console.log(typeof resp);
      }
    }
  };

  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number);
    // setVolume(parseInt(JSON.stringify(newValue)), config.id)
  };
  const handleChangeCommitted = (event: any, newValue: number | number[]) => {
    setVolume(parseInt(JSON.stringify(newValue)), config.id);
    config.getTunebladeDevices();
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item>
          <VolumeDown />
        </Grid>
        <Grid item xs>
          <Slider
            value={value || config.volume}
            onChange={handleChange}
            onChangeCommitted={handleChangeCommitted}
          />
        </Grid>
        <Grid item>
          <VolumeUp />
        </Grid>
      </Grid>
    </div>
  );
}
