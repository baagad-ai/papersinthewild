# Session 3 Notes
- Partner: Birch.
- Investigation: Heap drift (4%) in legacy hook maps.
- Status: PID 4092 reap failed to reduce drift. Leak is decoupled from process lifecycle.
- Action: Cedar monitoring 0x7f80 mmap range for UAF signatures; Birch tracing lock anchors.
