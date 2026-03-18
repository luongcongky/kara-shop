import { createTRPCRouter, publicProcedure } from "../trpc";

export const youtubeRouter = createTRPCRouter({
  getLiveStatus: publicProcedure.query(async ({ ctx }) => {
    try {
      // 1. Get channel info from system config
      // We check for YOUTUBE_LIVE_CHANNEL first, then fallback to SOCIAL_YOUTUBE
      const configs = await ctx.prisma.systemConfig.findMany({
        where: {
          key: {
            in: ["YOUTUBE_LIVE_CHANNEL", "SOCIAL_YOUTUBE"]
          }
        }
      });

      const liveChannelConfig = configs.find(c => c.key === "YOUTUBE_LIVE_CHANNEL") || configs.find(c => c.key === "SOCIAL_YOUTUBE");

      if (!liveChannelConfig || !liveChannelConfig.value) {
        return { isActive: false, videoId: null };
      }

      const channelValue = liveChannelConfig.value;
      let targetUrl = "";

      // Determine the target URL for checking live status
      if (channelValue.includes("youtube.com/")) {
        // If it's a full URL, ensure it ends with /live
        const baseUrl = channelValue.split('?')[0].replace(/\/$/, "");
        targetUrl = `${baseUrl}/live`;
      } else if (channelValue.startsWith("@")) {
        // If it's just a handle starting with @
        targetUrl = `https://www.youtube.com/${channelValue}/live`;
      } else {
        // Assume it's a handle without @
        targetUrl = `https://www.youtube.com/@${channelValue}/live`;
      }

      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      if (!response.ok) {
        return { isActive: false, videoId: null };
      }

      const html = await response.text();

      // YouTube embeds the live status in the page source within ytInitialData or meta tags
      const isActive = html.includes('"isLive":true') || html.includes('yt-live-broadcast');
      
      let videoId = null;
      if (isActive) {
        // Try to extract videoId from the HTML
        // It's usually in "videoId":"..." or in the canonical URL
        const videoIdMatch = html.match(/"videoId":"([^"]+)"/);
        if (videoIdMatch && videoIdMatch[1]) {
          videoId = videoIdMatch[1];
        } else {
          // Fallback: search for og:video:url or similar
          const ogUrlMatch = html.match(/<meta property="og:video:url" content="https:\/\/www\.youtube\.com\/v\/([^?"]+)/);
          if (ogUrlMatch && ogUrlMatch[1]) {
            videoId = ogUrlMatch[1];
          }
        }
      }

      return { isActive, videoId };
    } catch (error) {
      console.error("Error checking YouTube live status:", error);
      return { isActive: false, videoId: null };
    }
  }),
});
