import { HeroText } from "@/components/landing/HeroText.tsx";
import { HeroOrbit } from "@/components/landing/HeroOrbit.tsx";

export function Hero() {
  return (
    <section
      className="
        app-container
        relative isolate
        grid
        min-h-140
        overflow-hidden
        pt-14

        sm:min-h-155

        lg:min-h-[calc(100dvh-3.5rem)]
        lg:grid-cols-[minmax(0,1fr)_minmax(400px,1fr)]
        lg:items-center
        lg:gap-8
        lg:overflow-visible

        xl:grid-cols-2
        xl:gap-12
      "
    >
      <div
        className="
          relative z-20
          flex items-center
          py-16

          sm:px-6
          sm:py-20

          md:px-10

          lg:px-0
          lg:py-0
        "
      >
        <HeroText />
      </div>

      <div
        className="
          pointer-events-none
          absolute
          -right-[380px]
          -top-[220px]
          z-0
          w-[760px]
          opacity-40

          sm:-right-[360px]
          sm:-top-[270px]
          sm:w-[880px]
          sm:opacity-50

          md:-right-[300px]
          md:-top-[300px]
          md:w-[960px]
          md:opacity-60

          lg:pointer-events-auto
          lg:relative
          lg:right-auto
          lg:top-auto
          lg:z-10
          lg:w-full
          lg:max-w-[450px]
          lg:justify-self-end
          lg:opacity-100

          xl:max-w-[500px]

          2xl:max-w-[560px]
        "
      >
        <HeroOrbit size={960} />
      </div>
    </section>
  );
}
