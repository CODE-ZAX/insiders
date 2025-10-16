"use client";

import { useState } from "react";
import { GameModal } from "@/components/games/GameModal";
import { Button } from "@/components/ui/button";
import { PlayCircleIcon } from "lucide-react";
import Image from "next/image";

interface GameDefinition {
  id: number;
  title: string;
  imageUrl: string;
  description?: string;
  component: React.ReactNode;
}

export default function GamesPage() {
  const gamesList: GameDefinition[] = [
    {
      id: 1,
      title: "Tekken 3",
      imageUrl:
        "https://i.987967.xyz/screenshot/72/2018/09/04/40238_0ae25ae7f0f2fdd2ff1546d5c92cc5dabe06095c.png",
      description: "Relive the arcade classic with every combo and finisher.",
      component: (
        <iframe
          src="https://www.retrogames.cc/embed/40238-tekken-3.html"
          width="600"
          height="450"
          frameBorder="no"
          allowFullScreen
          scrolling="no"
        ></iframe>
      ),
    },
    {
      id: 2,
      title: "Dragon Ball Z - Super Sonic Warriors",
      imageUrl:
        "https://i.987967.xyz/screenshot/43/p/28096_d70b68d8b7a577c6d795db8277ce1202caa31fde.png",
      description: "Battle through the story with your favorite DBZ heroes.",
      component: (
        <iframe
          src="https://www.retrogames.cc/embed/19537-dragonball-z-supersonic-warriors-e-rising-sun.html"
          width="600"
          height="450"
          frameBorder="no"
          allowFullScreen
          scrolling="no"
        ></iframe>
      ),
    },
    {
      id: 3,
      title: "Sonic the Hedgehog",
      imageUrl:
        "https://i.987967.xyz/screenshot/47/p/30002_eb29ae6d432f1c7055dd56a784481df11f2514a5.png",
      description:
        "Dash through the iconic Green Hill Zone in this SEGA classic.",
      component: (
        <iframe
          src="https://www.retrogames.cc/embed/30002-sonic-the-hedgehog-3-europe.html"
          width="600"
          height="450"
          frameBorder="no"
          allowFullScreen
          scrolling="no"
        ></iframe>
      ),
    },
  ];
  const [activeGame, setActiveGame] = useState<GameDefinition | null>(null);

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-16 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Games Lounge</h1>
        <p className="text-muted-foreground">
          Challenge your friends, climb the leaderboards, and explore upcoming
          mini-games.
        </p>
      </header>
      <section className="rounded-3xl border border-border/60 bg-card/80 p-8 shadow-sm">
        <div className="rounded-2xl border border-dashed border-border/60 bg-muted/40 p-10 text-center">
          <p className="text-lg font-semibold text-foreground">
            More Games coming soon
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            We are crafting a library of social games made for the Insiders
            community.
          </p>
          <Button variant="outline" size="sm" className="mt-4">
            Notify me
          </Button>
        </div>
      </section>
      <section>
        <div className="grid gap-6 md:grid-cols-2">
          {gamesList.map((game) => (
            <div key={game.id} className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">
                {game.title}
              </h2>
              <div className="relative overflow-hidden rounded-lg border border-border/60 shadow-sm">
                <button
                  type="button"
                  onClick={() => setActiveGame(game)}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 transition hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="sr-only">Play {game.title}</span>
                  <PlayCircleIcon className="h-20 w-20 rounded-full bg-slate-100 text-slate-800 shadow-lg" />
                </button>
                <Image
                  src={game.imageUrl}
                  alt={game.title}
                  width={400}
                  height={300}
                  className="aspect-video w-full object-cover"
                />
              </div>
              {game.description ? (
                <p className="text-sm text-muted-foreground">
                  {game.description}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>
      {activeGame ? (
        <GameModal
          open={!!activeGame}
          onClose={() => setActiveGame(null)}
          title={activeGame.title}
          description={activeGame.description}
        >
          {activeGame.component}
        </GameModal>
      ) : null}
    </div>
  );
}
