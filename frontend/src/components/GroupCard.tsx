import { useEffect, useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeviceCard from "./DeviceCard";
import { VolumeUp, VolumeOff } from "@material-ui/icons";
import { Select, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
      width: "320px",
      margin: "1rem",
      "&> div:first-child": {
        padding: "0.5rem",
        alignItems: "center",
        "&> div:last-child": {
          marginTop: "unset",
        },
      },
      "&> div:last-child": {
        flexDirection: "column",
        justifyContent: "center",
      },
    },
    subline: {
      color: theme.palette.text.secondary,
    },
    avatar: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  })
);

interface GroupConfig {
  name: string;
  group: number;
  number_clients: number;
  clients: [];
  stream_id: string;
  id: string;
  groupMuted: boolean;
  snapcastStreams: [];
  snapcastServerHost: string;
}

export default function GroupCard(config: GroupConfig) {
  const classes = useStyles();
  const [groupMuted, setGroupMuted] = useState<any>(config.groupMuted);
  const currentStream = config.snapcastStreams.find(
    (s: { id: "" }) => s.id === config.stream_id
  );
  const handleMute = () => {
    const ws = new WebSocket(`ws://${config.snapcastServerHost}/jsonrpc`);
    const request = {
      id: "8",
      jsonrpc: "2.0",
      method: "Group.SetMute",
      params: { id: config.id, mute: !groupMuted },
    };

    ws.addEventListener("open", () =>
      ws.send(JSON.stringify(++(request as any).id && request))
    );
  };
  useEffect(() => {
    const ws = new WebSocket(`ws://${config.snapcastServerHost}/jsonrpc`);
    ws.addEventListener("message", (message) => {
      const { method, params } = JSON.parse(message.data);
      if (method === "Group.OnMute" && params.id === config.id) {
        setGroupMuted(params.mute);
      }
    });
  }, [groupMuted, config.id, config.snapcastServerHost]);
  return (
    <Card className={classes.root}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <IconButton onClick={() => handleMute()}>
          <Avatar aria-label="recipe" className={classes.avatar}>
            {groupMuted ? <VolumeOff /> : <VolumeUp />}
          </Avatar>
        </IconButton>
        <div>
          <Typography>{config.name}</Typography>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {config.snapcastStreams && config.snapcastStreams.length > 0 && (
              <Select
                defaultValue={config.stream_id}
                disableUnderline
                className={classes.subline}
              >
                {config.snapcastStreams.map((s: { id: "" }, i) => (
                  <option key={i} value={s.id}>
                    {s.id}
                  </option>
                ))}
              </Select>
            )}
            {currentStream && (
              <Typography className={classes.subline}>
                {(currentStream as { status: "" }).status}
              </Typography>
            )}
          </div>
        </div>
        <IconButton onClick={() => handleMute()}>
          <EditIcon />
        </IconButton>
      </div>

      <CardActions>
        {config.clients?.map((c: any, i: number) => (
          <DeviceCard
            key={i}
            name={c.host.name}
            id={c.id}
            volume={c.config.volume.percent}
            groupId={config.id}
            groupMuted={config.groupMuted}
            deviceMuted={c.config.volume.muted}
            connected={c.connected}
            ip={c.host.ip}
            snapcastServerHost={config.snapcastServerHost}
          />
        ))}
      </CardActions>
    </Card>
  );
}
