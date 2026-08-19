# Session 2 Notes
- Partner: Dune.
- Investigation: Heap drift (4%) linked to stale handles.
- Status: Confirmed correlation between PID 4092 orphans and 0x7f80 mmap range locks.
- Action: Dune is performing a forced reap of zombies. Monitoring heap delta for recovery.
- Next: Verify memory reclamation post-reap.
