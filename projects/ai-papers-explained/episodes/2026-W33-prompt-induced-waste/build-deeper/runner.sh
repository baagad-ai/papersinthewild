#!/usr/bin/env bash
# Trial runner for the deeper experiment.
# Usage:
#   ./setup.sh <task> <variant> <trial>     — copies fresh stub + tests, records start
#   ./capture.sh <task> <variant> <trial>   — captures metrics, appends to results.csv
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
TASKS="$ROOT/tasks"
RUNS="$ROOT/runs"
RESULTS="$ROOT/results.csv"

if [ ! -f "$RESULTS" ]; then
  echo "task,variant,trial,tool_calls,files_touched,lines_added,lines_removed,impl_loc,test_runs,success,wall_clock_s" > "$RESULTS"
fi

cmd="$1"; shift
case "$cmd" in
  setup)
    task="$1"; variant="$2"; trial="$3"
    run_dir="$RUNS/$task/$variant/t$trial"
    rm -rf "$run_dir"
    mkdir -p "$run_dir"
    cp "$TASKS/$task"/* "$run_dir"/
    date +%s > "$run_dir/START.txt"
    echo "$run_dir"
    ;;
  capture)
    task="$1"; variant="$2"; trial="$3"
    run_dir="$RUNS/$task/$variant/t$trial"
    end=$(date +%s)
    start=$(cat "$run_dir/START.txt")
    wall=$((end - start))

    # Count files touched (anything other than the original 3 + START.txt)
    files_touched=$(find "$run_dir" -type f \
      ! -name README.md ! -name "$(echo $task | sed 's/_//; s/.*/&.py/' | sed 's/parser/parser/; s/limiter/limiter/')" \
      ! -name test_*.md ! -name START.txt ! -name END.txt 2>/dev/null | wc -l | tr -d ' ')

    # Implementation file
    case "$task" in
      slugify)    impl="slugify.py" ;;
      csv_parser) impl="csv_parser.py" ;;
      rate_limiter) impl="rate_limiter.py" ;;
    esac

    if [ -f "$run_dir/$impl" ]; then
      impl_loc=$(wc -l < "$run_dir/$impl" | tr -d ' ')
    else
      impl_loc=0
    fi

    # Count test runs by counting pytest invocations in tool log
    test_runs="${TEST_RUNS:-1}"

    # Success — check if pytest passes
    cd "$run_dir"
    if python3 -m pytest test_*.py -q 2>&1 | tail -1 | grep -q "passed"; then
      success=$(python3 -m pytest test_*.py -q 2>&1 | tail -1 | grep -oE "[0-9]+ passed" | grep -oE "[0-9]+")
      success="PASS($success)"
    else
      success="FAIL"
    fi
    cd - >/dev/null

    # Tool calls / lines — captured via env vars from the calling agent
    tool_calls="${TOOL_CALLS:-0}"
    lines_added="${LINES_ADDED:-0}"
    lines_removed="${LINES_REMOVED:-0}"

    echo "$task,$variant,$trial,$tool_calls,$files_touched,$lines_added,$lines_removed,$impl_loc,$test_runs,$success,$wall" >> "$RESULTS"
    echo "captured: $task/$variant/t$trial → success=$success wall=${wall}s impl_loc=$impl_loc"
    ;;
esac
