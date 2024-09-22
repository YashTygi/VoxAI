import { SkeletonTheme } from "react-loading-skeleton";

 
export default function Layout({ children }: {children : React.ReactNode}) {
  return (
    <>
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      {children}
    </SkeletonTheme>
    </>
  )
}