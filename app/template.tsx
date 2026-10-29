/* Re-mounts on every page change, so each new page fades in softly while the 3D scene
   (in the layout) stays in place and glides to its new position. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
