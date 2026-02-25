#!/bin/bash
# Auth verification script — tests signup, password hashing, login, middleware, and providers

BASE="http://localhost:3000"
echo "=== 1. POST /api/auth/signup — create user ==="
SIGNUP_RESULT=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}')
SIGNUP_BODY=$(echo "$SIGNUP_RESULT" | head -n -1)
SIGNUP_STATUS=$(echo "$SIGNUP_RESULT" | tail -1)
echo "Status: $SIGNUP_STATUS"
echo "Body: $SIGNUP_BODY"
echo ""

echo "=== 2. Check user table — password is hashed ==="
sqlite3 local.db "SELECT id, email, hashedPassword FROM user WHERE email='test@example.com';"
echo ""

echo "=== 3. POST /api/auth/callback/credentials — login ==="
# First get CSRF token
CSRF_RESPONSE=$(curl -s -c /tmp/auth-cookies.txt "$BASE/api/auth/csrf")
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['csrfToken'])" 2>/dev/null)
echo "CSRF Token: ${CSRF_TOKEN:0:20}..."

LOGIN_RESULT=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/auth/callback/credentials" \
  -b /tmp/auth-cookies.txt \
  -c /tmp/auth-cookies.txt \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=test@example.com&password=password123&csrfToken=$CSRF_TOKEN")
LOGIN_STATUS=$(echo "$LOGIN_RESULT" | tail -1)
echo "Login status: $LOGIN_STATUS (302 or 200 = success)"

# Check session after login
SESSION_RESULT=$(curl -s -b /tmp/auth-cookies.txt "$BASE/api/auth/session")
echo "Session: $SESSION_RESULT"
echo ""

echo "=== 4. GET /dashboard without auth — should redirect ==="
DASH_RESULT=$(curl -s -w "%{http_code}" -o /dev/null "$BASE/dashboard")
echo "Dashboard without auth: HTTP $DASH_RESULT (should be 307)"
echo ""

echo "=== 5. GET /api/auth/providers — lists both providers ==="
curl -s "$BASE/api/auth/providers" | python3 -m json.tool 2>/dev/null || curl -s "$BASE/api/auth/providers"
echo ""

# Cleanup
rm -f /tmp/auth-cookies.txt
echo "=== Done ==="
