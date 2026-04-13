import React from "react";
import { render } from "ink";
import { App } from "./App";

// Enter alternate screen buffer
process.stdout.write("\x1b[?1049h");

const { unmount, waitUntilExit } = render(<App />);

// Ensure we clean up when exiting
const cleanup = () => {
  unmount();
  process.stdout.write("\x1b[?1049l");
  process.exit();
};

waitUntilExit().then(cleanup).catch(cleanup);

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
