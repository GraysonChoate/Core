# Core · Round 6 (Home + Schedule + Me, XGT first)

Open `index.html` in Chrome. Phone on the left, demo bar on the right.
If a browser blocks local files: run `python3 -m http.server 8771` in this folder, open `http://localhost:8771/index.html`.
Brand: XGT is the default. Others still work with `?brand=usapt|dark|light`.

## What is new
1. **Schedule tab.** Upcoming chips · Classes | 1:1 · week strip (tap a day) · filter chips · "Your usual" first, then all classes · tap a row = class sheet (Book / Join waitlist / Cancel). "All bookings" = Upcoming / Past / Waitlist / Canceled. Sunday = "No classes" state. Booking Power 60 here keeps the Home Now card in step.
2. **Me tab.** Initials, name, week ring + classes left + renew date (tap = Progress) · list: Membership, Payments, Profile details, Documents, Refer friends, Settings, Log out · bell = Notifications + inbox in one list (Maya's reply opens Message staff).
3. **Progress.** Ring flies up from Home or Me. This week / month / all time · October calendar · weekly goal – / + (updates Home and Me) · milestones · recent, each with Share.
4. **Check-in now lands on Home:** ring goes 2/3 → 3/3, "Goal reached". Discharge text lands at ~0.55 s.
5. **Review fixes on Home:** key button pinned (stays on scroll), no overlapping hit areas, every control 44 high, brighter sheets, no blur on inline cards, orb never below 82%, status bar fade solid, "Join" is a real button, 12 px floor on labels.

## Open
- Member photo: none. Initials stand in.
- Sub-screens behind Me rows (Membership, Payments, ...) show a toast. New look only, same fields: next round.
- Month view (tap "October") is a toast.
- Friends on classes, crowd at class time, and the Me bell are Proposals.
- Type: promo title 20 px, labels 12 px, all px (no 200% text yet). Color lift targets 3:1.
- Not tested on a real phone.

## URL options
`?state=next|here|recap|monthly|none|usual|checkin|scan|milestone|class|class-full|promo|crowd|story|ring|orb-*|tab-schedule|tab-me|sch-class|sch-full|sch-empty|sch-one|sch-bookings|me-inbox|me-progress` · `?name=long` · `?bar=0` · `?rm=1`

## Notes
Code only. No Higgsfield. Zero credits. Motion = transform and opacity only. Nothing animates at rest.

## Motion pass (added after Round 6)
Same build, same files. Only `app.js` and `app.css` changed.
- **Tabs:** the new screen slides in 24px from the side you tapped (and fades). The old one slides out the other way.
- **Day change:** the day pill slides to the new day. The old list slides out, the new rows slide in (30ms stagger, max 5).
- **Filter chips:** the highlight fades. Rows slide up 8px.
- **Pills (Classes/1:1, Progress, Bookings):** one pill slides between options. Content slides in from the matching side.
- **Book button:** label swaps with a short rise, button pops, green fades in. The status pill on the row pops when the sheet closes.
- **Credits (Me):** the number rolls and the bar eases when you open Me after booking or canceling. No count-up.
- **Home Now card:** if a booking changed it, the card rises in when you return to Home.
- **Progress:** the ring lands and glows once. Then pill, stats, goal, calendar, check dots and milestones build in. Close slides the body down while the ring flies back.
- **Sheets:** close ~15% faster than open (300 vs 350ms).
- **Reduce Motion:** no sliding. Fades only, pills jump.
- Only transform and opacity move. Nothing loops at rest. Max one glow per event.
- Backup of the build before this pass: `_backup/home-r6-before-motion/` (cloud only).
