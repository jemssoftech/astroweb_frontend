import fs from "fs";
import path from "path";
import archiver from "archiver";

// Paths
const standaloneDir = path.resolve(".next/standalone");
const zipName = "astrology-landing-page.zip";
const destination = "D:\\jemsoftech\\clientbase\\astro\\original";
const zipPath = path.join(destination, zipName);

// Ensure destination exists
if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination, { recursive: true });
}

// Copy .next/static (REQUIRED)
const staticSrc = path.resolve(".next/static");
const staticDest = path.join(standaloneDir, ".next", "static");

if (!fs.existsSync(staticDest)) {
  fs.mkdirSync(staticDest, { recursive: true });
}

if (fs.existsSync(staticSrc)) {
  fs.cpSync(staticSrc, staticDest, { recursive: true });
  console.log("✅ Copied .next/static");
}

// ❌ SKIP .next/cache - Not needed for deployment, saves 100s of MBs!
console.log("⏭️  Skipping .next/cache (not needed, saves space)");

// Copy public folder
const publicSrc = path.resolve("public");
const publicDest = path.join(standaloneDir, "public");

if (fs.existsSync(publicSrc) && !fs.existsSync(publicDest)) {
  fs.cpSync(publicSrc, publicDest, { recursive: true });
  console.log("✅ Copied public folder");
}

// Copy ecosystem.config.js
const ecosystemSrc = path.resolve("ecosystem.config.js");
const ecosystemDest = path.join(standaloneDir, "ecosystem.config.js");

if (fs.existsSync(ecosystemSrc)) {
  fs.copyFileSync(ecosystemSrc, ecosystemDest);
  console.log("✅ Copied ecosystem.config.js");
}

// Copy .env
const envSrc = path.resolve(".env.local");
const envDest = path.join(standaloneDir, ".env.local");

if (fs.existsSync(envSrc)) {
  fs.copyFileSync(envSrc, envDest);
  console.log("✅ Copied .env.local");
}

// Delete unnecessary files before zipping
function cleanupBeforeZip(dir) {
  const filesToDelete = [];

  function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);

    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // Skip cache directories
        if (file === "cache" && currentPath.includes(".next")) {
          filesToDelete.push(filePath);
          continue;
        }
        walkDir(filePath);
      } else {
        // Delete source maps and unnecessary files
        if (
          file.endsWith(".map") ||
          file === "README.md" ||
          file === "CHANGELOG.md" ||
          file === "LICENSE" ||
          file === ".DS_Store" ||
          file === "Thumbs.db" ||
          file.endsWith(".d.ts") ||
          file.endsWith(".md")
        ) {
          filesToDelete.push(filePath);
        }
      }
    }
  }

  walkDir(dir);

  let savedSize = 0;
  for (const file of filesToDelete) {
    try {
      const stat = fs.statSync(file);
      if (stat.isDirectory()) {
        fs.rmSync(file, { recursive: true, force: true });
      } else {
        savedSize += stat.size;
        fs.unlinkSync(file);
      }
    } catch (e) {
      // Ignore errors
    }
  }

  console.log(
    `🧹 Cleaned ${filesToDelete.length} unnecessary files (saved ~${(savedSize / 1024 / 1024).toFixed(2)} MB)`,
  );
}

// Create zip with better compression
async function createOptimizedZip() {
  return new Promise((resolve, reject) => {
    // Remove old zip
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }

    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Maximum compression
    });

    output.on("close", () => {
      const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(`\n✅ Zip created: ${sizeMB} MB`);
      resolve();
    });

    archive.on("error", reject);
    archive.on("warning", (err) => {
      if (err.code !== "ENOENT") {
        console.warn("Warning:", err);
      }
    });

    archive.pipe(output);

    // Add files with exclusions
    archive.glob("**/*", {
      cwd: standaloneDir,
      ignore: [
        "**/cache/**", // Skip all cache
        "**/*.map", // Skip source maps
        "**/*.d.ts", // Skip TypeScript definitions
        "**/README.md", // Skip readme files
        "**/CHANGELOG.md",
        "**/LICENSE",
        "**/.DS_Store",
        "**/Thumbs.db",
        "**/test/**", // Skip test folders
        "**/tests/**",
        "**/__tests__/**",
        "**/docs/**", // Skip docs
        "**/*.md", // Skip all markdown
        "**/example/**", // Skip examples
        "**/examples/**",
      ],
      dot: true,
    });

    archive.finalize();
  });
}

(async () => {
  try {
    console.log("\n📦 Starting optimized build packaging...\n");

    // Clean unnecessary files
    console.log("🧹 Cleaning unnecessary files...");
    cleanupBeforeZip(standaloneDir);

    // Create optimized zip
    console.log("\n📦 Creating compressed zip (level 9)...");
    await createOptimizedZip();

    console.log(`\n📍 Output: ${zipPath}`);
    console.log("\n📋 Included:");
    console.log("   ├── server.js");
    console.log("   ├── node_modules/ (optimized)");
    console.log("   ├── .next/static/");
    console.log("   ├── public/");
    console.log("   ├── ecosystem.config.js");
    console.log("   └── .env");
    console.log("\n❌ Excluded (to save space):");
    console.log("   ├── .next/cache/");
    console.log("   ├── *.map files");
    console.log("   ├── *.d.ts files");
    console.log("   └── README, LICENSE, docs");
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
