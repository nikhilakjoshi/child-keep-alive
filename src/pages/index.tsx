import { useEffect, useState } from "react";
import Head from "next/head";
import clsx from "clsx";
import { Rubik } from "next/font/google";
import { SwitchTransition, CSSTransition } from "react-transition-group";

const font = Rubik({
  subsets: ["latin-ext"],
});

export default function Home() {
  const [status, setStatus] = useState("Idle...");
  useEffect(() => {
    const messageHandler = async (event: MessageEvent) => {
      setStatus("Receiving message...");
      const { key } = JSON.parse(event.data as string) as { key: string };
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus(`Received message: ${key}`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("Triggering keep-alive...");
      const response = await fetch("/api/keep-alive");
      const { key: newKey } = (await response.json()) as { key: string };
      setStatus(`Received keep-alive: ${key}`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("Posting to parent...");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      window.parent.postMessage(
        JSON.stringify({ newKey }),
        "https://parent-keep-alive.vercel.app",
      );
      setStatus("Posted to parent...");
    };
    window.addEventListener("message", (e) => messageHandler(e));
    () => window.removeEventListener("message", (x) => messageHandler(x));
  }, []);
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={clsx(font.className, "flex min-h-screen flex-col")}>
        <nav className="bg-green-100 px-2 py-4">
          <div className="text-lg font-semibold">Child App</div>
        </nav>
        <main className="grow bg-white">
          <div className="px-2 py-4">
            Status:{" "}
            <SwitchTransition mode="out-in">
              <CSSTransition key={status} timeout={300} classNames="fade">
                <pre className="inline-block rounded bg-gray-300 px-2 py-0.5">
                  {status}
                </pre>
              </CSSTransition>
            </SwitchTransition>
          </div>
        </main>
      </div>
    </>
  );
}
