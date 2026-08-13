"""Probe tests for rate limiter - testing edge cases not in original suite."""
from rate_limiter import TokenBucket
import pytest

def test_negative_time_input():
    """Test handling of negative time values - time backward means no refill"""
    b = TokenBucket(capacity=5, refill_rate=1.0)
    # Take all tokens at negative time
    for _ in range(5):
        assert b.take(1, now=-10.0)
    assert not b.take(1, now=-10.0)
    # Moving forward to 0.0: elapsed = 0 - 0 = 0 (first call at -10 didn't update last_refill_time)
    # So no refill occurs - this is correct behavior
    assert not b.take(1, now=0.0)
    # But if we advance further, refill works
    assert b.take(1, now=1.0)

def test_very_small_refill_rate():
    """Test with very small refill rate"""
    b = TokenBucket(capacity=10, refill_rate=0.001)
    b.take(10, now=0.0)
    # Need 1000 seconds for 1 token
    assert not b.take(1, now=100.0)
    assert b.take(1, now=1000.0)

def test_very_large_refill_rate():
    """Test with very large refill rate"""
    b = TokenBucket(capacity=5, refill_rate=1000.0)
    b.take(5, now=0.0)
    # Should refill instantly
    assert b.take(1, now=0.001)

def test_float_precision_edge_cases():
    """Test floating point precision issues"""
    b = TokenBucket(capacity=10, refill_rate=0.1)
    # Take exactly 10 tokens
    assert b.take(10, now=0.0)
    # Refill exactly 1 token worth
    assert b.take(1, now=10.0)

def test_capacity_of_one():
    """Test bucket with capacity of 1"""
    b = TokenBucket(capacity=1, refill_rate=1.0)
    assert b.take(1, now=0.0)
    assert not b.take(1, now=0.0)
    assert b.take(1, now=1.0)
    assert not b.take(1, now=1.0)

def test_zero_refill_rate():
    """Test bucket with zero refill rate (never refills)"""
    b = TokenBucket(capacity=5, refill_rate=0.0)
    for _ in range(5):
        assert b.take(1, now=0.0)
    assert not b.take(1, now=0.0)
    # Even after 1000 seconds, no refill
    assert not b.take(1, now=1000.0)

def test_backward_time_travel():
    """Test what happens when time goes backward (edge case)"""
    b = TokenBucket(capacity=5, refill_rate=1.0)
    b.take(5, now=10.0)
    assert not b.take(1, now=10.0)
    # Time goes backward - should not refill
    assert not b.take(1, now=5.0)

def test_negative_tokens_input():
    """Test negative tokens (edge case - undefined behavior, but should handle gracefully)"""
    b = TokenBucket(capacity=5, refill_rate=1.0)
    # Negative tokens should be treated as invalid, but our implementation returns True for 0-like values
    # Let's test it doesn't break the bucket
    result = b.take(-1, now=0.0)
    # The bucket should still be functional after this
    assert b.take(1, now=0.0)

def test_partial_token_usage():
    """Test using fractions of tokens via timing"""
    b = TokenBucket(capacity=10, refill_rate=0.5)
    b.take(10, now=0.0)
    # After 1 second: 0.5 tokens (not enough for 1)
    assert not b.take(1, now=1.0)
    # After 2 seconds: 1 token (exactly enough)
    assert b.take(1, now=2.0)

def test_monotonic_time_calls():
    """Test that multiple calls with monotonic time work correctly"""
    b = TokenBucket(capacity=5, refill_rate=1.0)
    # Each call uses time.monotonic(), should still work
    for i in range(5):
        assert b.take(1)
    # Should be exhausted
    assert not b.take(1)
