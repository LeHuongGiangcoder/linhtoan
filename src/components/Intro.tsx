"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { LAYERS, type LayerId } from "@/lib/layers";

/** Thứ tự chồng lớp: cảnh nền → cổng → hai cánh cửa. */
const SCENE: LayerId = "37";
const GATE: LayerId = "38";
const DOOR_LEFT: LayerId = "39";
const DOOR_RIGHT: LayerId = "40";

/** Đặt layer đúng vị trí gốc trên canvas 3875x5462. */
function layerStyle(id: LayerId) {
  const l = LAYERS[id];
  return {
    left: `${l.left * 100}%`,
    top: `${l.top * 100}%`,
    width: `${l.width * 100}%`,
  };
}

/**
 * Màn intro: cổng hoa đóng kín. Bấm "Join us" → hai cánh cửa mở ra,
 * đồng thời zoom in + blur rồi tan đi để lộ hero section.
 */
/** idle → dismissing (nút tan) → opening (mở cổng, zoom, blur) → gone */
type Phase = "idle" | "dismissing" | "opening" | "gone";

/** Nút blur biến mất xong mới bắt đầu mở cổng. */
const BUTTON_FADE_MS = 480;
/** Tổng thời lượng mở cổng + zoom + blur + tan. */
const REVEAL_MS = 4900;

export function Intro() {
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    document.body.classList.add("intro-locked");
    const pending = timers.current;
    return () => {
      document.body.classList.remove("intro-locked");
      pending.forEach(window.clearTimeout);
    };
  }, []);

  const open = useCallback(() => {
    setPhase((current) => {
      if (current !== "idle") return current;

      timers.current.push(
        window.setTimeout(() => setPhase("opening"), BUTTON_FADE_MS),
        window.setTimeout(() => {
          setPhase("gone");
          document.body.classList.remove("intro-locked");
        }, BUTTON_FADE_MS + REVEAL_MS),
      );

      return "dismissing";
    });
  }, []);

  if (phase === "gone") return null;

  const opening = phase === "opening";

  return (
    <div
      className={`intro ${phase === "dismissing" ? "is-dismissing" : ""} ${
        opening ? "is-opening" : ""
      }`}
      aria-hidden={phase !== "idle"}
    >
      <div className="intro-stage">
        <Image
          src={LAYERS[SCENE].src}
          alt=""
          width={LAYERS[SCENE].w}
          height={LAYERS[SCENE].h}
          priority
          sizes="(max-width: 640px) 132vw, 640px"
          className="intro-layer intro-scene"
          style={layerStyle(SCENE)}
        />

        <Image
          src={LAYERS[GATE].src}
          alt="Cổng hoa dẫn vào lễ đường"
          width={LAYERS[GATE].w}
          height={LAYERS[GATE].h}
          priority
          sizes="(max-width: 640px) 132vw, 640px"
          className="intro-layer"
          style={layerStyle(GATE)}
        />

        <Image
          src={LAYERS[DOOR_LEFT].src}
          alt=""
          width={LAYERS[DOOR_LEFT].w}
          height={LAYERS[DOOR_LEFT].h}
          priority
          sizes="(max-width: 640px) 45vw, 200px"
          className="intro-layer intro-door"
          style={layerStyle(DOOR_LEFT)}
        />

        <Image
          src={LAYERS[DOOR_RIGHT].src}
          alt=""
          width={LAYERS[DOOR_RIGHT].w}
          height={LAYERS[DOOR_RIGHT].h}
          priority
          sizes="(max-width: 640px) 45vw, 200px"
          className="intro-layer intro-door intro-door--right"
          style={layerStyle(DOOR_RIGHT)}
        />
      </div>

      <button type="button" className="glass-btn" onClick={open}>
        Join us
      </button>
    </div>
  );
}
