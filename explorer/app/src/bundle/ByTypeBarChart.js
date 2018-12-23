import React from "react";

import OrdinalFrame from "semiotic/lib/OrdinalFrame";
import ResponsiveOrdinalFrame from "semiotic/lib/ResponsiveOrdinalFrame";
import { colors, primary, mainFileColor, secondaryFileColor } from "../theme";

import { getFileSize, getPercent } from "./stringFormats";

const typeColors = {
  js: mainFileColor,
  ts: mainFileColor,
  jsx: mainFileColor,
  tsx: mainFileColor
};

const frameProps = {
  margin: { top: 50 },
  oAccessor: d => d.parent.id,
  rAccessor: d => d.value,
  type: "bar",
  projection: "vertical",
  oPadding: 2,

  style: d => {
    return {
      fill: typeColors[d.id] || secondaryFileColor
      // stroke: typeColors[d.id] || secondaryFileColor
    };
  }
};

export default function OverviewBarChart({
  hierarchy,
  network = {},
  changeSelected,
  counts
}) {
  const totalSize = hierarchy.value;

  const fileTypes = hierarchy.leaves().reduce((p, c) => {
    if (!p[c.id]) {
      p[c.id] = {
        id: c.id,
        value: c.value
      };
    } else {
      p[c.id].value += c.value;
    }

    return p;
  }, {});

  return (
    <div className="relative flex">
      <div className="panel">
        <h1>Project Name</h1>
        <b>
          <small>Uploaded Date</small>
        </b>
        <h2>{getFileSize(totalSize)}</h2>

        <p>
          Your bundle is made up <b>{hierarchy.children.length}</b> top-level
          directories
        </p>
      </div>
      <div>
        <div className="flex">
          <div className="side-panel left padding">
            <p>
              <img className="icon" alt="file types" src="/img/file.png" />
              <b>
                <small>File Types</small>
              </b>
            </p>
          </div>
          <div className="side-panel right padding relative">
            <ResponsiveOrdinalFrame
              size={[500, 100]}
              {...frameProps}
              data={Object.values(fileTypes).sort((a, b) => b.value - a.value)}
              oAccessor={"none"}
              margin={{ right: 100 }}
              responsiveWidth={true}
              className="overflow-visible"
              projection="horizontal"
              type={{
                type: "bar",
                customMark: d => {
                  if (!d.value) return null;

                  const color = typeColors[d.id] || secondaryFileColor;
                  return (
                    <g transform="translate(0, 30)">
                      <rect
                        width={d.scaledValue}
                        height={40}
                        fill={color}
                        stroke={color}
                      />
                      <text fontWeight="bold" y={-5}>
                        {getPercent(d.value, hierarchy.value)}
                      </text>
                      <text y={25} x={5}>
                        .{d.id}
                      </text>
                    </g>
                  );
                }
              }}
            />
          </div>
        </div>
        <div className="flex">
          <div className="side-panel left padding">
            <p>
              <img className="icon" alt="directories" src="/img/folder.png" />

              <b>
                <small>Directories</small>
              </b>
            </p>
          </div>
          <div className="side-panel right padding relative">
            <OrdinalFrame
              size={[hierarchy.children.length * 200, 120]}
              {...frameProps}
              data={hierarchy.leaves().sort((a, b) => b.value - a.value)}
              oLabel={(d, arr) => {
                return (
                  <text
                    transform="translate(-100, -110)"
                    // textAnchor="middle"
                    opacity=".6"
                  >
                    <tspan>{d}</tspan>
                    <tspan x={0} y={15} fontWeight="bold">
                      {Math.round(arr[0].parent.value / hierarchy.value * 100)}
                      %{" "}
                    </tspan>
                    <tspan>
                      {arr[0].parent &&
                        (arr[0].parent.value / 1024).toFixed(2)}{" "}
                      KB
                    </tspan>
                  </text>
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}