import React, { useCallback, useEffect } from "react";
import snap from "./static/images/snapcast-blademod2.png";
import tuneblade from "./static/images/tuneblade.svg";
import tunebladeLogo from "./static/images/tuneblademod_150.png";
import "./App.css";
import {
  MuiThemeProvider,
  createMuiTheme,
  Fab,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from "@material-ui/core";
import DeviceCardTune from "./components/DeviceCardTune";
import GroupCard from "./components/GroupCard";
import { Settings } from "@material-ui/icons";
import { Color, ColorPicker } from "material-ui-color";

function App() {
  const [test, setTest] = React.useState([[""], [""]]);
  const [snapcastGroups, setSnapcastGroups] = React.useState<any[]>([]);
  const [snapcastStreams, setSnapcastStreams] = React.useState<any>([]);
  const [snapcastServer, setSnapcastServer] = React.useState<any>({});
  const [themmeType, setThemeType] = React.useState<"light" | "dark">("dark");
  const [colorPrimary, setColorPrimary] = React.useState<any>("#fdbf07");
  const [colorSecondary, setColorSecondary] = React.useState<any>("#800000");

  const handleChangePrimary = (newValue: Color) => {
    setColorPrimary(`#${newValue.hex}`);
    applyTheme();
  };
  const handleChangeSecondary = (newValueSec: Color) => {
    setColorSecondary(`#${newValueSec.hex}`);
    applyTheme();
  };

  const [themeyz, setThemeyz] = React.useState<any>(
    createMuiTheme({
      palette: {
        type: themmeType,
        primary: { main: colorPrimary },
        secondary: { main: colorSecondary },
      },
    })
  );

  const applyTheme = () =>
    setThemeyz(
      createMuiTheme({
        palette: {
          type: themmeType,
          primary: { main: colorPrimary },
          secondary: { main: colorSecondary },
        },
      })
    );
  const [open, setSettingsOpen] = React.useState(false);

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  const getTunebladeDevices = useCallback(async () => {
    const res = await fetch("/get");
    if (res.status === 200) {
      const resp = await res.text();
      const devices = resp.split("\n").filter((d) => d !== "");
      const deviceList = devices.map((d, i) =>
        d.replaceAll("  ", " ").split(" ")
      );
      setTest(deviceList);
    }
  }, []);

  useEffect(() => {
    const request = {
      id: 0,
      jsonrpc: "2.0",
      method: "Server.GetStatus",
    };
    const getSnapCastInfos = async () => {
      const ws = new WebSocket(`ws://192.168.1.204:1780/jsonrpc`);
      ws.addEventListener("message", (message) => {});
      ws.addEventListener("open", () =>
        ws.send(JSON.stringify(++request.id && request))
      );
      const response = await fetch(`/snap/get`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(++request.id && request),
      });
      const content = await response.json();
      const { groups, server, streams } = JSON.parse(content).result.server;
      setSnapcastGroups(groups);
      setSnapcastStreams(streams);
      setSnapcastServer(server);
    };

    getTunebladeDevices();
    getSnapCastInfos();
  }, [getTunebladeDevices]);

  return (
    <MuiThemeProvider theme={themeyz}>
      <div
        className="App"
        style={{ backgroundColor: themeyz.palette.background.default }}
      >
        <header className="App-header">
          <Fab
            color={"secondary"}
            onClick={handleSettingsOpen}
            style={{
              position: "absolute",
              right: "2rem",
              top: "1rem",
            }}
          >
            <Settings />
          </Fab>
          <div
            className="snap-header"
            style={{ color: themeyz.palette.text.secondary }}
          >
            <img
              src={snap}
              className="App-logo"
              alt="logo"
              onClick={() => {
                setThemeType(themmeType === "dark" ? "light" : "dark");
                applyTheme();
              }}
            />
          </div>
          <div className={"cardWrapper"}>
            {snapcastGroups &&
              snapcastGroups.length > 0 &&
              snapcastGroups.map((g, i) => (
                <GroupCard
                  snapcastStreams={snapcastStreams}
                  key={i}
                  id={g.id}
                  stream_id={g.stream_id}
                  group={i}
                  clients={g.clients}
                  groupMuted={g.muted}
                  number_clients={g.clients.length}
                  name={g.name || `Group ${i} (${g.clients.length} Clients)`}
                />
              ))}
          </div>

          <div className={"tuneHeader"}>
            <img width="70px" src={tunebladeLogo} alt="logo" />
            <div
              className={"tuneLogoName"}
              style={{ backgroundImage: `url(${tuneblade})` }}
            />
          </div>
          <div className={"tuneCardWrapper"}>
            {test.map((d, i) => (
              <DeviceCardTune
                key={i}
                variant="contained"
                volume={parseInt(d[2])}
                name={d[3]}
                connected={d[1] !== "0"}
                id={d[0]}
                getTunebladeDevices={getTunebladeDevices}
              />
            ))}
          </div>
        </header>
      </div>
      <Dialog
        open={open}
        onClose={handleSettingsClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Settings"}

          <Typography color="textSecondary" variant="subtitle1" gutterBottom>
            {snapcastServer?.snapserver?.name} -{" "}
            {snapcastServer &&
              snapcastServer.snapserver &&
              snapcastServer.snapserver.version}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Configure the appearance, inluding real-time-changes
          </DialogContentText>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography color="textSecondary" variant="subtitle1">
                Theme Mode
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant={"outlined"}
                onClick={() => {
                  setThemeType(themmeType === "light" ? "dark" : "light");
                  applyTheme();
                }}
                color="primary"
              >
                {themmeType === "light" ? "Dark Mode" : "Light Mode"}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Typography color="textSecondary" variant="subtitle1">
                Primary Color
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <ColorPicker
                value={colorPrimary}
                onChange={handleChangePrimary}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography color="textSecondary" variant="subtitle1">
                Secondary Color
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <ColorPicker
                value={colorSecondary}
                onChange={handleChangeSecondary}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSettingsClose} color="primary" autoFocus>
            ok
          </Button>
        </DialogActions>
      </Dialog>
    </MuiThemeProvider>
  );
}

export default App;