type Props = {
  size?: number;
};

const ratios = [1, 0.8, 0.6, 0.4, 0.2];
const opacities = [0.1, 0.3, 0.5, 0.8, 1];

export function Logo({ size = 40 }: Props) {
  return (
    <div
      className="relative transition-all duration-200 ease-linear"
      style={{ width: size, height: size }}
    >
      {ratios.map((ratio, index) => {
        const circleSize = size * ratio;

        return (
          <div
            key={ratio}
            className="absolute left-1/2 top-1/2 rounded-full bg-primary dark:bg-emerald-500 transition-all duration-200 ease-linear dark:bg-emerald-500"
            style={{
              width: circleSize,
              height: circleSize,
              opacity: opacities[index],
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </div>
  );
}
