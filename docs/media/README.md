# Hasanah Gold coastal editorial film

The brand section uses original coastal fashion artwork animated in EffectCraft 0.24.1, replacing the dark satin jewellery loop. The visible "Visual AI untuk inspirasi, bukan stok kedai" caption was removed at the user's request.

The film is an eight-second, silent 1920 x 1080 H.264 loop at 24 fps. Camera drift, a breathing zoom and a subtle exposure cycle return to their opening values at eight seconds. This is an animated AI-generated still, not live footage or generated body movement. It does not establish actual store inventory, staff or customers.

## Reference and direction

Reference: https://cartelle-template.framer.website/ . Its editorial background is a seven-second, 2048 x 1080 clip at 25 fps. The transferable choices are natural surroundings, cream clothing, muted warm colours, a single unhurried shot and space for HTML text. No Cartelle imagery is shipped with the website.

rea-video analysis and visual review: `../../.qa/brand-film-refresh/reference-analysis/`. The automated detector classified the reference as a moving still, but sampled frames show the parasol changing orientation and the subject's pose changing. The review records this disagreement; the reference's production method remains uncertain. Our treatment uses a known animated-still workflow rather than claiming to reproduce human motion.

## Source and output

- `effectcraft/coastal-editorial.png`: original built-in imagegen artwork, created 17 November 2026; an adult woman in ivory linen and a taupe hijab with subtle gold jewellery against coastal grasses.
- `effectcraft/render.mjs`: reproducible composition and render script.
- `effectcraft/composition.json`: generated EffectCraft commands; rerunning the script resolves paths for the current checkout.
- `effectcraft/coastal-editorial.ecproj`: editable native EffectCraft project.
- `effectcraft/master.mp4`: EffectCraft master before web compression.
- `../../public/videos/hasanah-gold-coastal-film.mp4`: web film, compressed by FFmpeg with CRF 24 and fast-start metadata.
- `../../public/images/coastal-film-poster.webp`: opening-frame poster.

The old video and poster are archived under `../../.qa/brand-film-refresh/` as `previous-brand-film.mp4` and `previous-poster.webp`. The old `hyperframes/` composition and `brand-film-generation.json` are historical, not the current pipeline. The recorded fal request was blocked by exhausted credits; this replacement used no paid video-generation service.

## Re-render

From the project root: `node docs/media/effectcraft/render.mjs`. The script uses the installed Windows EffectCraft CLI and FFmpeg. Set `EFFECTCRAFT_CLI` and `FFMPEG_PATH` if installed elsewhere. Use `--preview` to generate only the project and poster PNG.

The player remains muted and inline, pauses offscreen and when the page is hidden, respects reduced motion and shows the poster if loading fails. Text stays in accessible HTML. Checks: `node tests/brand-film.mjs` and `node tests/brand-film-playback.mjs`; the latter expects a production preview on port 4173, or `TEST_URL`.
