/*
 * Locket premium4 compatibility patch
 * Target: Locket iOS 2.72.1 (not device-verified)
 *
 * This patch ONLY reapplies filter IDs already present in the supplied
 * premium4 Remote Config. It preserves every unrelated Firebase entry.
 * It does NOT implement Photobooth capture/collage, AI models, sticker
 * rendering engines, likeness APIs, or subscription entitlements.
 */
(function () {
  function unchanged() { $done({}); }
  try {
    if (typeof $response === "undefined" || !$response.body) return unchanged();

    var headers = ($request && $request.headers) ? $request.headers : {};
    var ua = headers["User-Agent"] || headers["user-agent"] || "";
    if (ua && ua.indexOf("Locket") === -1) return unchanged();

    var payload = JSON.parse($response.body);
    if (!payload || typeof payload !== "object") return unchanged();
    if (!payload.entries || typeof payload.entries !== "object") payload.entries = {};

    // Existing filter names/IDs copied from the current premium4 source.
    var filters = {
      allows_custom_filters: true,
      show_filter_button: true,
      sheet_enabled: true,
      open_sheet_immediately: true,
      sheet_filters: [
        { title: { en: "Goofy" }, filter_ids: ["okay_wig", "influencer", "looks_maxxing", "toothless", "bye_brows"] },
        { title: { en: "Looks" }, filter_ids: ["bowling_ball", "blonde_bleached", "beard", "bob_cut", "buns", "tatted", "mohawk", "braces", "bye_brows"] },
        { title: { en: "Celebrate" }, filter_ids: ["slimed", "princess", "disco_lights", "cash_money", "happy_birthday"] },
        { title: { en: "Cute" }, filter_ids: ["cutesy", "sticker_face", "flower_crown", "love_bug"] },
        { title: { en: "Costumes" }, filter_ids: ["wedding", "cowboy_cowgirl", "giraffe", "clown"] },
        { title: { en: "Holidays" }, filter_ids: ["easter_bunney_cutout", "easter_chick_cutout", "bearded", "leprechaun", "lucky_face", "sweet_hearts", "elf_cutout", "santa_cutout", "frosty"] }
      ],
      picker_filters: [
        "okay_wig", "influencer", "looks_maxxing", "toothless", "bye_brows",
        "bowling_ball", "blonde_bleached", "beard", "bob_cut", "buns", "tatted", "mohawk", "braces",
        "slimed", "princess", "disco_lights", "cash_money", "happy_birthday", "cutesy", "sticker_face",
        "flower_crown", "love_bug", "wedding", "cowboy_cowgirl", "giraffe", "clown",
        "easter_bunney_cutout", "easter_chick_cutout", "bearded", "leprechaun", "lucky_face",
        "sweet_hearts", "elf_cutout", "santa_cutout", "frosty"
      ]
    };

    payload.entries.camera_filter_config = JSON.stringify(filters);
    $done({ body: JSON.stringify(payload) });
  } catch (e) {
    // Fail open: never block Locket if response format changes.
    unchanged();
  }
})();
