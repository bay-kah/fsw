import { UserAuthForm } from "@/components/auth/AuthForm";
import { ThemeProvider } from "@/context/theme-provider";
import "@/utils/i18n";
import { LanguageProvider } from "@/context/language-provider";

function LoginPage() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="frigate-ui-theme">
      <LanguageProvider>
        <div className="relative w-screen h-screen overflow-hidden">
          {/* Abstract Background */}
          <div className="absolute inset-0 z-0 opacity-40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              className="w-full h-full object-cover"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                {/* Abstract gradient */}
                <radialGradient id="abstractGradient" cx="50%" cy="50%" r="80%">
                  <stop offset="0%" stopColor="#111" />
                  <stop offset="50%" stopColor="#1a1a1a" />
                  <stop offset="100%" stopColor="#000" />
                </radialGradient>

                {/* Noise overlay */}
                <filter id="noiseFilter">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.8"
                    numOctaves="3"
                    stitchTiles="stitch"
                  />
                  <feColorMatrix type="saturate" values="0" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.08" />
                  </feComponentTransfer>
                </filter>
              </defs>

              {/* Gradient fill */}
              <rect width="100%" height="100%" fill="url(#abstractGradient)" />
              {/* Noise overlay */}
              <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>
          </div>

          {/* Main content */}
          <div className="relative z-10 p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col items-center space-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 500 360"
                  role="img"
                  aria-label="SenseWatchNVR Logo"
                  className="mb-8 h-72 w-full fill-current max-w-none max-h-none"
                >
                  <defs>
                    <style>
                      {`
                        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800;900&display=swap');
                        .brand-logo {
                          font-family: 'Orbitron', 'Impact', 'Arial Black', sans-serif;
                          font-weight: 900;
                          font-size: 48px;
                          letter-spacing: 1px;
                          text-anchor: middle;
                          dominant-baseline: middle;
                        }
                        .brand-nvr {
                          font-family: 'Orbitron', 'Impact', 'Arial Black', sans-serif;
                          font-weight: 900;
                          font-size: 115px;
                          letter-spacing: 8px;
                          text-anchor: middle;
                          dominant-baseline: middle;
                        }
                        .green-part {
                          fill: #00FF88;
                          filter: drop-shadow(0 0 12px rgba(0, 255, 136, 0.4));
                        }
                        .white-part {
                          fill: #FFFFFF;
                          filter: drop-shadow(0 0 16px rgba(255, 255, 255, 0.3));
                          stroke: #00FF88;
                          stroke-width: 2;
                        }
                      `}
                    </style>
                  </defs>

                  {/* Monitor */}
                  <g transform="translate(125, 10)">
                    <rect
                      x="0"
                      y="0"
                      width="250"
                      height="160"
                      rx="20"
                      fill="#2a2d31"
                      stroke="#3a3d41"
                      strokeWidth="2"
                    />
                    <rect x="10" y="10" width="230" height="140" rx="8" fill="#111315" />
                    <rect x="105" y="160" width="40" height="15" rx="4" fill="#2a2d31" />
                    <rect x="85" y="175" width="80" height="12" rx="6" fill="#2a2d31" />

                    {/* 2x2 Grid */}
                    <g transform="translate(20, 20)">
                      <rect x="0" y="0" width="100" height="60" rx="4" fill="#222529" />
                      <rect x="110" y="0" width="100" height="60" rx="4" fill="#222529" />
                      <rect x="0" y="70" width="100" height="60" rx="4" fill="#222529" />
                      <rect x="110" y="70" width="100" height="60" rx="4" fill="#222529" />

                      <rect
                        x="110"
                        y="0"
                        width="100"
                        height="60"
                        rx="4"
                        fill="none"
                        stroke="#00FF88"
                        strokeWidth="3"
                      />
                      <rect
                        x="0"
                        y="70"
                        width="100"
                        height="60"
                        rx="4"
                        fill="none"
                        stroke="#00FF88"
                        strokeWidth="3"
                      />

                      <g transform="translate(25, 15)" fill="#8f949b">
                        <rect x="8" y="20" width="8" height="20" rx="2" />
                        <rect x="20" y="15" width="35" height="15" rx="4" />
                        <circle cx="50" cy="22" r="4" fill="#00FF88" />
                      </g>
                      <g transform="translate(130, 15)" fill="#8f949b">
                        <circle cx="15" cy="12" r="6" />
                        <rect x="10" y="20" width="10" height="20" rx="3" />
                        <circle cx="35" cy="12" r="6" />
                        <rect x="30" y="20" width="10" height="20" rx="3" />
                      </g>
                      <g transform="translate(25, 85)" fill="#8f949b">
                        <circle cx="20" cy="8" r="5" />
                        <path d="M15 15 Q10 20 15 35 L25 35 Q30 20 25 15 Z" />
                        <rect x="35" y="20" width="15" height="15" rx="2" />
                      </g>
                      <g transform="translate(135, 85)" fill="#8f949b">
                        <rect x="15" y="5" width="25" height="40" rx="2" />
                        <circle cx="35" cy="25" r="2" fill="#111315" />
                      </g>
                    </g>
                  </g>

                  {/* Text */}
                  <text x="250" y="230" className="brand-logo green-part">
                    SenseWatch
                  </text>
                  <text x="250" y="330" className="brand-nvr white-part">
                    NVR
                  </text>
                </svg>
              </div>
              <UserAuthForm />
            </div>
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default LoginPage;
