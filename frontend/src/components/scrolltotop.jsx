// "use client";

// import { useEffect } from "react";
// import { usePathname } from "next/navigation";

// export default function ScrollToTop({ duration = 1000 }) {
//   const pathname = usePathname();

//   // Custom scroll function
//   const scrollToTop = () => {
//     if (typeof window === "undefined") return;

//     const start = window.scrollY;
//     const startTime = performance.now();

//     const animateScroll = (currentTime) => {
//       const elapsed = currentTime - startTime;
//       const progress = Math.min(elapsed / duration, 1);

//       // Ease-out effect
//       const ease = 1 - Math.pow(1 - progress, 3);

//       window.scrollTo(0, start * (1 - ease));

//       if (progress < 1) {
//         requestAnimationFrame(animateScroll);
//       }
//     };

//     requestAnimationFrame(animateScroll);
//   };

//   useEffect(() => {
//     scrollToTop();
//   }, [pathname]);

//   useEffect(() => {
//     // On first page load (refresh)
//     // setTimeout(() => {
//       scrollToTop();
//     // }, 100);
//   }, []);

//   return null;
// }


// // "use client";

// // import { useEffect } from "react";
// // import { usePathname } from "next/navigation";

// // export default function ScrollToTop({ behavior = "smooth" }) {
// //   const pathname = usePathname();

// //   useEffect(() => {
// //     if (typeof window !== "undefined") {
// //       window.scrollTo({ top: 0, left: 0, behavior });
// //     }
// //   }, [pathname, behavior]);

// //   return null;
// // }