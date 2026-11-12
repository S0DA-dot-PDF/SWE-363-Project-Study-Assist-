#!/usr/bin/env bash
# Creates one GitHub issue per page (41 total), assigned per the team's division.
# Usage (from the repository folder, in Git Bash):
#   1. Replace the four usernames below.
#   2. Preview:  DRY_RUN=1 bash create_issues.sh
#   3. Create:   bash create_issues.sh
# Safe to re-run: issues whose title already exists are skipped.

set -euo pipefail

# ---- 1. GitHub usernames (edit these) ---------------------------------------
MEMBER1="ZainabAlzayer10"    # Zainab: PUB-01..06, SHR-01..04, ADM-01    (11 pages)
MEMBER2="juana300"           # Juana:  LIB-01..06, STU-01..02, ADM-02    (9 pages)
MEMBER3="Layan-Alshanbari"   # Layan:  QZ-01..07, EDU-01..02, ADM-03..04 (11 pages)
MEMBER4="@me"                # Jude:   FC-01..04, LIVE-01..06            (10 pages) - "@me" = whoever runs the script
# -----------------------------------------------------------------------------

DRY_RUN="${DRY_RUN:-0}"

run() {
  if [ "$DRY_RUN" = "1" ]; then { printf 'DRY RUN:'; printf ' %q' "$@"; echo; } >&2; else "$@"; fi
}

# ---- 2. Labels --------------------------------------------------------------
LABELS="page:5319E7 public:1D76DB shared:0E8A16 library:FBCA04 quiz:D93F0B flashcards:C5DEF5 live:B60205 student:006B75 educator:5319E7 admin:000000"
for entry in $LABELS; do
  name="${entry%%:*}"; color="${entry##*:}"
  run gh label create "$name" --color "$color" --force >/dev/null
done

# ---- 3. Pages: ID | file | folder | owner | area label | note ----------------
PAGES=$(cat <<'EOF'
PUB-01|Landing.jsx|public|M1|public|
PUB-02|Login.jsx|public|M1|public|Includes the invalid-credentials error state.
PUB-03|SignUp.jsx|public|M1|public|
PUB-04|VerifyEmail.jsx|public|M1|public|
PUB-05|ResetPassword.jsx|public|M1|public|
PUB-06|NotFound.jsx|public|M1|public|
SHR-01|Dashboard.jsx|user/shared|M1|shared|
SHR-02|Profile.jsx|user/shared|M1|shared|
SHR-03|Comments.jsx|user/shared|M1|shared|
SHR-04|ReportProblem.jsx|user/shared|M1|shared|
ADM-01|AdminDashboard.jsx|admin|M1|admin|
LIB-01|MyLibraries.jsx|user/library|M2|library|
LIB-02|JoinLibrary.jsx|user/library|M2|library|
LIB-03|CreateLibrary.jsx|user/library|M2|library|
LIB-04|LibraryDetails.jsx|user/library|M2|library|
LIB-05|UploadMaterial.jsx|user/library|M2|library|
LIB-06|CreateMenu.jsx|user/library|M2|library|
STU-01|AISummaries.jsx|user/student|M2|student|
STU-02|MyQuizzes.jsx|user/student|M2|student|
ADM-02|UserManagement.jsx|admin|M2|admin|
QZ-01|CreateQuiz.jsx|user/quiz|M3|quiz|
QZ-02|GeneratingQuiz.jsx|user/quiz|M3|quiz|
QZ-03|QuestionEditor.jsx|user/quiz|M3|quiz|
QZ-04|QuizPreview.jsx|user/quiz|M3|quiz|
QZ-05|QuizDetails.jsx|user/quiz|M3|quiz|
QZ-06|QuizPlay.jsx|user/quiz|M3|quiz|
QZ-07|QuizResults.jsx|user/quiz|M3|quiz|
EDU-01|PublishQuiz.jsx|user/educator|M3|educator|
EDU-02|Analytics.jsx|user/educator|M3|educator|
ADM-03|SupportTickets.jsx|admin|M3|admin|
ADM-04|Advertisements.jsx|admin|M3|admin|
FC-01|CreateFlashcards.jsx|user/flashcards|M4|flashcards|
FC-02|GeneratingFlashcards.jsx|user/flashcards|M4|flashcards|
FC-03|FlashcardSetDetails.jsx|user/flashcards|M4|flashcards|
FC-04|StudyFlashcards.jsx|user/flashcards|M4|flashcards|
LIVE-01|JoinMatch.jsx|user/live|M4|live|
LIVE-02|WaitingRoom.jsx|user/live|M4|live|
LIVE-03|LiveQuestion.jsx|user/live|M4|live|
LIVE-04|Leaderboard.jsx|user/live|M4|live|
LIVE-05|HostLobby.jsx|user/live|M4|live|Educator-only page.
LIVE-06|HostQuestion.jsx|user/live|M4|live|Educator-only page.
EOF
)

# ---- 4. Create issues --------------------------------------------------------
created=0; skipped=0
while IFS='|' read -r id file folder owner area note; do
  [ -z "$id" ] && continue
  case "$owner" in
    M1) assignee="$MEMBER1" ;; M2) assignee="$MEMBER2" ;;
    M3) assignee="$MEMBER3" ;; M4) assignee="$MEMBER4" ;;
  esac
  title="[$id] ${file%.jsx}"

  if [ "$DRY_RUN" != "1" ]; then
    existing=$(gh issue list --state all --limit 200 --json title --jq ".[] | select(.title == \"$title\") | .title")
    if [ -n "$existing" ]; then echo "Skip (exists): $title"; skipped=$((skipped+1)); continue; fi
  fi

  body="**Page:** \`$id\`
**File:** \`src/pages/$folder/$file\`
${note:+**Note:** $note
}
**Done when:**
- [ ] Page renders at its route in \`src/routes.jsx\`
- [ ] Error, Empty, Loading and Success states match the 01-K checklist
- [ ] Data read only through \`src/data/index.js\`
- [ ] Styles in \`${file%.jsx}.module.css\`; colours and spacing from \`tokens.css\` only
- [ ] Pull request links this issue with \`Closes #<issue number>\`"

  run gh issue create --title "$title" --assignee "$assignee" --label "page,$area" --body "$body" >/dev/null
  echo "Created: $title -> $assignee"
  created=$((created+1))
done <<< "$PAGES"

echo "Done. Created: $created  Skipped: $skipped"