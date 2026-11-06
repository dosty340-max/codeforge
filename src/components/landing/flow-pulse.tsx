export function Pulse({ path, begin = 0, back = false }: { path: string; begin?: number; back?: boolean }) {
  return (
    <circle r={back ? 3 : 4} opacity={0} className={`motion-reduce:hidden ${back ? "fill-foreground" : "fill-lime"}`}>
      <set attributeName="opacity" to="1" begin={`${begin}s`} />
      <animateMotion
        dur="3.2s"
        begin={`${begin}s`}
        repeatCount="indefinite"
        path={path}
        {...(back && { keyPoints: "1;0", keyTimes: "0;1", calcMode: "linear" })}
      />
    </circle>
  );
}
