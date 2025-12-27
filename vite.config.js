// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react'

// // export default defineConfig({
// //   plugins: [react()],
// //   server: {
// //     port: 3003
// //   }
// // })

// // import { defineConfig } from "vite";
// // import react from "@vitejs/plugin-react";
// // import path from "path";

// // export default defineConfig({
// //   plugins: [react()],
// //   resolve: {
// //     alias: {
// //       "@t-shirt/shared": path.resolve(__dirname, "../shared/src"),
// //     },
// //   },
// //   server: {
// //     port: 3003,
// //   },
// // });

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@t-shirt/shared": path.resolve(__dirname, "../shared/src"),
//     },
//   },
//   server: {
//     port: 3003,
//     fs: {
//       // ✅ Allow access to the shared folder above this project
//       allow: [".."],
//     },
//   },
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@t-shirt/shared": path.resolve(__dirname, "../shared/src"),
      "@admin": path.resolve(__dirname, "../admin-app/src/"),
    },
  },
  server: {
    host: "doktari.lvh.me", // 👈 allows access via subdomain
    port: 3002, // 👈 match your intended domain
    open: true, // 👈 automatically open browser
    fs: {
      allow: [".."], // ✅ still allow shared folder
    },
  },
});
