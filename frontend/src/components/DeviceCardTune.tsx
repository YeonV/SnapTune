import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeviceSliderTune from "./DeviceSliderTune";
import { PlayArrow, Stop } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
      width: "320px",
      margin: "1rem",
    },
    avatar: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  })
);

interface Device {
  name: string;
  connected: boolean;
  volume: number;
  id: string;
  getTunebladeDevices: any;
  variant: "outlined" | "contained";
}

export default function DeviceCardTune(config: Device) {
  const classes = useStyles();

  const setStatus = async () => {
    const res = await fetch(
      `/stat/${config.id}/${config.connected ? "Disconnect" : "Connect"}`
    );
    if (res.status === 200) {
      await res.text();
      config.getTunebladeDevices();
    }
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <IconButton onClick={setStatus}>
            <Avatar aria-label="recipe" className={classes.avatar}>
              {config.connected ? <Stop /> : <PlayArrow />}
            </Avatar>
          </IconButton>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={config.name}
        subheader={config.connected ? "connected" : "disconnected"}
      />
      <CardActions disableSpacing>
        {
          <DeviceSliderTune
            volume={config.volume}
            id={config.id}
            getTunebladeDevices={config.getTunebladeDevices}
          />
        }
      </CardActions>
    </Card>
  );
}
