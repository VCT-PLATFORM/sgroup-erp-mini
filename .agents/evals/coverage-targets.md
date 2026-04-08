# Eval: Coverage Targets (V15)

## Gates
  CRITICAL ≥90%: auth, finance, belt-ranks, tournament-scoring, RBAC
  STANDARD ≥70%: CRUD, transformations, validations, API formatting
  UI COMPONENTS ≥60%: @vct/ui

## Commands
  Frontend: npx vitest run --coverage
  Backend:  go test ./... -coverprofile=coverage.out -count=1

## Rules
  New code must NOT decrease total coverage
  Critical modules must test: happy path + error path + boundary + auth
  Every bug fix must include regression test
  Flaky tests = SEV3 (fix immediately)
