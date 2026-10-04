# Accessibility baseline

Semver Weather’s CLI is plain-text and its generated calendar is static HTML with no scripts or remote assets.

## Implemented baseline

- Semantic `header`, `main`, `section`, `article`, headings, lists, and `footer` landmarks.
- A keyboard-visible skip link and focus outline for scrollable reproduction commands.
- Text classifications and stage statuses so color and weather icons are never the only signal.
- Decorative icons hidden from assistive technology, descriptive article labels, and readable source order.
- High-contrast text, status borders, and code blocks; responsive cards without fixed text sizes.
- Escaped user content and a restrictive content security policy.

## Release checks

Before release, traverse the report using only Tab/Shift+Tab, zoom to 200%, inspect at narrow width, confirm focus visibility, and read the heading/landmark sequence with a screen reader. Check both passing and failing fixtures and verify the report remains meaningful with color removed.

## Known limits

The CLI does not provide interactive prompts or terminal-specific accessibility features. Long argv and logs can require horizontal/region navigation. Automated conformance testing and multiple screen-reader/browser combinations are not yet in CI.

Report accessibility defects with the bug template and prefix the title `accessibility:`. Do not include private project output; use the synthetic demo or a redacted report. Security-sensitive findings belong in the [private advisory form](https://github.com/Akhilesh-Gogikar/semver-weather/security/advisories/new).
